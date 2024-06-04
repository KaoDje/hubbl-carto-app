import { Component, Input, OnInit } from '@angular/core';
import { CategorizationSubModule } from '../../models/Paper/SubModuleExtend/CategorizationSubModule.models';
import { LoreSubModule } from '../../models/Paper/SubModuleExtend/LoreSubModule.models';
import { QuantitativeDataSubModule } from '../../models/Paper/SubModuleExtend/QuantitativeDataSubModule.models';
import { UsecaseFeaturesSubModule } from '../../models/Paper/SubModuleExtend/UsecaseFeaturesSubModule.models';
import { SubModule } from '../../models/Paper/SubModules.models';

@Component({
  selector: 'app-paper-submodule',
  templateUrl: './paper-submodule.component.html',
  styleUrl: './paper-submodule.component.scss',
})
export class PaperSubmoduleComponent implements OnInit {
  @Input() subModule!: SubModule;
  @Input() stringId!: string;

  subModuleTitle!: string;
  subModuleText!: string;
  subModuleCategories!: string[];
  subModuleDatas!: Array<{ metricName: string; metricValue: number }>;

  ngOnInit() {
    console.log(this.subModule);
    switch (this.stringId) {
      case 'lore':
        this.subModule = this.subModule as LoreSubModule;
        this.subModuleTitle = (this.subModule as LoreSubModule).title;
        this.subModuleText = (this.subModule as LoreSubModule).text;
        break;
      case 'usecase-features':
        this.subModuleTitle = (
          this.subModule as UsecaseFeaturesSubModule
        ).title;
        this.subModuleText = (this.subModule as UsecaseFeaturesSubModule).text;
        break;
      case 'quantitative-data':
        this.subModuleTitle = (
          this.subModule as QuantitativeDataSubModule
        ).dataProvider;
        this.subModuleDatas = (
          this.subModule as QuantitativeDataSubModule
        ).datas;
        break;
      case 'categorization':
        this.subModuleTitle = (
          this.subModule as CategorizationSubModule
        ).metaCategory;
        this.subModuleCategories = (
          this.subModule as CategorizationSubModule
        ).categories;
    }
  }

  toggleSubmodule(event: any): void {
    const submoduleElement = event.target.closest('.submodule');
    if (submoduleElement) {
      if (submoduleElement.classList.contains('active')) {
        submoduleElement.style.height = '50px';
        submoduleElement.classList.remove('active');
        const arrowElement = submoduleElement.querySelector('.arrow');
        if (arrowElement) {
          arrowElement.classList.toggle('arrow-active');
        }
      } else {
        const scrollHeight = submoduleElement.scrollHeight + 'px';
        submoduleElement.style.height = scrollHeight;
        submoduleElement.classList.add('active');
        const arrowElement = submoduleElement.querySelector('.arrow');
        if (arrowElement) {
          arrowElement.classList.toggle('arrow-active');
        }
      }
    }
  }
}
