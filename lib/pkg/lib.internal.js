// @generated file from wasmbuild -- do not edit
// @ts-nocheck: generated
// deno-lint-ignore-file
// deno-fmt-ignore-file

let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

const lTextDecoder = typeof TextDecoder === "undefined"
  ? (0, module.require)("util").TextDecoder
  : TextDecoder;

let cachedTextDecoder = new lTextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

const ChunkGeometryBuilderFinalization =
  (typeof FinalizationRegistry === "undefined")
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
      wasm.__wbg_chunkgeometrybuilder_free(ptr >>> 0, 1)
    );

export class ChunkGeometryBuilder {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    ChunkGeometryBuilderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_chunkgeometrybuilder_free(ptr, 0);
  }
  /**
   * @param {Uint8Array} voxels
   */
  constructor(voxels) {
    const ptr0 = passArray8ToWasm0(voxels, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.chunkgeometrybuilder_new(ptr0, len0);
    this.__wbg_ptr = ret >>> 0;
    ChunkGeometryBuilderFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * @returns {number}
   */
  get verticesPointer() {
    const ret = wasm.chunkgeometrybuilder_verticesPointer(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  get verticesLength() {
    const ret = wasm.chunkgeometrybuilder_verticesLength(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  get indicesPointer() {
    const ret = wasm.chunkgeometrybuilder_indicesPointer(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  get indicesLength() {
    const ret = wasm.chunkgeometrybuilder_indicesLength(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  get uvsPointer() {
    const ret = wasm.chunkgeometrybuilder_uvsPointer(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  get uvsLength() {
    const ret = wasm.chunkgeometrybuilder_uvsLength(this.__wbg_ptr);
    return ret >>> 0;
  }
}

export function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_export_0;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}
