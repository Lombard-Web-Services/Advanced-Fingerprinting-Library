# 🔐 Advanced Fingerprinting Library

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Size](https://img.shields.io/badge/Size-~8KB-green.svg)]()
[![Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)]()

**Advanced fingerprinting library for generating unique browser identifiers**

Uses canvas, audio, and hardware entropy • Zero dependencies • 100% client-side

[🚀 Live Demo](https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/index.html) • [📖 Documentation](#usage) • [⚡ Quick Start](#quick-start)

</div>

---

## ✨ Features

- 🎨 **Multiple entropy sources**: Canvas, AudioContext, WebGL, Hardware Specs, User Agent
- 🔄 **Fluent API**: Chainable methods for clean and readable code
- ⚡ **Sync/Async Support**: Synchronous and asynchronous generation based on your needs
- 🎯 **Three scopes**: `device` | `browser` | `session` for different use cases
- 🔧 **Customizable**: Control length, casing (lowercase/uppercase/mixed), and entropy sources
- 🪶 **Lightweight**: ~8KB minified, zero external dependencies
- 🔒 **Privacy-First**: No data sent to servers, 100% client-side
- 📱 **Cross-Browser**: Chrome, Firefox, Safari, Edge, Opera

---

## 🚀 Quick Start

### Installation

Include the script in your HTML:

```html
<!-- Minified version (recommended) -->
<script src="https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/fp.min.js"></script>

<!-- Full version -->
<script src="https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/fp.js"></script>
```

### Basic Usage

```javascript
// Generate a standard device fingerprint
const fp = new Fingerprint().generate();
console.log(fp); // "a7f3k9m2p5q8r4t6u1v0w3x7y9z2b4c5"
```

### Asynchronous Generation

```javascript
// For audio fingerprinting (requires async)
const fp = await new Fingerprint()
    .audio(true)
    .generateAsync();
```

---

## 📖 Usage

### 1. Fluent Chaining

Configure your fingerprint with chainable methods:

```javascript
const fp = new Fingerprint()
    .length(32)           // 8-64 characters
    .casing('uppercase')  // 'lowercase' | 'uppercase' | 'mixed'
    .scope('device')      // 'device' | 'browser' | 'session'
    .canvas(true)         // Include canvas entropy
    .audio(true)          // Include audio entropy
    .webgl(false)         // Exclude WebGL
    .generate();
```

### 2. Quick Scope Presets

Use predefined configurations:

```javascript
// Hardware + Canvas + Audio (most stable)
const deviceFp = Fingerprint.device()
    .length(16)
    .casing('mixed')
    .generate();

// + User Agent, plugins, WebGL
const browserFp = await Fingerprint.browser()
    .length(64)
    .generateAsync();

// Minimal: language, timezone, screen only
const sessionFp = Fingerprint.session()
    .generate();
```

### 3. Quick Static Generation

One-liner for simple cases:

```javascript
const fp = await Fingerprint.generateAsync({
    length: 32,
    casing: 'uppercase',
    scope: 'device',
    includeCanvas: true,
    includeAudio: true
});
```

### 4. Debug & Raw Data

Inspect collected components:

```javascript
const fp = new Fingerprint()
    .scope('device')
    .collect();

console.log(fp.raw());
// ['ua:Mozilla/5.0...', 'canvas:data:image/png...', 'audio:sig:12345', ...]

console.log(fp.generate()); // Final hash
```

### 5. Similarity Comparison

Detect fingerprint changes (useful for fraud detection):

```javascript
const fp1 = new Fingerprint().generate();
const fp2 = new Fingerprint().generate();

const similarity = Fingerprint.compare(fp1, fp2);
// Returns 0.0 to 1.0 (1.0 = identical)

if (similarity < 0.9) {
    console.warn('Device configuration changed!');
}
```

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `length` | Number | 32 | Fingerprint length (8-64) |
| `casing` | String | 'lowercase' | 'lowercase' \| 'uppercase' \| 'mixed' |
| `scope` | String | 'device' | 'device' \| 'browser' \| 'session' |
| `includeCanvas` | Boolean | true | Canvas rendering entropy |
| `includeAudio` | Boolean | true | AudioContext entropy |
| `includeWebGL` | Boolean | false | WebGL renderer info |

### Scope Explanation

| Scope | Entropy Sources | Use Case |
|-------|----------------|----------|
| **device** | Hardware, Canvas, Audio, Screen | Cross-browser device tracking |
| **browser** | Device + User Agent, Plugins, WebGL | Browser-specific tracking |
| **session** | Language, Timezone, Basic screen | Temporary/session identification |

---

## 🏗️ API Reference

### Constructor

```javascript
new Fingerprint(config?)
```

### Instance Methods (Chainable)

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `.length(n)` | Number | this | Set length |
| `.casing(style)` | String | this | Set casing |
| `.scope(type)` | String | this | Set scope |
| `.canvas(bool)` | Boolean | this | Enable/disable canvas |
| `.audio(bool)` | Boolean | this | Enable/disable audio |
| `.webgl(bool)` | Boolean | this | Enable/disable WebGL |
| `.collect()` | - | this | Collect data |
| `.generate()` | - | String | Generate hash |
| `.generateAsync()` | - | Promise<String> | Async generation |
| `.raw()` | - | Array | Raw data |
| `.get()` | - | String\|null | Last result |

### Static Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `Fingerprint.generate(config?)` | Object | String | Quick sync generation |
| `Fingerprint.generateAsync(config?)` | Object | Promise<String> | Quick async generation |
| `Fingerprint.device()` | - | Fingerprint | Device scope instance |
| `Fingerprint.browser()` | - | Fingerprint | Browser scope instance |
| `Fingerprint.session()` | - | Fingerprint | Session scope instance |
| `Fingerprint.compare(fp1, fp2)` | String, String | Number | Compare similarity |

---

## 🖥️ Interactive Demo

### Clone and Test Locally

```bash
git clone https://github.com/Lombard-Web-Services/Advanced-Fingerprinting-Library.git
cd Advanced-Fingerprinting-Library

# Serve with any static server
python -m http.server 8000
# or
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000)

Or access directly the [**live demo**](https://lombard-web-services.github.io/Advanced-Fingerprinting-Library/index.html)

---

## 🔧 Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 60+ | Full support |
| Firefox | 55+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support |
| Opera | 47+ | Full support |

> ⚠️ Audio fingerprinting requires Web Audio API support.

---

## 📁 File Structure

```
Advanced-Fingerprinting-Library/
├── index.html          # Interactive demo page
├── fp.js               # Source library (~15KB)
├── fp.min.js           # Minified library (~8KB)
└── README.md           # Documentation
```

---

## ⚠️ Privacy Notice

### ✅ Legitimate Uses

This library is designed for legitimate security purposes such as:

- Fraud detection
- Bot protection
- Session management
- Analytics (anonymized)

### ❌ Do Not Use For

- Cross-site tracking without consent
- Violation of privacy laws (GDPR, CCPA)
- Fingerprinting users who opted out

> **Important**: Always inform users if fingerprinting is being performed and provide opt-out mechanisms when required by law.

---

## 📄 License

**MIT License** - see the [LICENSE](./LICENSE) file for details.

Copyright © 2026 [Lombard Web Services](https://lombard-web-services.com/)

---

## 👤 Author

**Thibaut LOMBARD**

- Twitter: [@lombardweb](https://x.com/lombardweb)
- GitHub: [Lombard-Web-Services](https://github.com/Lombard-Web-Services)

---

<div align="center">

⭐ If this project is useful to you, feel free to give it a star!

</div>
