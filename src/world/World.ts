import { Engine } from '@/core/Engine.ts';
import { Debug } from '@/utils/Debug.ts';
import { Chunk } from './Chunk.ts';

class World extends Engine.World {
  chunk = new Chunk();
  debug = new Debug();

  setup() {
    this.chunk.setup();
  }

  update() {}
}

export const world = new World();
