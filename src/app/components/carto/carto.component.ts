import { Component, OnInit } from '@angular/core';
import { BubbleChart } from '../../models/Carto/BubbleChart.models';
import { BubbleProject } from '../../models/Carto/BubbleProject.models';
import { QuantitativeFilter } from '../../models/Carto/QuantitativeFilter.models';
import { CategorizationSubModule } from '../../models/Paper/SubModuleExtend/CategorizationSubModule.models';
import { QuantitativeDataSubModule } from '../../models/Paper/SubModuleExtend/QuantitativeDataSubModule.models';
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
    // this.dataService.loadProjects().subscribe({
    //   next: (projects) => {
    //     const scaleFilter = new QuantitativeFilter({
    //       type: 'scale',
    //       limits: { min: 10, max: 50 },
    //     });
    //     const colorFilter = new QuantitativeFilter({
    //       type: 'color',
    //       limits: { min: 10, max: 50 },
    //     });
    //     try {
    //       this.bubbleChart = new BubbleChart(
    //         '#bubble-chart-svg',
    //         projects,
    //         scaleFilter,
    //         colorFilter,
    //         this.dataService
    //       );
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   },
    //   error: (error) =>
    //     console.error('Erreur lors du chargement des projets', error),
    // });

    this.dataService.loadProjects2().subscribe({
      next: (projects) => {
        const bubbleProjects: BubbleProject[] = [];
        projects.forEach((project) => {
          const csm = project.paper.modules.find(
            (item) => item.stringId === 'categorization'
          )?.subModules[0] as CategorizationSubModule;
          const qdsm = project.paper.modules.find(
            (item) => item.stringId === 'quantitative-data'
          )?.subModules[0] as QuantitativeDataSubModule;
          bubbleProjects.push(
            new BubbleProject(
              project.name,
              csm.categories,
              qdsm.floorPrice,
              qdsm.sevenDayPercent
            )
          );
        });
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
            bubbleProjects,
            scaleFilter,
            colorFilter,
            this.dataService
          );
        } catch (e) {
          console.log(e);
        }
      },
      error: (error) =>
        console.error('Erreur lors du chargement des projets 2', error),
    });

    window.addEventListener('wheel', (event) => {
      const elementUnderCursor = document.elementFromPoint(
        event.clientX,
        event.clientY
      );

      if (this.isCursorOverSVG(elementUnderCursor)) {
        this.bubbleChart.zoom(event.deltaY < 0);
      }
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

  isCursorOverSVG(element: Element | null): boolean {
    if (!element) return false;

    // Vérifiez si l'élément est le SVG lui-même
    if (element.tagName.toLowerCase() === 'svg') {
      return true;
    }

    // Vérifiez si l'élément est un enfant du SVG
    return element.closest('svg') !== null;
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
