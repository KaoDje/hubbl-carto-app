import { Module } from './Module.models';

export class Paper {
  modules: Module[] = [];

  constructor() {}

  addModule(module: Module) {
    this.modules.push(module);
  }
}
