# @exodus/test

[![](https://img.shields.io/npm/v/@exodus/test?style=flat-square)](https://npmjs.org/package/@exodus/test)
[![](https://img.shields.io/github/release/ExodusOSS/test?style=flat-square&icon=github)](https://github.com/ExodusOSS/test/releases)
[![](https://img.shields.io/npm/l/@exodus/test?style=flat-square&color=blue)](https://github.com/ExodusOSS/test/blob/HEAD/LICENSE)
[![](https://img.shields.io/github/check-runs/ExodusOSS/test/main?style=flat-square&icon=github)](https://github.com/ExodusOSS/test/actions/workflows/checks.yml?query=branch%3Amain)
[![](https://img.shields.io/github/stars/ExodusOSS/test)](https://github.com/ExodusOSS/test/stargazers)

A runner for `node:test`, `jest`, and `tape` test suites on top of `node:test` (and any runtime).

---

It can run your existing tests on [all runtimes and also browsers](#engines), with snapshots and module mocks:

[![Node.js](https://img.shields.io/badge/Node.js-338750?style=flat-square&logo=Node.js&logoColor=FFF)](https://nodejs.org/api/test.html)
[![Deno](https://img.shields.io/badge/Deno-121417?style=flat-square&logo=Deno&logoColor=FFF)](https://deno.com/)
[![Bun](https://img.shields.io/badge/Bun-F472B6?style=flat-square&logo=Bun&logoColor=FFF)](https://bun.sh/)
[![Electron](https://img.shields.io/badge/Electron-2F3242?style=flat-square&logo=Electron&logoColor=A2ECFB)](http://electronjs.org/)\
[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=flat-square&logo=GoogleChrome&logoColor=FFF)](https://www.chromium.org/Home/)
[![WebKit](https://img.shields.io/badge/WebKit-006CFF?style=flat-square&logo=Safari&logoColor=FFF)](http://webkit.org/)
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=flat-square&logo=Firefox&logoColor=FFF)](https://github.com/mozilla-firefox)
[![Brave](https://img.shields.io/badge/Brave-F0F0F0?style=flat-square&logo=Brave)](https://github.com/brave)
[![Microsoft Edge](https://img.shields.io/badge/Edge-0078D7?style=flat-square)](https://github.com/microsoftedge)
[![Servo](https://img.shields.io/badge/Servo-009D9A?style=flat-square)](https://servo.org/)\
[![Hermes](https://img.shields.io/badge/Hermes-282C34?style=flat-square&logo=React)](https://hermesengine.dev)
[![V8](https://img.shields.io/badge/V8-4285F4?style=flat-square&logo=V8&logoColor=white)](https://v8.dev/docs/d8)
[![JavaScriptCore](https://img.shields.io/badge/JavaScriptCore-006CFF?style=flat-square)](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html)
[![SpiderMonkey](https://img.shields.io/badge/SpiderMonkey-FFD681?style=flat-square)](https://spidermonkey.dev/)
[![QuickJS](https://img.shields.io/badge/QuickJS-E58200?style=flat-square)](https://github.com/quickjs-ng/quickjs)
[![XS](https://img.shields.io/badge/XS-0B307A?style=flat-square)](https://github.com/Moddable-OpenSource/moddable-xst)
[![GraalJS](https://img.shields.io/badge/GraalJS-C74634?style=flat-square)](https://github.com/oracle/graaljs)
[![Boa](https://img.shields.io/badge/Boa-F3FF00?style=flat-square)](https://github.com/boa-dev/boa)
[![Escargot](https://img.shields.io/badge/Escargot-1428A0?style=flat-square)](https://github.com/Samsung/escargot)
[![engine262](https://img.shields.io/badge/engine262-f0db4f?style=flat-square&logo=javascript&logoColor=000)](https://github.com/engine262/engine262)

Compatible with tests written in:

[![node:test](https://img.shields.io/badge/node:test-338750?style=for-the-badge&logo=Node.js&logoColor=FFF)](#using-with-nodetest-tests)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=fff)](#migrating-from-jest)
[![tape](https://img.shields.io/badge/tape-6c5353?style=for-the-badge)](#migrating-from-tape)

See [documentation](https://exodusoss.github.io/test/).

## Features

- Native ESM, including in Jest tests
- Esbuild on the fly for old faux-ESM interop (enable via `--esbuild`)
- TypeScript support
- Runs anywhere (including Hermes, the [React Native](https://reactnative.dev/) JavaScript engine)
- Use snapshots to cross-compare between runtimes, browsers and barebones (including Hermes)
- Testsuite-agnostic — can run any file as long as it sets exit code based on test results
- Built-in [Jest](https://jestjs.io) compatibility (with `--jest`), including `jest.*` global
  - Up to ~10x faster depending on the original setup
  - Actual `expect` module, also `jest-extended` and `jest-when` just work on top
  - Snapshots, including snapshot matchers
  - Function and timer mocks
  - [test.concurrent](https://jestjs.io/docs/api#testconcurrentname-fn-timeout)
  - Module mocks, including for ESM modules (already loaded ESM modules can be mocked only on `node:test`)
  - Loads Jest configuration
- Built-in network record/replay for offline tests, mocking `fetch` and `WebSocket` sessions
- `--drop-network` support for guaranteed offline testing
- Native code coverage via v8 (Node.js or [c8](https://github.com/bcoe/c8)), with istanbul reporters
- GitHub reporter (auto-enabled by default)
- JSDOM env support
- Hanging tests error by default (unlike `jest`)
- Babel support, picks up your Babel config (enable via `--babel`)
- Unlike `bun:test`, it runs test files in isolated contexts \
  Bun leaks globals / side effects between test files ([ref](https://github.com/oven-sh/bun/issues/6024)),
  and has incompatible `test()` lifecycle / order

## Getting started

First install with `npm install --save-dev @exodus/test` (or with your favorite package manager)

Then, add this to `package.json` scripts (or see [engines example](https://github.com/ExodusOSS/bytes/blob/v1.11.0/package.json#L25-L42)):

```json
  "test": "exodus-test"
```

That's it. It works zero-config.

See [Options](#options) to change defaults, e.g. to enable Jest globals with `--jest`.

To use [Engines](#engines) on CI, see e.g. GitHub CI config of [@exodus/bytes](https://github.com/ExodusOSS/bytes/blob/main/.github/workflows/test.yml).

### Using with node:test tests

You don't need to change the tests or any extra configuration on top of [Getting started](#getting-started).

It just works out of the box, and on Node.js native `node:test` is used under the hood.

Using this script is similar to `node --test`:

```json
  "test": "exodus-test"
```

But, unlike bare `node --test` it supports [engines](#engines) and the [GitHub CI reporter](#github-actions).

### Migrating from Jest

Use this in `package.json` scripts:

```json
  "test": "exodus-test --jest"
```

If that doesn't work (e.g. some deps are faux-ESM), add `--esbuild` to transpile those:

```json
  "test": "exodus-test --jest --esbuild"
```

To adjust module mocks for native ESM support, see [Module mocking in ESM](#module-mocking-in-esm).

Some complex setups with React Native don't work yet.

### Migrating from tape

Use this in `package.json` scripts:

```json
  "test": "exodus-test"
```

Great! Now your tape tests run on top of `node:test`, and are also runnable in browsers / barebone [engines](#engines).

> [!TIP]
> You can optionally replace `tape` imports with `@exodus/test/tape`
> to be able to be individually run them with just `node ./path-to-file.js`:
>
> ```js
> import test from '@exodus/test/tape' // ESM
> const test = require('@exodus/test/tape') // CJS
> ```

## Engines

Use `--engine` (or `EXODUS_TEST_ENGINE=`) to specify one of:

- `node:test` — the default one, runs on top of modern Node.js [test runner API](https://nodejs.org/api/test.html)
- `node:pure` — implementation in pure JS, runs on Node.js
- `node:bundle` — same as `node:pure`, but bundles everything into a single file before launching
- Other runtimes:
  - `deno:pure` — Deno (requires Deno v2.4.0 or later, expects `deno` to be available)
  - `deno:bundle` — Deno (v1 or v2, whichever `deno` is)
  - `deno:test` — incomplete, lacks `--jest` support due to missing `afterEach` / `beforeEach` in Deno
  - `bun:pure` / `bun:bundle` — Bun, expects `bun` to be available
  - `electron-as-node:test` / `electron-as-node:pure` / `electron-as-node:bundle`\
    Same as `node:*`, but uses `electron` binary.\
    The usecase is mostly to test on BoringSSL instead of OpenSSL.
  - `electron:bundle` — run tests in Electron [BrowserWindow](https://www.electronjs.org/docs/latest/api/browser-window)
    without Node.js integration.
- Browsers:
  - Playwright builds (install Playwright-built engines with `exodus-test --playwright install`)
    - `chromium:playwright` — Playwright-built Chromium
    - `firefox:playwright` — Playwright-built Firefox
    - `webkit:playwright` — Playwright-built WebKit, close to Safari
    - `chrome:playwright` — Chrome (system-installed)
    - `msedge:playwright` — Microsoft Edge (system-installed)
  - Puppeteer (system-provided or upstream builds)
    - `chrome:puppeteer` — Chrome
    - `firefox:puppeteer` — Firefox
    - `brave:puppeteer` — Brave
    - `msedge:puppeteer` — Microsoft Edge
  - Bundle
    - `servo:bundle` — Servo (expects it to be installed in the system)
- Barebone engines (system-provided or installed with `npx jsvu` / `npx esvu`):
  - `v8:bundle` — [v8 CLI](https://v8.dev/docs/d8) (Chrome/Blink/Node.js JavaScript engine)
  - `jsc:bundle` — [JavaScriptCore](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html) (Safari/WebKit JavaScript engine)
  - `hermes:bundle` — [Hermes](https://hermesengine.dev) (React Native JavaScript engine)
  - `spidermonkey:bundle` — [SpiderMonkey](https://spidermonkey.dev/) (Firefox/Gecko JavaScript engine)
  - `quickjs:bundle` — [QuickJS](https://github.com/quickjs-ng/quickjs)
  - `xs:bundle` — [XS](https://github.com/Moddable-OpenSource/moddable-xst)
  - `graaljs:bundle` — [GraalJS](https://github.com/oracle/graaljs)
  - `escargot:bundle` — [Escargot](https://github.com/Samsung/escargot)
  - `boa:bundle` — [Boa](https://github.com/boa-dev/boa)
  - `engine262:bundle` - [engine262](https://github.com/engine262/engine262), the per-spec implementation of ECMA-262
    (install with [esvu](https://npmjs.com/package/esvu))

## Options

- `--jest` — register jest test helpers as global variables, also load `jest.config.*` configuration options

- `--esbuild` — use esbuild loader, also enables Typescript support on old Node.js

- `--typescript` — enable Typescript type stripping (only needed on older Node.js versions which don't have it natively)

- `--babel` — use babel loader (slower than `--esbuild`, makes sense if you have a special config)

- `--coverage` — enable coverage, prints coverage output (varies by coverage engine)

- `--coverage-engine c8` — use c8 coverage engine (default), also generates `./coverage/` dirs

- `--coverage-engine node` — use Node.js builtint coverage engine

- `--watch` — operate in watch mode and re-run tests on file changes

- `--only` — only run the tests marked with `test.only`

- `--passWithNoTests` — do not error when no test files were found

- `--write-snapshots` — write snapshots instead of verifying them (has `--test-update-snapshots` alias)

- `--test-force-exit` — force exit after tests are done

- `--engine` — specify one of [Engines](#engines) to run on

## Reporter samples

### CLI

Uses colors when output supports them, e.g. in terminal.

```console
# tests/jest/expect.mock.test.js
✔ PASS drinkAll > drinks something lemon-flavoured (1.300417ms)
✔ PASS drinkAll > does not drink something octopus-flavoured (0.191791ms)
✔ PASS drinkAll (1.842959ms)
✔ PASS drinkEach > drinkEach drinks each drink (0.360625ms)
✔ PASS drinkEach (0.463416ms)
✔ PASS toHaveBeenCalledWith > registration applies correctly to orange La Croix (0.53325ms)
✔ PASS toHaveBeenCalledWith (0.564166ms)
✔ PASS toHaveBeenLastCalledWith > applying to all flavors does mango last (0.380375ms)
✔ PASS toHaveBeenLastCalledWith (0.473417ms)
# tests/jest/fn.invocationCallOrder.test.js
✔ PASS mock.invocationCallOrder (4.221042ms)
```

### GitHub Actions

Collapses test results per-file, like this:

<details>
 <summary>✅ <strong>tests/jest/lifecycle.test.js</strong></summary>
 <pre>
  ✔ PASS A > B > C (3.26166ms)
  ✔ PASS A > B > D (1.699463ms)
  ✔ PASS A > B (6.72719ms)
  ✔ PASS A > E > F (1.117997ms)
  ✔ PASS A > E > G > H (1.330904ms)
  ✔ PASS A > E > G (1.94971ms)
  ✔ PASS A > E (3.821825ms)
  ✔ PASS A > I (0.533096ms)
  ✔ PASS A (13.887889ms)
  ✔ PASS J (0.373187ms)
  ✔ PASS K > L (0.659852ms)
  ✔ PASS K (1.143195ms)
 </pre>
</details><details>
 <summary>✅ <strong>tests/jest/timers.async.test.js</strong></summary>
 <pre>
  ✔ PASS advanceTimersByTime() does not let microtasks to pass (5.326604ms)
  ✔ PASS advanceTimersByTime() does not let microtasks to pass even with await (1.336064ms)
  ✔ PASS advanceTimersByTimeAsync() lets microtasks to pass (6.99526ms)
  ✔ PASS advanceTimersByTimeAsync() lets microtasks to pass, chained (10.131664ms)
  ✔ PASS advanceTimersByTimeAsync() lets microtasks to pass, longer chained (8.635472ms)
  ✔ PASS advanceTimersByTimeAsync() lets microtasks to pass, async chain (56.937983ms)
 </pre>
</details>

See live output in [CI](https://github.com/ExodusOSS/test/actions/workflows/checks.yaml)

## Module mocking in ESM

Module mocks in ESM is a common source of confusion, as Jest in most old setups does not run real ESM,
and instead uses Babel to transform ESM into CJS, and then hoists mocks on top of `require()` calls.

That hoisting is not possible in ESM world, as static import statements are always resolved before
any other code.

Also see [Jest documentation](https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm) on that.

To port code from CJS or Babel, e.g. the following approach with dynamic imports can be used:

```js
jest.doMock('./hogwarts.js', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const { default: getEntryQualification } = await import('./hogwarts.js')
const { qualifiesForHogwarts } = await import('./wizard.js') // module importing ./hogwarts.js

test('qualifies for Hogwarts', () => {
  // doSomething is a mock function
  getEntryQualification.mockReturnValue(['lumos'])

  expect(qualifiesForHogwarts('potter')).toBe(false)
  getEntryQualification.mockReturnValue([])
  expect(qualifiesForHogwarts('potter')).toBe(true)
})
```

Note that all modules that transitively import `hogwarts.js` will have to be imported after the mock is defined.

## License

[MIT](./LICENSE)
