import { SimplexNoise } from '@three/examples/jsm/math/SimplexNoise';
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshMatcapNodeMaterial,
  type Vector3Like,
} from 'three';
// import { Bench } from 'tinybench';
import { mulberry } from '@/utils/random.ts';
import { world } from './World.ts';

enum VoxelType {
  Air,
  Stone,
}

export class Chunk {
  size = 42;
  terrain = {
    scale: 72,
    magnitude: 0.5,
    offset: 0.75,
    seed: 'Hello, World!',
  };
  mesh!: Mesh;

  private faceCount = 0;
  private voxels: Uint8Array = new Uint8Array(
    this.size * this.size * this.size,
  );

  setup() {
    // Debug
    const debug = world.debug.addFolder({
      title: 'Chunk',
    });

    debug
      .addBinding(this, 'size', {
        min: 8,
        max: 42,
        step: 1,
      })
      .on('change', () => {
        this.voxels = new Uint8Array(this.size * this.size * this.size);
        this.generateMesh();
      });

    debug
      .addBinding(this.terrain, 'scale', { min: 10, max: 100, step: 1 })
      .on('change', () => this.generateMesh());

    debug
      .addBinding(this.terrain, 'magnitude', { min: 0, max: 1 })
      .on('change', () => this.generateMesh());

    debug
      .addBinding(this.terrain, 'offset', { min: 0, max: 1 })
      .on('change', () => this.generateMesh());

    debug.addBinding(this.terrain, 'seed').on('change', (event) => {
      const formattedValue = event.value.substring(0, 32);
      this.terrain.seed = formattedValue;
      this.generateMesh();
    });

    // Benchmark
    // const bench = new Bench({ iterations: 1000 });
    // bench.add('Chunk 1D Array', () => {
    //   this.generateMesh();
    // });
    // bench.run().then(() => {
    //   console.table(
    //     bench.tasks.map(({ name, result }) => ({
    //       'Task Name': name,
    //       'Average Time (ms)': result?.latency.mean.toFixed(3) || 'N/A',
    //       'Min Time (ms)': result?.latency.min.toFixed(3) || 'N/A',
    //       'Max Time (ms)': result?.latency.max.toFixed(3) || 'N/A',
    //       'Ops/sec': result?.throughput.mean.toFixed(2) || 'N/A',
    //     })),
    //   );
    // });

    this.generateMesh();
    world.view.camera.position.set(50, 40, 60);
  }

