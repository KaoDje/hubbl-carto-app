import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { BubbleProject } from '../models/BubbleProject.models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  categories: string[] = ['BTC', 'ETH', 'POL'];
  projects!: BubbleProject[];
  constructor() {
    // fetch('../dataset-projects.json')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     data.forEach(
    //       (project: {
    //         name: string;
    //         blockchain: string[];
    //         floorPrice: number;
    //         fluctuation: number;
    //       }) => {
    //         this.projects.push(
    //           new BubbleProject(
    //             project.name,
    //             project.blockchain,
    //             project.floorPrice,
    //             project.fluctuation
    //           )
    //         );
    //       }
    //     );
    //   })
    //   .catch((error) => console.error('Erreur :', error));
  }

  loadProjects(): Observable<BubbleProject[]> {
    return from(
      fetch('assets/dataset-projects.json')
        .then((response) => response.json())
        .then((data) => {
          this.projects = data.map(
            (project: {
              name: string;
              blockchain: string[];
              floorPrice: number;
              fluctuation: number;
            }) =>
              new BubbleProject(
                project.name,
                project.blockchain,
                project.floorPrice,
                project.fluctuation
              )
          );
          return this.projects;
        })
    );
  }
}
