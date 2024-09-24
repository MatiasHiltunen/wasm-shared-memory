/* tslint:disable */
/* eslint-disable */
/**
*/
export class SharedBuffer {
  free(): void;
/**
* @param {number} num_elements
* @param {number} width
* @param {number} height
*/
  constructor(num_elements: number, width: number, height: number);
/**
* @returns {number}
*/
  ptr(): number;
/**
* @returns {number}
*/
  len(): number;
/**
*/
  fill_with_data(): void;
/**
* @param {number} mx
* @param {number} my
*/
  update(mx: number, my: number): void;
/**
* @param {number} width
* @param {number} height
*/
  update_screen(width: number, height: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_sharedbuffer_free: (a: number, b: number) => void;
  readonly sharedbuffer_new: (a: number, b: number, c: number) => number;
  readonly sharedbuffer_ptr: (a: number) => number;
  readonly sharedbuffer_len: (a: number) => number;
  readonly sharedbuffer_fill_with_data: (a: number) => void;
  readonly sharedbuffer_update: (a: number, b: number, c: number) => void;
  readonly sharedbuffer_update_screen: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
