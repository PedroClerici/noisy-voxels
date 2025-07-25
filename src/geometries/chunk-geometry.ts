import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint16BufferAttribute,
} from 'three';

export class ChunkGeometry extends BufferGeometry {
  constructor(voxels: Uint8Array) {
    super();

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    let faceCount = 0;
    // const cubeRoot = Math.cbrt(voxels.length);
    const cubeRoot = Math.round(voxels.length ** (1 / 3));

    function addUvs() {
      uvs.push(0, 0);
      uvs.push(1, 0);
      uvs.push(1, 1);
      uvs.push(0, 1);
    }

    function addTriangles() {
      const currentFace = faceCount * 4;
      indices.push(currentFace, currentFace + 2, currentFace + 1);
      indices.push(currentFace, currentFace + 3, currentFace + 2);

      faceCount += 1;
    }

    function isVoxelAir(x: number, y: number, z: number) {
      if (x < 0 || y < 0 || z < 0) {
        return true;
      }

      if (x >= cubeRoot || y >= cubeRoot || z >= cubeRoot) {
        return true;
      }

      const index = x + y * cubeRoot + z * cubeRoot * cubeRoot;
      if (voxels[index] === 0) {
        return true;
      }

      return false;
    }

    for (let i = 0; i < voxels.length; i++) {
      if (voxels[i] === 0) {
        continue;
      }

      const remaining = i % (cubeRoot * cubeRoot);
      const z = Math.floor(i / (cubeRoot * cubeRoot));
      const y = Math.floor(remaining / cubeRoot);
      const x = remaining % cubeRoot;

      // Top
      if (isVoxelAir(x, y + 1, z)) {
        vertices.push(x - 0.5, y + 0.5, z - 0.5);
        vertices.push(x + 0.5, y + 0.5, z - 0.5);
        vertices.push(x + 0.5, y + 0.5, z + 0.5);
        vertices.push(x - 0.5, y + 0.5, z + 0.5);

        addTriangles();
        addUvs();
      }

      // East
      if (isVoxelAir(x + 1, y, z)) {
        vertices.push(x + 0.5, y + 0.5, z + 0.5);
        vertices.push(x + 0.5, y + 0.5, z - 0.5);
        vertices.push(x + 0.5, y - 0.5, z - 0.5);
        vertices.push(x + 0.5, y - 0.5, z + 0.5);

        addTriangles();
        addUvs();
      }

      // South
      if (isVoxelAir(x, y, z + 1)) {
        vertices.push(x - 0.5, y + 0.5, z + 0.5);
        vertices.push(x + 0.5, y + 0.5, z + 0.5);
        vertices.push(x + 0.5, y - 0.5, z + 0.5);
        vertices.push(x - 0.5, y - 0.5, z + 0.5);

        addTriangles();
        addUvs();
      }

      // West
      if (isVoxelAir(x - 1, y, z)) {
        vertices.push(x - 0.5, y + 0.5, z - 0.5);
        vertices.push(x - 0.5, y + 0.5, z + 0.5);
        vertices.push(x - 0.5, y - 0.5, z + 0.5);
        vertices.push(x - 0.5, y - 0.5, z - 0.5);

        addTriangles();
        addUvs();
      }

      // North
      if (isVoxelAir(x, y, z - 1)) {
        vertices.push(x + 0.5, y + 0.5, z - 0.5);
        vertices.push(x - 0.5, y + 0.5, z - 0.5);
        vertices.push(x - 0.5, y - 0.5, z - 0.5);
        vertices.push(x + 0.5, y - 0.5, z - 0.5);

        addTriangles();
        addUvs();
      }

      // Bottom
      if (isVoxelAir(x, y - 1, z)) {
        vertices.push(x - 0.5, y - 0.5, z + 0.5);
        vertices.push(x + 0.5, y - 0.5, z + 0.5);
        vertices.push(x + 0.5, y - 0.5, z - 0.5);
        vertices.push(x - 0.5, y - 0.5, z - 0.5);

        addTriangles();
        addUvs();
      }
    }

    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    this.setIndex(new Uint16BufferAttribute(indices, 1));

    this.computeVertexNormals();
    this.computeBoundingBox();
  }
}
