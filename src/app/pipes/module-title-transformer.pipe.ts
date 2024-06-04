import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moduleTitleTransformer',
})
export class ModuleTitleTransformerPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    switch (value) {
      case 'lore':
        return 'Découvrir son univers';
      case 'usecase-features':
        return 'Comprendre son fonctionnement';
      case 'quantitative-data':
        return 'Quantifier le projet';
      case 'categorization':
        return 'Catégoriser le projet';
      default:
        return 'Wrong ID';
    }
  }
}
