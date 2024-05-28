import { Component, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isPaperActive: boolean = false;

  @Output() addSpatialMarkerEventHome = new EventEmitter<{
    id: string;
    x: number;
    y: number;
  }>();

  @Output() removeSpatialMarkerEventHome = new EventEmitter<string>();

  @Output() toggleQuantitativeFilterEventHome = new EventEmitter<string>();

  on_NavButton_Click(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const buttonClicked = targetElement.closest('.button-container');
    if (buttonClicked) {
      if (buttonClicked.id != 'cartoButton') {
        buttonClicked.classList.toggle('active');
      }
      if (buttonClicked.id == 'paperButton') {
        this.toggleWhiteUI();
      }
    }
  }

  toggleWhiteUI() {
    this.isPaperActive = !this.isPaperActive;
    if (this.isPaperActive) {
      (document.getElementById('iconCarto') as HTMLImageElement).src =
        '../../../assets/icon/icon-carto-black.svg';
      (document.getElementById('iconPaper') as HTMLImageElement).src =
        '../../../assets/icon/icon-paper-black.svg';
      (document.getElementById('iconEarn') as HTMLImageElement).src =
        '../../../assets/icon/icon-earn-black.svg';
    } else {
      (document.getElementById('iconCarto') as HTMLImageElement).src =
        '../../../assets/icon/icon-carto-white.svg';
      (document.getElementById('iconPaper') as HTMLImageElement).src =
        '../../../assets/icon/icon-paper-white.svg';
      (document.getElementById('iconEarn') as HTMLImageElement).src =
        '../../../assets/icon/icon-earn-white.svg';
    }
  }

  addSpatialMarkerEvent(marker: { id: string; x: number; y: number }) {
    this.addSpatialMarkerEventHome.emit(marker);
  }

  removeSpatialMarkerEvent(markerId: string) {
    this.removeSpatialMarkerEventHome.emit(markerId);
  }

  toggleQuantitativeFilterEvent(type: string) {
    this.toggleQuantitativeFilterEventHome.emit(type);
  }
}
