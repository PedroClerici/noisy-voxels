import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from 'tweakpane';

type DebugConfig = {
  container?: HTMLElement;
  expanded?: boolean;
  title?: string;
  document?: Document;
};

export class Debug extends Pane {
  constructor(config?: DebugConfig) {
    super(config);
    this.registerPlugin(EssentialsPlugin);
  }
}
