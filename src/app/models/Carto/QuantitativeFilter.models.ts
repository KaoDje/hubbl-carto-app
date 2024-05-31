export class QuantitativeFilter {
  public type: string = 'quantitative';
  public configuration!: { type: string; limits: { min: number; max: number } };
  public isVisible: boolean = false;

  constructor(filterConfig: {
    type: string;
    limits: { min: number; max: number };
  }) {
    // this.title = filter.title;
    this.type = 'quantitative';
    // this.metaMetric = filter.metaMetric;
    // this.metric = filter.metric;
    this.configuration = filterConfig;
    this.isVisible = false;
  }

  //   setTitle(title: string) {
  //     this.title = title;
  //   }

  //   setMetaMetric(metaCategory) {
  //     this.metaCategory = metaCategory;
  //   }

  //   setMetric(categories) {
  //     this.categories = categories;
  //   }

  toggleVisibility() {
    if (this.isVisible) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  getConfiguration() {
    return this.configuration;
  }
}

// filter.configuration

// {
//   type: colors / scale;
//   order: ASC / DSC;
//   limits: {
//     max: 100000;
//     min: 1000;
//   }
//   color: {
//     max: "#00ff00";
//     min: "#ff0000"
//   }
// }
