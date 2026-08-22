---
title: 'Using Flutter Cryptography for Secure Local Encryption'
description: 'Learn how to encrypt and decrypt data locally in Flutter using AES-GCM and flutter_secure_storage. Practical code walkthrough with the cryptography package.'
date: 2024-11-05
tags: [flutter, dart, cryptography, aes, encryption, flutter_secure_storage]
draft: false
---

Whether you're building a finance tracker, secure messaging app, or just storing sensitive preferences, **securing local data is non-negotiable**. Flutter makes cross-platform development easy, but encryption support isn't always straightforward out of the box. That's where this simple yet powerful project comes in — **`flutter-cryptography`**.

Built around the [`cryptography`](https://pub.dev/packages/cryptography) package, this project demonstrates a practical way to encrypt and decrypt data locally in a Flutter app, using **AES-GCM** and securely storing keys with [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage).

## Why Encrypt Locally?

When storing sensitive data — like access tokens, passwords, or any personal user information — on a device, **plain text is not an option**. Mobile phones can be compromised, apps can be reverse-engineered, and sensitive data can leak. Encryption ensures:

- **Confidentiality:** Even if the storage is accessed, the data is unreadable.
- **Integrity:** AES-GCM provides authentication to prevent tampering.
- **Peace of mind:** You're doing right by your users.

## What This Demo Covers

The `flutter-cryptography` repository shows a complete encryption workflow in Dart:

1. **Key Generation:** On first use, a 256-bit AES key is generated and stored securely using `flutter_secure_storage`.
2. **Encrypting Text:** Plain text is encrypted using AES-GCM and encoded in base64 for easy storage.
3. **Decrypting Text:** The encrypted base64 string is decoded and decrypted using the same key.

The `Cryptor` class wraps all this logic, making it reusable and simple to integrate into any app.

```dart
final encrypted = await cryptor.encrypt('secret message');
final decrypted = await cryptor.decrypt(encrypted);
```

It's that straightforward.

## Why Use AES-GCM?

AES-GCM (Galois/Counter Mode) is a modern encryption standard that not only encrypts data but also verifies its integrity. It's fast, secure, and widely supported — ideal for mobile apps.

## What You'll Need

To get started, you'll need these dependencies in your `pubspec.yaml`:

```yaml
dependencies:
  cryptography: ^2.0.3
  flutter_secure_storage: ^9.0.0
```

Make sure you also configure `flutter_secure_storage` properly for iOS and Android. See their setup instructions for platform-specific steps.

## A Note on Key Management

This example keeps things simple by generating a single key and storing it securely on the device. In real-world apps, you may want:

- Key rotation strategies
- Biometric protection (e.g., using `local_auth`)
- Remote key storage for more sensitive use cases

## Wrap-Up

If you're looking to build Flutter apps that respect user privacy and handle sensitive data securely, `flutter-cryptography` is a solid starting point. It's small, focused, and easy to adapt.

Want to try it yourself? [View the code on GitHub →](https://github.com/hantsaniala/flutter-cryptography)
