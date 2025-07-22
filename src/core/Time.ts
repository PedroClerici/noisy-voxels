import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
import { Debug } from '@/utils/Debug.ts';
import { EventDispatcher } from '@/utils/EventDispatcher.ts';
import type { Renderer } from './Renderer.ts';

const container = document.querySelector('.engine-debug') as HTMLDivElement;

export class Time extends EventDispatcher<{ tick: null }> {
  private renderer: Renderer;
  start = Date.now();
  current = this.start;
  elapsed = 0;
  delta = 16;
  private debug = new Debug({ container });
  private fpsGraph = this.debug.addBlade({
    view: 'fpsgraph',
    label: 'FPS',
    rows: 2,
  }) as FpsGraphBladeApi;

  constructor(renderer: Renderer) {
    super();

    this.renderer = renderer;

    globalThis.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    this.fpsGraph.begin();

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.dispatch('tick');

    this.fpsGraph.end();
    this.renderer.setAnimationLoop(() => {
      this.tick();
    });
  }
}
