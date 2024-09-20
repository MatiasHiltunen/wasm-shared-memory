# Vite (TS) & wasm-pack, SharedArrayBuffer Example

## Getting started

Following setup is needed to start and run the project:

- Rust https://www.rust-lang.org/
- Nodejs
- wasm-pack https://rustwasm.github.io/wasm-pack/
_wasm-pack also needs to be available at PATH_

1. Install nodejs dependencies:
``` sh
npm install
```
2. Build WebAssembly
``` sh
# Needed first time to create pkg-folder and to compile WASM module
npm run wasm
```

Start development server
``` sh
# runs the "wasm-pack build --target web && vite" in package.json
npm run dev
```

## Why?

This example is just a by product of experimenting with WASM and shared memory with JS.

SharedArrayBuffer allows access to same memory reference from both JS and WASM side and thus improving efficiency by reducing the number of copies when data is needed to be transfererred between WASM and JS.