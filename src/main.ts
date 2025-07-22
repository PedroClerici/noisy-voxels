import './style.css';
import { Engine } from './core/Engine.ts';
import { world } from './world/World.ts';

const canvas = document.querySelector('#app') as HTMLCanvasElement;
const application = new Engine(canvas);

application.load(world);
