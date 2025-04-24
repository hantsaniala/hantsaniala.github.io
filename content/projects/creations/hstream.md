---
title: hStream – Lightweight HLS VOD Server in Go
date: 2024-08-20T10:00:00-05:00
featured: true
link: 'https://github.com/hantsaniala/hStream'
# image: '/img/hstream-preview.webp'
description: Minimal HLS VOD server written in Go for lightweight video streaming using `.m3u8` playlists and `.ts` segments.
tags:
  - Go
  - HLS
  - Video Streaming
  - Docker
  - HTTP
  - Media
  - Server
fact: No external dependencies—written entirely in Go for maximum simplicity.
weight: 500
sitemap:
  priority: 0.8
  weight: 0.4
---

hStream is a minimal HLS (HTTP Live Streaming) VOD server written in Go. It serves segmented `.ts` video files over HTTP using `.m3u8` playlists, ideal for testing and lightweight video streaming setups. It provides a simple, dependency-free way to host and stream video content using the HLS protocol. Designed for easy deployment in Dockerized environments and capable of handling static assets and playlists with configurable segment durations.
