import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-earn-login',
  templateUrl: './earn-login.component.html',
  styleUrl: './earn-login.component.scss',
})
export class EarnLoginComponent {
  @ViewChild('earnChildContainer', { static: true })
  earnChildContainer!: ElementRef;
  @Output() heightChanged = new EventEmitter<number>();
  ngAfterViewChecked() {
    this.emitHeight();
  }
  // Méthode pour obtenir et émettre la hauteur de l'élément
  emitHeight() {
    const height = this.earnChildContainer.nativeElement.scrollHeight;
    // console.log(height);
    this.heightChanged.emit(height);
    // console.log('Height emitted:', height);
  }
  // Méthode pour obtenir la hauteur de l'élément
  getEarnChildContainerHeight(): number {
    return this.earnChildContainer.nativeElement.scrollHeight;
  }
}
