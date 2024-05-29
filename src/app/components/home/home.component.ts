import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { DataService } from '../../services/data.service';
import { EarnLoginComponent } from '../earn-login/earn-login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isPaperActive: boolean = false;
  isEarnActive: boolean = false;
  earnContainerHeight: number = 0;

  // @ViewChild(EarnLoginComponent, { static: false })
  // earnLoginComponent!: EarnLoginComponent;

  @Output() addSpatialMarkerEventHome = new EventEmitter<{
    id: string;
    x: number;
    y: number;
  }>();

  @Output() removeSpatialMarkerEventHome = new EventEmitter<string>();

  @Output() toggleQuantitativeFilterEventHome = new EventEmitter<string>();

  onHeightChanged(height: number) {
    this.earnContainerHeight = height;
    if (this.isEarnActive) {
      console.log(height);
      if (height < 500) {
        (
          document.getElementById('earnContainer') as HTMLElement
        ).style.height = `${height + 40}px`;
      }
    } else {
      (
        document.getElementById('earnContainer') as HTMLElement
      ).style.height = `0px`;
    }
  }

  // logEarnChildContainerHeight() {
  //   if (this.earnLoginComponent) {
  //     const heightChild = this.earnLoginComponent.getEarnChildContainerHeight();
  //     console.log(heightChild);
  //   }
  // }

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
      if (buttonClicked.id == 'earnButton') {
        const earnContainer = document.getElementById(
          'earnContainer'
        ) as HTMLElement;
        if (earnContainer) {
          this.isEarnActive = !this.isEarnActive;
          earnContainer.classList.toggle('left-container-active');

          // if (this.isEarnActive) {
          //   earnContainer.style.height =
          //     this.earnLoginComponent.getEarnChildContainerHeight().toString() +
          //     'px';
          //   earnContainer.style.height = `${this.earnContainerHeight}px`;
          //   setTimeout(() => {
          //     console.log(this.earnContainerHeight);
          //     earnContainer.style.transition = 'transition: all 300ms ease';
          //     earnContainer.style.height = `${this.earnContainerHeight + 40}px`;
          //   }, 100);
          // } else {
          //   earnContainer.classList.toggle('left-container-active');
          //   earnContainer.style.height = '0px';
          // }

          // console.log(this.earnChildContainer);
          // const earnChildContainerEl = this.earnChildContainer.nativeElement;
          // const heightChild = earnChildContainerEl.scrollHeight;
          // console.log(heightChild);
        }
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
