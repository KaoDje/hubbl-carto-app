import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-carto-dashboard',
  templateUrl: './carto-dashboard.component.html',
  styleUrl: './carto-dashboard.component.scss',
})
export class CartoDashboardComponent implements OnInit {
  @Input() isPaperActive!: boolean;

  spatialFilterCategories!: string[];
  draggingElement: HTMLElement | null = null;
  colorFilterIsVisible: boolean = false;
  scaleFilterIsVisible: boolean = false;

  @Output() addSpatialMarkerEvent = new EventEmitter<{
    id: string;
    x: number;
    y: number;
  }>();

  @Output() removeSpatialMarkerEvent = new EventEmitter<string>();

  @Output() toggleQuantitativeFilterEvent = new EventEmitter<string>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.spatialFilterCategories = this.dataService.categories;
  }

  onToggleQuantitativeFilterVisibility(event: MouseEvent) {
    const target = event.target as HTMLImageElement;
    const quantitativeFilterElement = (event.target as HTMLElement).closest(
      '.element'
    ) as HTMLElement;
    if (target.id == 'colorFilterButton') {
      if (this.colorFilterIsVisible) {
        this.colorFilterIsVisible = false;
        quantitativeFilterElement.style.opacity = '50%';
        target.src = '../../assets/img/visibility-off-icon.png';
      } else {
        this.colorFilterIsVisible = true;
        quantitativeFilterElement.style.opacity = '100%';
        target.src = '../../assets/img/visibility-on-icon.png';
      }
      this.toggleQuantitativeFilterEvent.emit('color');
    }
    if (target.id == 'scaleFilterButton') {
      if (this.scaleFilterIsVisible) {
        this.scaleFilterIsVisible = false;
        quantitativeFilterElement.style.opacity = '50%';
        target.src = '../../assets/img/visibility-off-icon.png';
      } else {
        this.scaleFilterIsVisible = true;
        quantitativeFilterElement.style.opacity = '100%';
        target.src = '../../assets/img/visibility-on-icon.png';
      }
      this.toggleQuantitativeFilterEvent.emit('scale');
    }
  }

  /**
   * Drag and Drop Spatial Filters
   */

  startDrag(event: MouseEvent, category: string) {
    const categoryContainer = (event.target as HTMLElement).closest(
      '.category-container'
    );
    if (!categoryContainer) {
      console.error('Élément parent .category-container non trouvé');
      return;
    }

    this.draggingElement = categoryContainer.cloneNode(true) as HTMLElement; // Si je veux dupliquer l'élément
    // this.draggingElement = categoryContainer as HTMLElement; // Si je ne veux pas dupliquer l'élément

    // Object.assign(this.draggingElement.style, {
    //   position: 'absolute',
    //   left: `${event.pageX}px`,
    //   top: `${event.pageY}px`,
    //   zIndex: '1000',
    // });
    this.draggingElement.style.position = 'absolute';
    this.draggingElement.style.left = `${event.pageX}px`;
    this.draggingElement.style.top = `${event.pageY}px`;
    this.draggingElement.style.zIndex = '1000';

    this.draggingElement.classList.add('category-container-dragging');

    document.body.appendChild(this.draggingElement);

    // Prévenir le comportement de drag par défaut
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.draggingElement) return;

    this.draggingElement.style.left = `${event.pageX}px`;
    this.draggingElement.style.top = `${event.pageY}px`;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!this.draggingElement) return;
    const id = (event.target as HTMLElement).textContent;
    const x = event.pageX;
    const y = event.pageY;
    console.log(id, x, y);

    if (id) {
      this.addSpatialMarkerEvent.emit({ id, x, y });
    }

    // Ici, vous pouvez appeler votre fonction addSpatialMarker avec event.pageX et event.pageY

    document.body.removeChild(this.draggingElement);
    this.draggingElement = null;
  }
}
