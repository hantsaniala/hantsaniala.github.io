---
title: 'Diffuser de la vidéo HLS chiffrée en AES-128 avec Go et FFmpeg'
description: "Chiffrer de la vidéo à la demande en HLS AES-128 avec FFmpeg, puis servir playlists, segments et clés depuis un petit serveur Go qui ne donne la clé qu'aux spectateurs autorisés."
date: 2026-11-20
tags: [go, hls, ffmpeg, streaming, encryption, video]
lang: fr
draft: false
---

Si vous servez vos vidéos en simples fichiers MP4, n'importe qui disposant de l'URL peut les télécharger. HLS avec chiffrement AES-128 est une amélioration simple : la vidéo est découpée en petits segments chiffrés, et le lecteur a besoin d'une clé pour les lire. C'est votre serveur qui décide qui obtient cette clé.

C'est l'approche derrière [hStream](https://github.com/hantsaniala/hStream), un petit serveur HLS de vidéo à la demande écrit en Go.

## Ce que HLS AES-128 apporte (et ce qu'il n'apporte pas)

Le chiffrement HLS chiffre chaque segment `.ts` en AES-128, en mode CBC. La playlist (`.m3u8`) contient une ligne `#EXT-X-KEY` qui pointe vers l'URL d'une clé. Le lecteur récupère la clé, puis déchiffre les segments pendant la lecture.

Cela protège les fichiers stockés et sur les CDN, et permet de contrôler la lecture via l'endpoint de la clé. Ce n'est **pas un DRM** : un spectateur que vous avez autorisé peut toujours extraire la clé de sa propre session. Pour des cours, de la formation interne ou du contenu réservé aux membres, ce compromis convient en général.

## Étape 1 : chiffrer avec FFmpeg

Générez une clé aléatoire de 16 octets par vidéo :

```bash
openssl rand 16 > video.key
```

FFmpeg lit un *fichier d'informations de clé* de trois lignes au plus : l'URI de la clé écrite dans la playlist, le chemin local du fichier de clé, et un IV optionnel en hexadécimal.

```text
/keys/my-video
video.key
```

Puis transcodez et découpez :

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -c:a aac \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_key_info_file key.info \
  -hls_segment_filename 'out/seg_%03d.ts' \
  out/index.m3u8
```

La playlist obtenue contient quelque chose comme :

```text
#EXT-X-KEY:METHOD=AES-128,URI="/keys/my-video"
```

Les segments `.ts` sont désormais inutilisables sans la clé. Le fichier de clé lui-même ne doit **pas** se trouver dans le dossier public.

## Étape 2 : servir depuis Go

Le serveur Go a deux rôles : servir les playlists et les segments comme fichiers statiques, et ne donner les clés qu'aux spectateurs autorisés.

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

Quelques détails comptent :

- **L'identifiant est validé** avant de toucher au système de fichiers, donc les astuces en `../` ne peuvent pas lire d'autres fichiers.
- **Les clés sont hors du dossier statique**, le serveur de fichiers ne peut donc jamais les exposer.
- **`Cache-Control: no-store`** empêche les caches partagés de conserver les clés.
- `canWatch` accueille vos propres règles : un cookie de session, un jeton signé dans l'URL, une vérification d'abonnement.

## Étape 3 : lire la vidéo

Safari et iOS lisent HLS nativement. Partout ailleurs, [hls.js](https://github.com/video-dev/hls.js) fait le travail :

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

Comme l'URL de la clé est relative à votre domaine, le navigateur envoie les cookies du spectateur avec la requête de clé, et `canWatch` peut vérifier la session.

## Pour aller plus loin

- **Rotation des clés :** l'option FFmpeg `-hls_flags periodic_rekey` relit le fichier d'informations de clé, ce qui permet d'utiliser plusieurs clés sur une longue vidéo.
- **Lecture hors ligne** sur mobile : téléchargez les segments et la clé dans le stockage de l'app, et gardez la clé dans le stockage sécurisé de la plateforme plutôt qu'à côté de la vidéo.
- **Plusieurs qualités :** lancez FFmpeg une fois par rendu et ajoutez une playlist maître pour que le lecteur adapte le débit.

Le HLS chiffré n'est pas compliqué : FFmpeg s'occupe de la cryptographie, et le serveur Go n'est qu'un serveur de fichiers avec un endpoint protégé.
