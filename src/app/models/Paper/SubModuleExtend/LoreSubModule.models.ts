import { SubModule } from '../SubModules.models';

export class LoreSubModule extends SubModule {
  title!: string;
  text!: string;

  constructor(_title: string, _text: string) {
    super();
    this.title = _title;
    this.text = _text;
  }
}
