import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paper-overview',
  templateUrl: './paper-overview.component.html',
  styleUrl: './paper-overview.component.scss',
})
export class PaperOverviewComponent {
  @Input() projectOverview!: { name: string; summary: string };
}
