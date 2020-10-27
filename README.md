# TS-Blockchain

[![TypeScript version][ts-badge]][typescript-41]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]

[![Donate][donate-badge]][donate]
[![Donate][donate-badge2]][donate2]

> A minimalistic blockchain written with Node.js + Express using TypeScript as the base programming language.

## Features

- A minimalistic blockchain
- P2P
- Proof of Work with mining
- With wallets and transactions
- NodeJS & Express
- TypeScript 4.1

## Endpoints

```http
GET   /blocks
POST  /mine
GET   /transactions
POST  /transact
GET   /mine-transactions
GET   /public-key
```

## Testing

The tests are written with Jest

```json
"jest": "26.6.1",
"ts-jest": "26.4.3",
```

## The road to v1

- Add swagger
- Add data persitance
- Build a smart-contract engine
- ... maybe a system of plugins

Open an issue if you want to drop an idea. ;-)

## Credits & Inspirations

- [Node TypeScript Boilerplate](https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/package.json)

# MIT License

Copyright (c) 2020 Philippe Matray

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[ts-badge]: https://img.shields.io/badge/TypeScript-3.4-blue.svg
[typescript-41]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2010.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/phmatray/ts-blockchain/blob/master/LICENSE
[donate-badge]: https://img.shields.io/badge/☕-buy%20me%20a%20coffee-46b798.svg
[donate]: https://www.paypal.me/phmatray/5eur
[donate-badge2]: https://img.shields.io/badge/🚘-buy%20me%20a%20Tesla-46b798.svg
[donate2]: https://www.paypal.me/phmatray/30000eur
