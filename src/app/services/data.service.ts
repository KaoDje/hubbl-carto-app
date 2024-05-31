import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { BubbleProject } from '../models/BubbleProject.models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  categories: string[] = ['BTC', 'ETH', 'POL'];
  projects!: BubbleProject[];

  private dataSource = new BehaviorSubject<any>(null); // Crée un BehaviorSubject pour stocker les données
  currentData = this.dataSource.asObservable(); // Expose l'observable pour que les autres puissent s'y abonner

  constructor() {}

  changeData(data: any) {
    this.dataSource.next(data); // Met à jour la valeur du BehaviorSubject, ce qui notifie tous les abonnés
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
