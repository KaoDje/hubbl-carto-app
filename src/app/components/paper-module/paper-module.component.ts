import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../models/Paper/Module.models';

@Component({
  selector: 'app-paper-module',
  templateUrl: './paper-module.component.html',
  styleUrl: './paper-module.component.scss',
})
export class PaperModuleComponent implements OnInit {
  @Input() module!: Module;

  constructor() {}

  ngOnInit(): void {
    const moduleElement = document.querySelector('section.module');
    if (moduleElement) {
      // moduleElement.id = this.module.stringId;
      // const titleElement = moduleElement.querySelector('h2');
      // if (titleElement) {
      //   if (this.module.stringId == 'lore')
      //     titleElement.textContent = 'Découvrir son univers';
      //   if (this.module.stringId == 'usecase-features')
      //     titleElement.textContent = 'Comprendre son usage';
      //   // } else if (this.module.stringId == 'usecase-features') {
      //   //   titleElement.textContent = 'Comprendre son usage';
      //   // }
      // }
    }
  }
}
