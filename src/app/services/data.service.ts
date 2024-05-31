import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { BubbleProject } from '../models/Carto/BubbleProject.models';
import { Module } from '../models/Paper/Module.models';
import { Paper } from '../models/Paper/Paper.models';
import { CategorizationSubModule } from '../models/Paper/SubModuleExtend/CategorizationSubModule.models';
import { LoreSubModule } from '../models/Paper/SubModuleExtend/LoreSubModule.models';
import { QuantitativeDataSubModule } from '../models/Paper/SubModuleExtend/QuantitativeDataSubModule.models';
import { UsecaseFeaturesSubModule } from '../models/Paper/SubModuleExtend/UsecaseFeaturesSubModule.models';
import { Project } from '../models/Project.models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  categories: string[] = ['BTC', 'ETH', 'POL'];
  projects!: BubbleProject[];
  projects2!: Project[];

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

  loadProjects2(): Observable<Project[]> {
    return from(
      fetch('assets/dataset-projects2.json')
        .then((response) => response.json())
        .then((data) => {
          this.projects2 = data.map(
            (project: {
              id: number;
              name: string;
              summary: string;
              paper: Paper;
            }) => {
              const pr = new Project(project.id, project.name, project.summary);
              const pa = new Paper();
              if (project.paper && project.paper.modules) {
                project.paper.modules.forEach((m) => {
                  const module = new Module(m.stringId);
                  switch (m.stringId) {
                    case 'lore':
                      if (m.subModules) {
                        m.subModules.forEach((sm) => {
                          const lsm = sm as LoreSubModule;
                          module.addSubModule(
                            new LoreSubModule(lsm.title, lsm.text)
                          );
                        });
                      }
                      break;
                    case 'usecase-features':
                      if (m.subModules) {
                        m.subModules.forEach((sm) => {
                          const ufsm = sm as UsecaseFeaturesSubModule;
                          module.addSubModule(
                            new UsecaseFeaturesSubModule(ufsm.title, ufsm.text)
                          );
                        });
                      }
                      break;
                    case 'quantitative-data':
                      if (m.subModules) {
                        m.subModules.forEach((sm) => {
                          const qdsm = sm as QuantitativeDataSubModule;
                          module.addSubModule(
                            new QuantitativeDataSubModule(
                              qdsm.floorPrice,
                              qdsm.sevenDayPercent
                            )
                          );
                        });
                      }
                      break;
                    case 'categorization':
                      if (m.subModules) {
                        m.subModules.forEach((sm) => {
                          const csm = sm as CategorizationSubModule;
                          module.addSubModule(
                            new CategorizationSubModule(
                              csm.metaCategory,
                              csm.categories
                            )
                          );
                        });
                      }
                      break;
                  }
                  pa.addModule(module);
                });
              }
              pr.addPaper(pa);
              return pr;
            }
          );
          return this.projects2;
        })
    );
  }
}
