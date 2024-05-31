import { Paper } from './Paper/Paper.models';

export class Project {
  id!: number;
  name!: string;
  summary!: string;
  paper!: Paper;

  constructor(_id: number, _name: string, _summary: string) {
    this.id = _id;
    this.name = _name;
    this.summary = _summary;
  }

  addPaper(_paper: Paper) {
    this.paper = _paper;
  }
  getOverview() {
    return { name: this.name, summary: this.summary };
  }
  getPaper() {}
}
