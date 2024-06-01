import { Component } from '@angular/core';

@Component({
  selector: 'app-paper-submodule',
  templateUrl: './paper-submodule.component.html',
  styleUrl: './paper-submodule.component.scss',
})
export class PaperSubmoduleComponent {
  toggleSubmodule(event: any): void {
    const submoduleElement = event.target.closest('.submodule');
    if (submoduleElement) {
      if (submoduleElement.classList.contains('active')) {
        submoduleElement.style.height = '50px';
        submoduleElement.classList.remove('active');
        const arrowElement = submoduleElement.querySelector('.arrow');
        if (arrowElement) {
          arrowElement.classList.toggle('arrow-active');
        }
      } else {
        const scrollHeight = submoduleElement.scrollHeight + 'px';
        submoduleElement.style.height = scrollHeight;
        submoduleElement.classList.add('active');
        const arrowElement = submoduleElement.querySelector('.arrow');
        if (arrowElement) {
          arrowElement.classList.toggle('arrow-active');
        }
      }
    }
  }
}
