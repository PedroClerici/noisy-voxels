import { ChunkGeometryBuilder } from '@lib';
import { BufferAttribute, BufferGeometry } from 'three';
// Deno import maps seems to be not working with wasm...
import { memory } from '../../lib/pkg/lib_bg.wasm';

export class ChunkGeometry extends BufferGeometry {
  constructor(voxels: Uint8Array) {
    super();

    const chunkGeometryWasm = new ChunkGeometryBuilder(voxels);

    const vertices = new Float32Array(
      memory.buffer,
      chunkGeometryWasm.verticesPointer,
      chunkGeometryWasm.verticesLength,
    );
    const uvs = new Float32Array(
      memory.buffer,
      chunkGeometryWasm.uvsPointer,
      chunkGeometryWasm.uvsLength,
    );
    const indices = new Uint16Array(
      memory.buffer,
      chunkGeometryWasm.indicesPointer,
      chunkGeometryWasm.indicesLength,
    );

    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setAttribute('uv', new BufferAttribute(uvs, 2));
    this.setIndex(new BufferAttribute(indices, 1));

    chunkGeometryWasm.free();

    this.computeVertexNormals();
    this.computeBoundingBox();
  }
}
