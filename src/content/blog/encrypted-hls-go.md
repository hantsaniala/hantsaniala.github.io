---
title: 'Serving AES-128 Encrypted HLS Video with Go and FFmpeg'
description: 'Encrypt video-on-demand with HLS AES-128 using FFmpeg, then serve playlists, segments and keys from a small Go server that only hands the key to authorised viewers.'
date: 2026-11-20
tags: [go, hls, ffmpeg, streaming, encryption, video]
draft: false
---

If you serve video files as plain MP4s, anyone with the URL can download them. HLS with AES-128 encryption is a simple step up: the video is cut into small encrypted segments, and the player needs a key to play them. Your server decides who gets that key.

This is the approach behind [hStream](https://github.com/hantsaniala/hStream), a small HLS video-on-demand server written in Go.

## What AES-128 HLS gives you (and what it does not)

HLS encryption encrypts each `.ts` segment with AES-128 in CBC mode. The playlist (`.m3u8`) contains an `#EXT-X-KEY` line pointing at a key URL. The player fetches the key, then decrypts segments as it plays.

That protects the files at rest and on CDNs, and lets you control playback through the key endpoint. It is **not DRM**: a viewer you authorised can still extract the key from their own session. For courses, internal training or member-only content, that trade-off is usually fine.

## Step 1: encrypt with FFmpeg

Generate a random 16-byte key per video:

```bash
openssl rand 16 > video.key
```

FFmpeg reads a *key info file* with up to three lines: the key URI written into the playlist, the local path of the key file, and an optional IV in hex.

```text
/keys/my-video
video.key
```

Then transcode and segment:

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_key_info_file key.info \
  -hls_segment_filename 'out/seg_%03d.ts' \
  out/index.m3u8
```

The resulting playlist contains something like:

```text
#EXT-X-KEY:METHOD=AES-128,URI="/keys/my-video"
```

The `.ts` segments are now useless without the key. The key file itself must **not** be in the public output folder.

## Step 2: serve it from Go

The Go server has two jobs: serve playlists and segments as static files, and serve keys only to viewers who are allowed to watch.

```go
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
)

var validID = regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)

func keyHandler(keysDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if !validID.MatchString(id) {
			http.NotFound(w, r)
			return
		}
		if !canWatch(r, id) {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		key, err := os.ReadFile(filepath.Join(keysDir, id+".key"))
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Cache-Control", "no-store")
		w.Write(key)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("GET /videos/", http.StripPrefix("/videos/", http.FileServer(http.Dir("public/videos"))))
	mux.HandleFunc("GET /keys/{id}", keyHandler("private/keys"))
	log.Fatal(http.ListenAndServe(":8080", mux))
}
```

A few details matter here:

- **The ID is validated** before it touches the filesystem, so `../` tricks cannot read other files.
- **Keys live outside the static folder**, so the file server can never expose them.
- **`Cache-Control: no-store`** keeps keys out of shared caches.
- `canWatch` is where your own rules go: a session cookie, a signed token in the query string, a subscription check.

## Step 3: play it

Safari and iOS play HLS natively. Everywhere else, [hls.js](https://github.com/video-dev/hls.js) does the job:

```html
<video id="player" controls></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@1"></script>
<script>
  const video = document.getElementById('player');
  const src = '/videos/my-video/index.m3u8';
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  } else if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
  }
</script>
```

Because the key URL is relative to your domain, the browser sends the viewer's cookies with the key request, and `canWatch` can check the session.

## Going further

- **Key rotation:** FFmpeg's `-hls_flags periodic_rekey` re-reads the key info file, so long videos can use several keys.
- **Offline playback** on mobile: download segments and key into app storage, and keep the key in the platform's secure storage rather than next to the video.
- **Several qualities:** run FFmpeg once per rendition and add a master playlist so players can switch bitrate.

Encrypted HLS is not complicated: FFmpeg does the cryptography, and the Go server is mostly a file server with one guarded endpoint.
