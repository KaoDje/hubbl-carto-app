import d3 from 'd3';

export class BubbleProject implements d3.SimulationNodeDatum {
  public name!: string;
  public x!: number;
  public y!: number;
  public blockchain!: string[];
  public floorPrice!: number;
  public fluctuation!: number;
  public radius: number = 0;
  public color: string = '#D9D9D9';

  constructor(
    name: string,
    blockchain: string[],
    floorPrice: number,
    fluctuation: number
  ) {
    this.name = name;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.blockchain = blockchain;
    this.floorPrice = floorPrice;
    this.fluctuation = fluctuation;
  }

  updatePosition(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  setRadius(r: number) {
    this.radius = r;
  }

  setColor(c: string) {
    this.color = c;
  }
}
