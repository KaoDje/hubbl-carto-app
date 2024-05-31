import { SubModule } from '../SubModules.models';

export class CategorizationSubModule extends SubModule {
  metaCategory!: string;
  categories!: string[];

  constructor(_metaCategory: string, _categories: string[]) {
    super();
    this.metaCategory = _metaCategory;
    this.categories = _categories;
  }
}
