import { SubModule } from '../SubModules.models';

export class QuantitativeDataSubModule extends SubModule {
  dataProvider: string = 'HUBBL';
  //   data!: QuantitativeData;
  floorPrice!: number;
  sevenDayPercent!: number;

  constructor(_floorPrice: number, _sevenDayPercent: number) {
    super();
    // this.data = new QuantitativeData(_floorPrice, _sevenDayPercent);
    this.floorPrice = _floorPrice;
    this.sevenDayPercent = _sevenDayPercent;
  }
}

// class QuantitativeData {
//   floorPrice!: number;
//   sevenDayPercent!: number;

//   constructor(_floorPrice: number, _sevenDayPercent: number) {
//     this.floorPrice = _floorPrice;
//     this.sevenDayPercent = _sevenDayPercent;
//   }
// }
