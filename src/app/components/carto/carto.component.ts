import { Component, OnInit } from '@angular/core';
import { BubbleChart } from '../../models/BubbleChart.models';
import { QuantitativeFilter } from '../../models/QuantitativeFilter.models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-carto',
  templateUrl: './carto.component.html',
  styleUrl: './carto.component.scss',
})
export class CartoComponent implements OnInit {
  bubbleChart!: BubbleChart;
  isBubbleProjectSelected: boolean = false;
  projectSelectedId!: string;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.loadProjects().subscribe({
      next: (projects) => {
        const scaleFilter = new QuantitativeFilter({
          type: 'scale',
          limits: { min: 10, max: 50 },
        });
        const colorFilter = new QuantitativeFilter({
          type: 'color',
          limits: { min: 10, max: 50 },
        });
        try {
          this.bubbleChart = new BubbleChart(
            '#bubble-chart-svg',
            projects,
            scaleFilter,
            colorFilter,
            this.dataService
          );
        } catch (e) {
          console.log(e);
        }
      },
      error: (error) =>
        console.error('Erreur lors du chargement des projets', error),
    });

    window.addEventListener('wheel', (event) => {
      this.bubbleChart.zoom(event.deltaY < 0);
    });

    this.dataService.currentData.subscribe((data) => {
      if (data) {
        this.isBubbleProjectSelected = true;
        this.projectSelectedId = data;
        // console.log(data);
      } else {
        this.isBubbleProjectSelected = false;
        // console.log('unselected');
      }
    });
  }

  addSpatialMarkerEvent(marker: { id: string; x: number; y: number }) {
    this.bubbleChart.addSpatialMarker(marker.id, marker.x, marker.y);
  }

  removeSpatialMarkerEvent(markerId: string) {
    console.log(markerId);
  }

  toggleQuantitativeFilterEvent(type: string) {
    if (type == 'color') {
      this.bubbleChart.colorFilter.toggleVisibility();
    }
    if (type == 'scale') {
      this.bubbleChart.scaleFilter.toggleVisibility();
    }
    this.bubbleChart.wrangleData();
  }
}
