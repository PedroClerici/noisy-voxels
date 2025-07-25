import { SimplexNoise } from '@three/examples/jsm/math/SimplexNoise';
import { Mesh, MeshMatcapNodeMaterial } from 'three';
import { Bench } from 'tinybench';
import { mulberry } from '@/utils/random.ts';
import { ChunkGeometry } from '../geometries/chunk-geometry.ts';
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
          const index = x + y * this.size + z * this.size * this.size;
          this.voxels[index] = VoxelType.Stone;
        }
      }
    }
  }

  generateMesh() {
    if (this.mesh) {
      world.scene.remove(this.mesh);
    }

    this.voxels.fill(VoxelType.Air);

    this.generateTerrain();

    const geometry = new ChunkGeometry(this.voxels);

    const material = new MeshMatcapNodeMaterial();

    this.mesh = new Mesh(geometry, material);
    world.scene.add(this.mesh);
  }
}
