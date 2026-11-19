---
title: 'Chiffrement local sécurisé avec Flutter Cryptography'
description: 'Chiffrer et déchiffrer des données en local dans une app Flutter avec AES-GCM et flutter_secure_storage. Un exemple de code concret avec le package cryptography.'
date: 2024-11-05
tags: [flutter, dart, cryptography, aes, encryption, flutter_secure_storage]
lang: fr
draft: false
---

Que vous construisiez une app de suivi financier, une messagerie sécurisée ou que vous stockiez simplement des préférences sensibles, **sécuriser les données locales n'est pas négociable**. Flutter facilite le développement multiplateforme, mais le chiffrement n'est pas toujours simple à mettre en place. C'est là qu'intervient ce petit projet : **`flutter-cryptography`**.

Construit autour du package [`cryptography`](https://pub.dev/packages/cryptography), il montre une façon concrète de chiffrer et déchiffrer des données en local dans une app Flutter, avec **AES-GCM**, et de stocker les clés de manière sécurisée avec [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage).

## Pourquoi chiffrer en local ?

Quand on stocke des données sensibles sur un appareil (jetons d'accès, mots de passe, informations personnelles), **le texte en clair n'est pas une option**. Un téléphone peut être compromis, une app peut être décompilée, et des données sensibles peuvent fuiter. Le chiffrement garantit :

- **La confidentialité :** même si le stockage est lu, les données restent illisibles.
- **L'intégrité :** AES-GCM authentifie les données et empêche toute modification.
- **La tranquillité d'esprit :** vous protégez vraiment vos utilisateurs.

## Ce que montre la démo

Le dépôt `flutter-cryptography` montre un processus de chiffrement complet en Dart :

1. **Génération de la clé :** à la première utilisation, une clé AES de 256 bits est générée et stockée de façon sécurisée avec `flutter_secure_storage`.
2. **Chiffrement :** le texte en clair est chiffré avec AES-GCM puis encodé en base64 pour être stocké facilement.
3. **Déchiffrement :** la chaîne base64 est décodée puis déchiffrée avec la même clé.

La classe `Cryptor` regroupe toute cette logique, ce qui la rend réutilisable et facile à intégrer dans n'importe quelle app.

```dart
final encrypted = await cryptor.encrypt('secret message');
final decrypted = await cryptor.decrypt(encrypted);
```

C'est aussi simple que ça.

## Pourquoi AES-GCM ?

AES-GCM (Galois/Counter Mode) est un standard de chiffrement moderne qui chiffre les données et vérifie aussi leur intégrité. Il est rapide, sûr et largement supporté : idéal pour les apps mobiles.

## Ce dont vous avez besoin

Pour commencer, ajoutez ces dépendances dans votre `pubspec.yaml` :

```yaml
dependencies:
  cryptography: ^2.0.3
  flutter_secure_storage: ^9.0.0
```

Pensez aussi à configurer correctement `flutter_secure_storage` pour iOS et Android. Consultez sa documentation pour les étapes propres à chaque plateforme.

## Un mot sur la gestion des clés

Cet exemple reste simple : il génère une seule clé et la stocke de façon sécurisée sur l'appareil. Dans une vraie app, vous voudrez peut-être :

- une stratégie de rotation des clés,
- une protection biométrique (par exemple avec `local_auth`),
- un stockage distant des clés pour les cas les plus sensibles.

## En résumé

Si vous voulez construire des apps Flutter qui respectent la vie privée de leurs utilisateurs et gèrent les données sensibles de façon sûre, `flutter-cryptography` est un bon point de départ. Il est petit, ciblé et facile à adapter.

Envie d'essayer ? [Voir le code sur GitHub →](https://github.com/hantsaniala/flutter-cryptography)
