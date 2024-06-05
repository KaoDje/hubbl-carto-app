import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Project } from '../../models/Project.models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isPaperActive: boolean = false;
  isEarnActive: boolean = false;
  earnContainerHeight: number = 0;
  isBubbleProjectSelected: boolean = false;
  projectSelected!: Project;
  projectSelectedOverview!: { name: string; summary: string };

  @Output() addSpatialMarkerEventHome = new EventEmitter<{
    id: string;
    x: number;
    y: number;
  }>();

  @Output() removeSpatialMarkerEventHome = new EventEmitter<string>();

  @Output() toggleQuantitativeFilterEventHome = new EventEmitter<string>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // alert(
    //   'Actuellement, toutes les données présentées dans notre cartographie sont fictives.'
    // );
    this.dataService.currentData.subscribe((data) => {
      if (data) {
        this.isBubbleProjectSelected = true;
        const project = this.dataService.projects2.find(
          (item) => item.name === data
        );
        if (project) {
          this.projectSelected = project;
          this.projectSelectedOverview = project.getOverview();
        }
      } else {
        this.isBubbleProjectSelected = false;
        console.log('unselected');
        if (this.isPaperActive) {
          this.toggleWhiteUI();
        }
      }
    });
  }

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

  on_NavButton_Click(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const buttonClicked = targetElement.closest('.button-container');
    if (buttonClicked) {
      if (buttonClicked.id == 'paperButton') {
        if (this.isBubbleProjectSelected) {
          this.toggleWhiteUI();
        }
      }
      if (buttonClicked.id == 'earnButton') {
        buttonClicked.classList.toggle('active');
        const earnContainer = document.getElementById(
          'earnContainer'
        ) as HTMLElement;
        if (earnContainer) {
          this.isEarnActive = !this.isEarnActive;
          earnContainer.classList.toggle('left-container-active');
        }
      }
    }
  }

  on_paperOverview_Click() {
    this.toggleWhiteUI();
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
