# 🔐 Advanced Fingerprint Library

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Size](https://img.shields.io/badge/Size-~8KB-green.svg)]()
[![Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)]()

**Bibliothèque avancée de fingerprinting pour générer des identifiants uniques de navigateur**

Utilise le canvas, l'audio et l'entropie matérielle • Zéro dépendance • 100% client-side

[🚀 Démo en ligne](https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/index.html) • [📖 Documentation](#utilisation) • [⚡ Démarrage rapide](#démarrage-rapide)

</div>

---

## ✨ Fonctionnalités

- 🎨 **Multiples sources d'entropie** : Canvas, AudioContext, WebGL, Spécifications matérielles, User Agent
- 🔄 **API Fluent** : Méthodes chaînables pour un code propre et lisible
- ⚡ **Support Sync/Async** : Génération synchrone et asynchrone selon vos besoins
- 🎯 **Trois portées** : `device` | `browser` | `session` pour différents cas d'usage
- 🔧 **Personnalisable** : Contrôle de la longueur, casse (min/maj/mixte), et sources d'entropie
- 🪶 **Léger** : ~8KB minifié, zéro dépendance externe
- 🔒 **Privacy-First** : Aucune donnée envoyée aux serveurs, 100% client-side
- 📱 **Cross-Navigateur** : Chrome, Firefox, Safari, Edge, Opera

---

## 🚀 Démarrage rapide

### Installation

Incluez le script dans votre HTML :

```html
<!-- Version minifiée (recommandée) -->
<script src="https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/fp.min.js"></script>

<!-- Version complète -->
<script src="https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/fp.js"></script>
```

### Usage basique

```javascript
// Générer une empreinte appareil standard
const fp = new Fingerprint().generate();
console.log(fp); // "a7f3k9m2p5q8r4t6u1v0w3x7y9z2b4c5"
```

### Génération asynchrone

```javascript
// Pour le fingerprinting audio (nécessite async)
const fp = await new Fingerprint()
    .audio(true)
    .generateAsync();
```

---

## 📖 Utilisation

### 1. Chaînage Fluent

Configurez votre empreinte avec des méthodes chaînables :

```javascript
const fp = new Fingerprint()
    .length(32)           // 8-64 caractères
    .casing('uppercase')  // 'lowercase' | 'uppercase' | 'mixed'
    .scope('device')      // 'device' | 'browser' | 'session'
    .canvas(true)         // Inclure l'entropie canvas
    .audio(true)          // Inclure l'entropie audio
    .webgl(false)         // Exclure WebGL
    .generate();
```

### 2. Préréglages rapides par portée

Utilisez les configurations prédéfinies :

```javascript
// Matériel + Canvas + Audio (plus stable)
const deviceFp = Fingerprint.device()
    .length(16)
    .casing('mixed')
    .generate();

// + User Agent, plugins, WebGL
const browserFp = await Fingerprint.browser()
    .length(64)
    .generateAsync();

// Minimal : langue, timezone, écran uniquement
const sessionFp = Fingerprint.session()
    .generate();
```

### 3. Génération statique rapide

One-liner pour les cas simples :

```javascript
const fp = await Fingerprint.generateAsync({
    length: 32,
    casing: 'uppercase',
    scope: 'device',
    includeCanvas: true,
    includeAudio: true
});
```

### 4. Debug & Données brutes

Inspectez les composants collectés :

```javascript
const fp = new Fingerprint()
    .scope('device')
    .collect();

console.log(fp.raw());
// ['ua:Mozilla/5.0...', 'canvas:data:image/png...', 'audio:sig:12345', ...]

console.log(fp.generate()); // Hash final
```

### 5. Comparaison de similarité

Détectez les changements d'empreinte (utile pour la détection de fraude) :

```javascript
const fp1 = new Fingerprint().generate();
const fp2 = new Fingerprint().generate();

const similarity = Fingerprint.compare(fp1, fp2);
// Retourne 0.0 à 1.0 (1.0 = identique)

if (similarity < 0.9) {
    console.warn('Configuration appareil modifiée !');
}
```

---

## ⚙️ Options de configuration

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `length` | Number | 32 | Longueur de l'empreinte (8-64) |
| `casing` | String | 'lowercase' | 'lowercase' \| 'uppercase' \| 'mixed' |
| `scope` | String | 'device' | 'device' \| 'browser' \| 'session' |
| `includeCanvas` | Boolean | true | Entropie de rendu Canvas |
| `includeAudio` | Boolean | true | Entropie AudioContext |
| `includeWebGL` | Boolean | false | Infos renderer WebGL |

### Explication des portées

| Portée | Sources d'entropie | Cas d'usage |
|--------|-------------------|-------------|
| **device** | Matériel, Canvas, Audio, Écran | Tracking cross-navigateur par appareil |
| **browser** | Device + User Agent, Plugins, WebGL | Tracking spécifique au navigateur |
| **session** | Langue, Timezone, Bases écran | Identification temporaire/session |

---

## 🏗️ Référence API

### Constructeur

```javascript
new Fingerprint(config?)
```

### Méthodes d'instance (Chaînables)

| Méthode | Paramètres | Retour | Description |
|---------|-----------|--------|-------------|
| `.length(n)` | Number | this | Définit la longueur |
| `.casing(style)` | String | this | Définit la casse |
| `.scope(type)` | String | this | Définit la portée |
| `.canvas(bool)` | Boolean | this | Active/désactive canvas |
| `.audio(bool)` | Boolean | this | Active/désactive audio |
| `.webgl(bool)` | Boolean | this | Active/désactive WebGL |
| `.collect()` | - | this | Collecte les données |
| `.generate()` | - | String | Génère le hash |
| `.generateAsync()` | - | Promise<String> | Génération async |
| `.raw()` | - | Array | Données brutes |
| `.get()` | - | String\|null | Dernier résultat |

### Méthodes statiques

| Méthode | Paramètres | Retour | Description |
|---------|-----------|--------|-------------|
| `Fingerprint.generate(config?)` | Object | String | Génération sync rapide |
| `Fingerprint.generateAsync(config?)` | Object | Promise<String> | Génération async rapide |
| `Fingerprint.device()` | - | Fingerprint | Instance portée device |
| `Fingerprint.browser()` | - | Fingerprint | Instance portée browser |
| `Fingerprint.session()` | - | Fingerprint | Instance portée session |
| `Fingerprint.compare(fp1, fp2)` | String, String | Number | Compare la similarité |

---

## 🖥️ Démo interactive

### Cloner et tester localement

```bash
git clone https://github.com/Lombard-Web-Services/Advanced-Fingerprinting-Library.git
cd Advanced-Fingerprinting-Library

# Servez avec n'importe quel serveur statique
python -m http.server 8000
# ou
npx serve .
```

Puis ouvrez [http://localhost:8000](http://localhost:8000)

Ou accédez directement à la [**démo en ligne**](https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/index.html)

---

## 🔧 Support navigateur

| Navigateur | Version | Notes |
|-----------|---------|-------|
| Chrome | 60+ | Support complet |
| Firefox | 55+ | Support complet |
| Safari | 12+ | Support complet |
| Edge | 79+ | Support complet |
| Opera | 47+ | Support complet |

> ⚠️ Le fingerprinting audio nécessite le support de Web Audio API.

---

## 📁 Structure des fichiers

```
Advanced-Fingerprinting-Library/
├── index.html          # Page de démo interactive
├── fp.js               # Librairie source (~15KB)
├── fp.min.js           # Librairie minifiée (~8KB)
└── README.md           # Documentation
```

---

## ⚠️ Avis de confidentialité

### ✅ Utilisations légitimes

Cette bibliothèque est conçue pour des fins de sécurité légitimes telles que :

- Détection de fraude
- Protection contre les bots
- Gestion de session
- Analytics (anonymisés)

### ❌ Ne pas utiliser pour

- Tracking cross-site sans consentement
- Violation des lois sur la vie privée (RGPD, CCPA)
- Fingerprinting d'utilisateurs ayant refusé

> **Important** : Informez toujours les utilisateurs si du fingerprinting est effectué et fournissez des mécanismes d'opt-out lorsque requis par la loi.

---

## 📄 Licence

**MIT License** - voir le fichier [LICENSE](./LICENSE) pour les détails.

Copyright © 2026 [Lombard Web Services](https://lombard-web-services.com/)

---

## 👤 Auteur

**Thibaut LOMBARD**

- Twitter: [@lombardweb](https://x.com/lombardweb)
- GitHub: [Lombard-Web-Services](https://github.com/Lombard-Web-Services)

---

<div align="center">

⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !

</div>
