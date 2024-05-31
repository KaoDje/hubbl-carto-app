export class SpatialMarker {
  id!: string;
  x!: number;
  y!: number;
  attractor: number = 1;
  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    // console.log(this);
  }

  updateAttractorPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