  generateTerrain() {
    const simplex = new SimplexNoise(mulberry(this.terrain.seed));

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        const value = simplex.noise(
          x / this.terrain.scale,
          z / this.terrain.scale,
        );

        const scaledNoise =
          this.terrain.offset + this.terrain.magnitude * value;

        let height = this.size * scaledNoise;
        height = Math.max(0, Math.min(height, this.size - 1));

        for (let y = 0; y <= height; y++) {
          const index = this.getVoxelIndex(x, y, z);
          this.voxels[index] = VoxelType.Stone;
        }
      }
    }
  }

  generateGeometry(): {
    vertices: number[];
    indices: number[];
    uvs: number[];
  } {
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

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let faceCount = 0;
    // Top

    for (let i = 0; i < this.voxels.length; i++) {
      if (this.voxels[i] === VoxelType.Air) {
        continue;
      }

      // biome-ignore lint/style/noNonNullAssertion: Since we are looping through the voxels, this is impossible to be out of bounds.
      const { x, y, z } = this.get3DVoxelCoordinates(i)!;

      // Top
      if (this.isVoxelAir({ x, y: y + 1, z: z })) {
        vertices.push(x - 0.5, y + 0.5, z - 0.5);
        vertices.push(x + 0.5, y + 0.5, z - 0.5);
        vertices.push(x + 0.5, y + 0.5, z + 0.5);
        vertices.push(x - 0.5, y + 0.5, z + 0.5);

        addTriangles();
        addUvs();
      }

      // East
      if (this.isVoxelAir({ x: x + 1, y: y, z: z })) {
        vertices.push(x + 0.5, y + 0.5, z + 0.5);
        vertices.push(x + 0.5, y + 0.5, z - 0.5);
        vertices.push(x + 0.5, y - 0.5, z - 0.5);
        vertices.push(x + 0.5, y - 0.5, z + 0.5);

        addTriangles();
        addUvs();
      }

      // South
      if (this.isVoxelAir({ x: x, y: y, z: z + 1 })) {
        vertices.push(x - 0.5, y + 0.5, z + 0.5);
        vertices.push(x + 0.5, y + 0.5, z + 0.5);
        vertices.push(x + 0.5, y - 0.5, z + 0.5);
        vertices.push(x - 0.5, y - 0.5, z + 0.5);

        addTriangles();
        addUvs();
      }

      // West
      if (this.isVoxelAir({ x: x - 1, y: y, z: z })) {
        vertices.push(x - 0.5, y + 0.5, z - 0.5);
        vertices.push(x - 0.5, y + 0.5, z + 0.5);
        vertices.push(x - 0.5, y - 0.5, z + 0.5);
        vertices.push(x - 0.5, y - 0.5, z - 0.5);

        addTriangles();
        addUvs();
      }

      // North
      if (this.isVoxelAir({ x: x, y: y, z: z - 1 })) {
        vertices.push(x + 0.5, y + 0.5, z - 0.5);
        vertices.push(x - 0.5, y + 0.5, z - 0.5);
        vertices.push(x - 0.5, y - 0.5, z - 0.5);
        vertices.push(x + 0.5, y - 0.5, z - 0.5);

        addTriangles();
        addUvs();
      }

      // Bottom
      if (this.isVoxelAir({ x: x, y: y - 1, z: z })) {
        vertices.push(x - 0.5, y - 0.5, z + 0.5);
        vertices.push(x + 0.5, y - 0.5, z + 0.5);
        vertices.push(x + 0.5, y - 0.5, z - 0.5);
        vertices.push(x - 0.5, y - 0.5, z - 0.5);

        addTriangles();
        addUvs();
      }
    }

    return {
      vertices,
      indices,
      uvs,
    };
  }

  generateMesh() {
    if (this.mesh) {
      world.scene.remove(this.mesh);
    }

    this.voxels.fill(VoxelType.Air);

    this.generateTerrain();

    const geometry = new BufferGeometry();

    const { vertices, indices, uvs } = this.generateGeometry();

    const positionBuffer = new BufferAttribute(new Float32Array(vertices), 3);
    const indexBuffer = new BufferAttribute(new Uint16Array(indices), 1);
    const uvBuffer = new BufferAttribute(new Float32Array(uvs), 2);

    geometry.setAttribute('position', positionBuffer);
    geometry.setAttribute('uv', uvBuffer);
    geometry.setIndex(indexBuffer);

    geometry.computeVertexNormals();

    const material = new MeshMatcapNodeMaterial();

    this.mesh = new Mesh(geometry, material);
    world.scene.add(this.mesh);
  }

  isVoxelAir(position: Vector3Like) {
    if (position.x < 0 || position.y < 0 || position.z < 0) {
      return true;
    }

    if (
      position.x >= this.size ||
      position.y >= this.size ||
      position.z >= this.size
    ) {
      return true;
    }

    const index = this.getVoxelIndex(position.x, position.y, position.z);
    if (this.voxels[index] === VoxelType.Air) {
      return true;
    }

    return false;
  }

  getVoxelIndex(x: number, y: number, z: number): number {
    if (
      x < 0 ||
      x >= this.size ||
      y < 0 ||
      y >= this.size ||
      z < 0 ||
      z >= this.size
    ) {
      throw Error(`Coordinates (${x}, ${y}, ${z}) are out of bounds.`);
    }

    return x + y * this.size + z * this.size * this.size;
  }

  get3DVoxelCoordinates(index: number): Vector3Like {
    const totalVoxels = this.size * this.size * this.size;
    if (index < 0 || index >= totalVoxels) {
      throw new Error(
        `Index ${index} is out of bounds for a grid of ${totalVoxels} voxels.`,
      );
    }

    const remainingIndex = index % (this.size * this.size);
    const z = Math.floor(index / (this.size * this.size));
    const y = Math.floor(remainingIndex / this.size);
    const x = remainingIndex % this.size;

    return { x, y, z };
  }
}
