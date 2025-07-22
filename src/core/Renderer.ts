import {
  CineonToneMapping,
  LinearSRGBColorSpace,
  PCFShadowMap,
  type Scene,
  WebGPURenderer,
} from 'three';
import type { Sizes } from './Sizes.ts';
import type { View } from './View.ts';

export class Renderer extends WebGPURenderer {
  canvas: HTMLCanvasElement;
  sizes: Sizes;

  constructor(canvas: HTMLCanvasElement, sizes: Sizes) {
    super({
      antialias: true,
      canvas: canvas,
    });

    this.canvas = canvas;
    this.sizes = sizes;

    this.outputColorSpace = LinearSRGBColorSpace;
    this.toneMapping = CineonToneMapping;
    this.toneMappingExposure = 1.75;
    this.shadowMap.enabled = true;
    this.shadowMap.type = PCFShadowMap;
    this.setSize(this.sizes.width, this.sizes.height);
    this.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.setSize(this.sizes.width, this.sizes.height);
    this.setPixelRatio(this.sizes.pixelRatio);
  }

  update(scene: Scene, view: View) {
    this.renderAsync(scene, view.camera);
  }
}
