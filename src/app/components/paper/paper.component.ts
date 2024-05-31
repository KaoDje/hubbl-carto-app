import { Component, Input } from '@angular/core';
import { Project } from '../../models/Project.models';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrl: './paper.component.scss',
})
export class PaperComponent {
  @Input() project!: Project;
}
