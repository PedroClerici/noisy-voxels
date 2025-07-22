import { EventDispatcher } from '@/utils/EventDispatcher.ts';

export class Sizes extends EventDispatcher<{ resize: null }> {
  width: number;
  height: number;
  pixelRatio = Math.min(globalThis.devicePixelRatio, 2);

  constructor() {
    super();
    this.width = globalThis.innerWidth;
    this.height = globalThis.innerHeight;

    globalThis.addEventListener('resize', () => {
      this.width = globalThis.innerWidth;
      this.height = globalThis.innerHeight;

      this.pixelRatio = Math.min(globalThis.devicePixelRatio, 2);

      this.dispatch('resize');
    });
  }
}
