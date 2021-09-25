# hmac-authenticated-payload

A TypeScript wrapper class to authenticate an enclosed object (the 'payload') using a keyed message authentication code.

## Table of Contents

1. [Description](#1-description)
1. [Installation](#2-installation)
1. [Usage](#3-usage)
1. [Contributing](#4-contributing)
1. [Version History](#5-version-history)
1. [License](#6-license)

## 1. Description

This package contains a TypeScript wrapper class to authenticate an enclosed object (the 'payload') using a keyed message authentication code.

## 2. Installation

This framework is available as a Node.js-module. You can thus use Node.js' package manager `npm` to install the latest production version from the [npm registry](https://npmjs.com).

For using the library in your own application install the package locally by running the following command

    sudo npm i @henningkerstan/hmac-authenticated-payload

in your project's directory.

## 3. Usage

Since this framework is written in TypeScript, you can use it both with TypeScript as well as with plain JavaScript. Below you can find short examples to get you started in both languages.

The library also comes with an online [documentation](https://henningkerstan.github.io/hmac-authenticated-payload/). A good starting point for further reading is the [documentation of the HMACAuthenticatedPayload class](https://henningkerstan.github.io/hmac-authenticated-payload/classes/HMACAuthenticatedPayload.HMACAuthenticatedPayload-1.html). Moreover, as this documentation is generated from source code comments using [TypeDoc](https://typedoc.org), a supported editor (like [Visual Studio Code](https://code.visualstudio.com/)) can provide on-the-fly information on functions, parameters, etc..

All functionality is contained in the [HMACAuthenticatedPayload class](https://henningkerstan.github.io/hmac-authenticated-payload/classes/HMACAuthenticatedPayload.HMACAuthenticatedPayload-1.html), hence you only need to import this class. See below for an example usage.

```typescript
import { HMACAuthenticatedPayload } from 'hmac-authenticated-payload'

// for this example we will use a specific key; to create a new key use HMACAuthenticatedPayload.createKey()
const key = Buffer.from(
  'FJLBeYqN8m7DQK42LFheBPzvNRXD3Xoa1hk+xp2yjki85sm2hFH1G4I1WplB9ow66CEwMxrwo+ZRjtieP+x+Qg==',
  'base64'
)

// we create HMACAuthenticatedPayload with a string as payload ...
const stringPayload = 'Hello world!'
let ad = HMACAuthenticatedPayload.create(key, stringPayload)
console.log(ad)

// ... and validation succeeds
console.log('Valid?: ' + ad.validate(key))

// we create MACAuthenticatedPayload with an Object as payload
const objectPayload = {
  type: 'phdthesis',
  citeKey: 'Ker16',
  title:
    'Coalgebraic Behavior Analysis – From Qualitative to Quantitative Analyses',
  year: 2016,
  authors: ['Henning Kerstan'],
  school: 'Universität Duisburg-Essen',
  url: 'https://henningkerstan.de/en/publications/ker16/',
}
const ad2 = HMACAuthenticatedPayload.create(key, objectPayload)
console.log(ad2)

// ... and again validation succeeds
console.log('Valid?: ' + ad2.validate(key))

// now we create HMACAuthenticatedPayload from known (received) data ...
ad = new HMACAuthenticatedPayload(
  'Hello world!',
  'nonce',
  'dzxKYMDooQJE2SaUqV5TD5SybsPNVtRUs1qNuZWVzrSrtcI4OVRaM1TFTzHNejZYtz33xsUHmNq423ufGYjuVA=='
)
console.log(ad)

// ... and validation succeeds
console.log('Valid?: ' + ad.validate(key))

// however, if we change ad slightly (replace ! by ?)
ad = new HMACAuthenticatedPayload(
  'Hello world?',
  'nonce',
  'dzxKYMDooQJE2SaUqV5TD5SybsPNVtRUs1qNuZWVzrSrtcI4OVRaM1TFTzHNejZYtz33xsUHmNq423ufGYjuVA=='
)
console.log(ad)

// ... validation fails!
console.log('Valid?: ' + ad.validate(key))
```

## 4. Contributing

Contact the main author ([Henning Kerstan](https://henningkerstan.de)) if you want to contribute. More details will be available here soon.

This project uses [semantic versioning](https://semver.org/). However, despite most of the API being ready, note that since we are still in development (version 0.x.y), anything may yet change at any time.

For detailed information on the (minimal) required versions, have a look at the [package.json](https://github.com/henningkerstan/hmac-authenticated-payload/blob/main/package.json).

## 5. Version history

As this library has not yet fully matured (version is still < 1.0.0), please have a look at the git commit log for a version history.

## 6. License

Copyright 2021 [Henning Kerstan](https://henningkerstan.de)

SPDX-License-Identifier: Apache-2.0
