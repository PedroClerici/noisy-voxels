import { Scene } from 'three';
import { Renderer } from './Renderer.ts';
import { Sizes } from './Sizes.ts';
import { Time } from './Time.ts';
import { View } from './View.ts';

abstract class World {
  // Will be set by the engine
  scene!: Scene;
  view!: View;
  time!: Time;

  abstract setup(): void;

  abstract update(): void;
}

export class Engine {
  canvas: HTMLCanvasElement;
  sizes: Sizes;
  renderer: Renderer;
  time: Time;
  view: View;
  scene: Scene;
  world: World | null = null;

  static World = World;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.renderer = new Renderer(this.canvas, this.sizes);
    this.time = new Time(this.renderer);
    this.view = new View(this.canvas, this.sizes);
    this.scene = new Scene();
  }

  resize() {
    this.view.camera.aspect = this.sizes.width / this.sizes.height;
    this.view.camera.updateProjectionMatrix();
    this.renderer.resize();
  }

  update() {
    this.view.update();
    this.renderer.update(this.scene, this.view);
    // biome-ignore lint/style/noNonNullAssertion: Update only occurs when there is a world loaded
    this.world!.update();
  }

  load(world: World) {
    world.scene = this.scene;
    world.view = this.view;
    world.time = this.time;
    this.world = world;

    this.world.setup();

    globalThis.addEventListener('resize', () => {
      this.resize();
    });

    this.time.on('tick', () => {
      this.update();
    });
  }
}
