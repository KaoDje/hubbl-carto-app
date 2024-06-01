import { Component, Input, OnInit } from '@angular/core';
import { Module } from '../../models/Paper/Module.models';
import { Project } from '../../models/Project.models';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrl: './paper.component.scss',
})
export class PaperComponent implements OnInit {
  @Input() project!: Project;
  paperModules: Module[] = [];

  constructor() {}

  ngOnInit(): void {}
}
