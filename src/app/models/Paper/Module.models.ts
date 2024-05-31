import { SubModule } from './SubModules.models';

export class Module {
  stringId!: string;
  subModules: SubModule[] = [];

  constructor(_stringId: string) {
    this.stringId = _stringId;
  }

  addSubModule(_subModule: SubModule) {
    this.subModules.push(_subModule);
  }
}
