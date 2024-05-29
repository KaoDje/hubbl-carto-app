import {
  color,
  drag,
  easeCubic,
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  interpolateRgb,
  max,
  min,
  scaleLinear,
  select,
  selectAll,
} from 'd3';
import { BubbleProject } from '../models/BubbleProject.models';
import { DataService } from '../services/data.service';
import { QuantitativeFilter } from './QuantitativeFilter.models';
import { SpatialMarker } from './SpatialMarker.models';

export class BubbleChart {
  parentElement!: string;
  spatialMarkers: SpatialMarker[] = [];
  scaleFilter!: QuantitativeFilter;
  colorFilter!: QuantitativeFilter;
  projectsData!: BubbleProject[];
  initialBubbleRadius: number = 13;
  simulationActivity: number = 0.04;
  simulationAlpha: number = 0.08;
  WIDTH: number = window.innerWidth;
  HEIGHT: number = window.innerHeight;
  svg!: any;
  simulation!: any;
  bubbles!: any;
  attractors!: any;
  forceX!: any;
  forceY!: any;

  constructor(
    _parentElement: string,
    _projectsData: BubbleProject[],
    scaleFilter: QuantitativeFilter,
    colorFilter: QuantitativeFilter
    // private dataService: DataService
  ) {
    this.parentElement = _parentElement;

    // this.projectsData = [];
    // _projectsData.forEach((project) => {
    //   this.projectsData.push(new BubbleProject(project));
    // });
    this.projectsData = _projectsData;

    // this.spatialMarkers = [];
    // _spatialMarkers.forEach((marker) => {
    //   this.spatialMarkers.splice(
    //     blockchains[marker.blockchain],
    //     0,
    //     new SpatialMarker(marker)
    //   );
    // });

    // this.scaleFilter = scaleFilter;
    // this.scaleFilter = new QuantitativeFilter(scaleFilter);
    // this.colorFilter = new QuantitativeFilter(colorFilter);
    this.scaleFilter = scaleFilter;
    this.colorFilter = colorFilter;

    this.initVisualization();
  }

  initVisualization() {
    const visualization = this;

    // Init Data

    this.svg = select(visualization.parentElement)
      .attr('height', '100vh')
      .attr('width', '100%');

    this.simulation = forceSimulation(this.projectsData)
      .force(
        'center',
        forceCenter(visualization.WIDTH / 2, visualization.HEIGHT / 2).strength(
          0
        )
      )
      .force(
        'collision',
        forceCollide().radius(visualization.initialBubbleRadius + 5)
      )
      .on('tick', visualization.ticked);

    this.simulation.alphaTarget(this.simulationActivity);

    this.bubbles = this.svg
      .selectAll('.bubble')
      .data(this.projectsData)
      .enter()
      .append('g') // Créez un groupe pour chaque bubble
      .attr('class', 'bubble')
      .call(
        drag()
          .on('start', visualization.dragstarted)
          .on('drag', visualization.dragged)
          .on('end', visualization.dragended)
      )
      .on('click', (event: MouseEvent, d: BubbleProject) => {
        // this.dataService.selectedProject = d;
      });

    // Ajouter le cercle à l'intérieur de chaque groupe
    this.bubbles
      .append('circle')
      .attr('id', (d: BubbleProject) => d.name)
      .attr('r', (d: BubbleProject) => {
        d.setRadius(visualization.initialBubbleRadius);
        return d.radius;
      })
      .style('fill', '#d9d9d9')
      .attr('cx', (d: BubbleProject) => d.x)
      .attr('cy', (d: BubbleProject) => d.y);

    // Ajouter le texte à l'intérieur de chaque groupe
    this.bubbles
      .append('text')
      .text((d: BubbleProject) => d.name) // Remplacez 'name' par la propriété contenant le texte à afficher
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('x', (d: BubbleProject) => d.x)
      .attr('y', (d: BubbleProject) => d.y)
      .style('font-size', '10px')
      .style('fill', '#f3f3f3')
      .style('transform', (d: BubbleProject) => {
        const y = d.radius + 12;
        return `translate(0, ${y}px)`;
      });

    this.attractors = this.svg
      .selectAll('.attractor')
      .data(this.spatialMarkers)
      .enter()
      .append('g')
      .attr('class', 'attractor')
      .call(
        drag()
          .on('start', visualization.dragstarted)
          .on('drag', visualization.dragged)
          .on('end', visualization.dragended)
      )
      .on('dblclick', (event: any, d: any) => {
        visualization.removeSpatialMarker(d.id);
      });

    // this.attractors = this.svg
    // .selectAll('.attractor')
    // .data(this.spatialMarkers)
    // .enter()
    // .append('g')
    // .attr('class', 'attractor')
    // .call(
    //   drag()
    //     .on('start', visualization.dragstarted)
    //     .on('drag', visualization.dragged)
    //     .on('end', visualization.dragended)
    // );

    this.attractors
      .append('image')
      .attr('id', (d: SpatialMarker) => d.id)
      .attr('width', 64)
      .attr('height', 36)
      .attr('href', '/assets/icon/bg-spatial-filter-category.svg')
      .attr('x', (d: SpatialMarker) => d.x)
      .attr('y', (d: SpatialMarker) => d.y);

    this.attractors
      .append('text')
      .text((d: SpatialMarker) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '12px')
      .style('fill', 'white');
    // .style("transform", "translate(20px, 10px)");

    this.setInitialForces();
  }

  wrangleData() {
    const visualization = this;

    // Mettre à jour les données des attractors
    this.attractors.remove();

    this.attractors = this.svg
      .selectAll('.attractor')
      .data(this.spatialMarkers)
      .enter()
      .append('g')
      .attr('class', 'attractor')
      .call(
        drag()
          .on('start', visualization.dragstarted)
          .on('drag', visualization.dragged)
          .on('end', visualization.dragended)
      )
      .on('dblclick', (event: any, d: any) => {
        visualization.removeSpatialMarker(d.id);
      });

    this.attractors.append('title').text('Doublic clic pour retirer');

    // this.attractors
    //   .append('rect')
    //   .attr('id', (d: SpatialMarker) => d.id)
    //   .attr('width', 64)
    //   .attr('height', 36)
    //   .style('fill', 'url(#imagePattern)')
    //   .attr('x', (d: SpatialMarker) => d.x)
    //   .attr('y', (d: SpatialMarker) => d.y)
    //   .attr('rx', 4)
    //   .style('transform', 'translate(-32px, -18px)');

    this.attractors
      .append('image')
      .attr('id', (d: SpatialMarker) => d.id)
      .attr('width', 64)
      .attr('height', 36)
      .attr('href', '/assets/icon/bg-spatial-filter-category.svg')
      .attr('x', (d: SpatialMarker) => d.x)
      .attr('y', (d: SpatialMarker) => d.y)
      .attr('rx', 4)
      .style('transform', 'translate(-32px, -18px)');

    this.attractors
      .append('text')
      .text((d: SpatialMarker) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '16px')
      .style('fill', 'white');
    // .style("transform", "translate(20px, 10px)");

    // Mettre à jour les forces de simulation
    if (this.spatialMarkers.length === 1) {
      this.updateForces1(this.spatialMarkers[0], 0.1);
    } else if (this.spatialMarkers.length === 2) {
      this.updateForces2(0.1);
    } else if (this.spatialMarkers.length === 3) {
      this.updateForces3(0.1);
    } else {
      this.setInitialForces();
    }

    if (this.colorFilter.isVisible) {
      this.updateQuantitativeFilter(this.colorFilter);
    } else {
      this.projectsData.forEach((project) => {
        project.color = '#D9D9D9';
      });
    }

    // if (this.scaleFilter.isVisible) {
    //   this.updateQuantitativeFilter(this.scaleFilter.getConfiguration());
    // } else {
    //   this.bubbles
    //     .selectAll("circle")
    //     .transition()
    //     .duration(500)
    //     .ease(d3.easeCubic)
    //     .attr("r", (d) => {
    //       if (this.spatialMarkers.length > 0) {
    //         const marker = this.spatialMarkers.find((marker) =>
    //           d.blockchain.some((id) => id === marker.id)
    //         );
    //         if (marker) {
    //           d.radius = 20;
    //           return 20;
    //         } else {
    //           d.radius = 0;
    //           return 0;
    //         }
    //       } else {
    //         d.radius = 20;
    //         return 20;
    //       }
    //     })
    //     .style("fill", (d) => d.color);
    // }

    if (this.scaleFilter.isVisible) {
      this.updateQuantitativeFilter(this.scaleFilter);
    } else {
      this.bubbles
        .selectAll('circle')
        .transition()
        .duration(500)
        .ease(easeCubic)
        .attr('r', (d: BubbleProject) => {
          if (this.spatialMarkers.length > 0) {
            const marker = this.spatialMarkers.find((marker) =>
              d.blockchain.some((id) => id === marker.id)
            );
            if (marker) {
              d.setRadius(visualization.initialBubbleRadius);
              return d.radius;
            } else {
              d.radius = 0;
              return 0;
            }
          } else {
            d.setRadius(visualization.initialBubbleRadius);
            return d.radius;
          }
        })
        .style('fill', (d: BubbleProject) => d.color);
    }

    // if (this.colorFilter.isVisible) {
    //   this.updateQuantitativeFilter(this.colorFilter.getConfiguration());
    // } else {
    //   // this.bubbles.selectAll("circle").style("fill", "#d9d9d9");
    // }

    this.bubbles
      .selectAll('text')
      .transition()
      .duration(100)
      .attr('opacity', (d: BubbleProject) => {
        if (this.spatialMarkers.length > 0) {
          const marker = this.spatialMarkers.find((marker) =>
            d.blockchain.some((id) => id === marker.id)
          );
          return marker ? 100 : 0;
        } else {
          return 100;
        }
      });

    visualization.updateVisualization();
  }

  updateVisualization() {
    const visualization = this;

    this.bubbles
      .selectAll('circle')
      // .transition(d3.transition().ease(d3.easeCubic).duration(15))
      .attr('cx', (d: BubbleProject) => d.x)
      .attr('cy', (d: BubbleProject) => d.y);

    this.bubbles
      .select('text') // Sélectionnez le texte dans chaque groupe
      .attr('x', (d: BubbleProject) => d.x)
      .attr('y', (d: BubbleProject) => d.y)
      // .style("transform", "translate(0, 20px)");
      .style('transform', (d: BubbleProject) => {
        const y = d.radius + 12;
        return `translate(0, ${y}px)`;
      })
      .style('font-size', (d: BubbleProject) => {
        if (d.radius <= 10) {
          return '0px';
        } else if (d.radius < 20) {
          return '10px';
        } else if (d.radius < 30) {
          return '11px';
        } else if (d.radius < 40) {
          return '12px';
        } else if (d.radius < 50) {
          return '13px';
        } else if (d.radius < 60) {
          return '14px';
        } else if (d.radius < 75) {
          return '15px';
        } else if (d.radius < 100) {
          return '16px';
        } else {
          return '18px';
        }
      });

    // this.attractors
    //   .selectAll("circle")
    //   .attr("x", (d) => d.x)
    //   .attr("y", (d) => d.y);
    this.attractors
      .select('image')
      .attr('x', (d: SpatialMarker) => d.x)
      .attr('y', (d: SpatialMarker) => d.y);
    this.attractors
      .select('text')
      .attr('x', (d: SpatialMarker) => d.x)
      .attr('y', (d: SpatialMarker) => d.y);

    this.simulation.force('collision').radius((d: BubbleProject) => {
      if (d.radius <= 0) {
        return 0;
      } else if (d.radius <= 10) {
        return d.radius + 5;
      } else {
        return d.radius + 25;
      }
    });

    // this.simulation.alpha(this.simulationAlpha).restart();
  }

  // addSpatialMarker(id: string, x: number, y: number) {
  //   const index = this.spatialMarkers.findIndex((e) => {
  //     e.id === id;
  //   });
  //   if (index == -1) {
  //     if (this.spatialMarkers.find((m) => m.id == id)) {
  //       console.log(this.spatialMarkers[index]);
  //     }
  //     this.spatialMarkers.unshift(new SpatialMarker(id, x, y));
  //     this.wrangleData();
  //     // console.log("added with id : ", id);
  //   }
  // }

  addSpatialMarker(id: string, x: number, y: number) {
    const marker = this.spatialMarkers.find((m) => m.id == id);
    if (marker) {
      marker.x = x;
      marker.y = y;
      if (this.spatialMarkers.length === 1) {
        this.updateForces1(this.spatialMarkers[0], 0.1);
      } else if (this.spatialMarkers.length === 2) {
        this.updateForces2(0.1);
      } else if (this.spatialMarkers.length === 3) {
        this.updateForces3(0.1);
      } else {
        this.setInitialForces();
      }
    } else {
      this.spatialMarkers.unshift(new SpatialMarker(id, x, y));
      this.wrangleData();
    }
  }

  removeSpatialMarker(id: string) {
    const index = this.spatialMarkers.findIndex((e) => {
      return e.id === id;
    });
    if (index !== -1) {
      this.spatialMarkers.splice(index, 1);
      this.wrangleData();
      // console.log("removed by id : ", id);
    }
  }

  setInitialForces() {
    const visualization = this;
    this.simulation
      .force('charge', forceManyBody().strength(-5))
      .force('x', forceX(visualization.WIDTH / 2).strength(0.05))
      .force('y', forceY(visualization.HEIGHT / 2 + 25).strength(0.05))
      .alphaDecay(0.01);
  }

  updateForces1(attractor: SpatialMarker, strength: number) {
    const visualization = this;

    // this.forceX = d3
    //   .forceX(attractor.x)
    //   .x((d: BubbleProject) => {
    //     if (d.blockchain.includes(attractor.id)) {
    //       return attractor.x;
    //     } else {
    //       return visualization.WIDTH / 2;
    //     }
    //   })
    //   .strength(strength);
    // this.forceY = d3
    //   .forceY(attractor.y)
    //   .y((d: BubbleProject) => {
    //     if (d.blockchain.includes(attractor.id)) {
    //       return attractor.y;
    //     } else {
    //       return visualization.HEIGHT / 2;
    //     }
    //   })
    //   .strength(strength);

    this.forceX = forceX()
      .x((d: d3.SimulationNodeDatum) => {
        // Cast 'd' to 'BubbleProject' inside the function after checking it is defined
        if (!('blockchain' in d)) return visualization.WIDTH / 2;

        const bubbleProject = d as BubbleProject;
        return bubbleProject.blockchain.includes(attractor.id)
          ? attractor.x
          : visualization.WIDTH / 2;
      })
      .strength(strength);

    this.forceY = forceY()
      .y((d: d3.SimulationNodeDatum) => {
        // Cast 'd' to 'BubbleProject' inside the function after checking it is defined
        if (!('blockchain' in d)) return visualization.HEIGHT / 2;

        const bubbleProject = d as BubbleProject;
        return bubbleProject.blockchain.includes(attractor.id)
          ? attractor.y
          : visualization.HEIGHT / 2;
      })
      .strength(strength);

    this.simulation.force('x', this.forceX).force('y', this.forceY);
    this.simulation.alpha(this.simulationAlpha).restart();
  }

  updateForces2(strength: number) {
    const visualization = this;
    this.forceX = forceX()
      .x((d: d3.SimulationNodeDatum) => {
        const bubbleProject = d as BubbleProject;
        if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          return (this.spatialMarkers[0].x + this.spatialMarkers[1].x) / 2;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id)
        ) {
          return this.spatialMarkers[0].x;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          return this.spatialMarkers[1].x;
        } else {
          return visualization.WIDTH / 2;
        }
      })
      .strength(strength);

    this.forceY = forceY()
      .y((d: d3.SimulationNodeDatum) => {
        const bubbleProject = d as BubbleProject;
        if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          return (this.spatialMarkers[0].y + this.spatialMarkers[1].y) / 2;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id)
        ) {
          return this.spatialMarkers[0].y;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          return this.spatialMarkers[1].y;
        } else {
          return visualization.HEIGHT / 2;
        }
      })
      .strength(strength);

    this.simulation.force('x', this.forceX).force('y', this.forceY);
    this.simulation.alpha(this.simulationAlpha).restart();
  }

  updateForces3(strength: number) {
    const visualization = this;
    const gravityCenter = {
      x:
        (this.spatialMarkers[0].x +
          this.spatialMarkers[1].x +
          this.spatialMarkers[2].x) /
        3,
      y:
        (this.spatialMarkers[0].y +
          this.spatialMarkers[1].y +
          this.spatialMarkers[2].y) /
        3,
    };

    const point01 = this.calculatePointC(
      this.spatialMarkers[0].x,
      this.spatialMarkers[0].y,
      this.spatialMarkers[1].x,
      this.spatialMarkers[1].y,
      gravityCenter
    );
    const point02 = this.calculatePointC(
      this.spatialMarkers[0].x,
      this.spatialMarkers[0].y,
      this.spatialMarkers[2].x,
      this.spatialMarkers[2].y,
      gravityCenter
    );
    const point12 = this.calculatePointC(
      this.spatialMarkers[1].x,
      this.spatialMarkers[1].y,
      this.spatialMarkers[2].x,
      this.spatialMarkers[2].y,
      gravityCenter
    );

    this.forceX = forceX()
      .x((d: d3.SimulationNodeDatum) => {
        const bubbleProject = d as BubbleProject;

        //3
        if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          return gravityCenter.x;
        }

        // 2
        else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          // return (this.spatialMarkers[0].x + this.spatialMarkers[1].x) / 2;
          return point01.x;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          // return (this.spatialMarkers[0].x + this.spatialMarkers[2].x) / 2;
          return point02.x;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          // return (this.spatialMarkers[1].x + this.spatialMarkers[2].x) / 2;
          return point12.x;
        }

        // 1
        else if (bubbleProject.blockchain.includes(this.spatialMarkers[0].id)) {
          return this.spatialMarkers[0].x;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          return this.spatialMarkers[1].x;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          return this.spatialMarkers[2].x;
        } else {
          return visualization.WIDTH / 2;
        }
      })
      .strength(strength);

    this.forceY = forceY()
      .y((d: d3.SimulationNodeDatum) => {
        const bubbleProject = d as BubbleProject;

        // 3
        if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          return gravityCenter.y;
        }

        // 2
        else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          // return (this.spatialMarkers[0].y + this.spatialMarkers[1].y) / 2;
          return point01.y;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[0].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          // return (this.spatialMarkers[0].y + this.spatialMarkers[2].y) / 2;
          return point02.y;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id) &&
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          // return (this.spatialMarkers[1].y + this.spatialMarkers[2].y) / 2;
          return point12.y;
        }

        // 1
        else if (bubbleProject.blockchain.includes(this.spatialMarkers[0].id)) {
          return this.spatialMarkers[0].y;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[1].id)
        ) {
          return this.spatialMarkers[1].y;
        } else if (
          bubbleProject.blockchain.includes(this.spatialMarkers[2].id)
        ) {
          return this.spatialMarkers[2].y;
        } else {
          return visualization.WIDTH / 2;
        }
      })
      .strength(strength);

    this.simulation.force('x', this.forceX).force('y', this.forceY);
    this.simulation.alpha(this.simulationAlpha).restart();
  }

  updateQuantitativeFilter(filter: QuantitativeFilter) {
    const visualization = this;
    // const activeBubbles = this.bubbles.filter((d) =>
    //   this.spatialMarkers.some((marker) =>
    //     d.blockchain.some((id) => id === marker.id)
    //   )
    // );

    /**
     * Filtre Color simple
     */
    // if (filterConfig.type == "color") {
    //   const inputMin = d3.min(this.projectsData, (d) => d.fluctuation);
    //   const inputMax = d3.max(this.projectsData, (d) => d.fluctuation);
    //   const linearScale = d3
    //     .scaleLinear()
    //     .domain([inputMin, inputMax])
    //     .range([0, 100]);
    //   const colorInterpolator = d3.interpolateRgb(
    //     filterConfig.color.min,
    //     filterConfig.color.max
    //   );
    //   const valueToColor = (value) => {
    //     const scaledValue = linearScale(value);
    //     const normalizedValue = Math.max(0, Math.min(1, scaledValue / 100));
    //     const color = colorInterpolator(normalizedValue);
    //     return d3.color(color).formatHex();
    //   };
    //   this.projectsData.forEach((project) => {
    //     project.setColor(valueToColor(project.fluctuation));
    //   });
    // }

    /**
     * Filtre Color complexe
     */
    if (filter.configuration.type == 'color') {
      let inputMin = min(
        this.projectsData,
        (d: BubbleProject) => d.fluctuation
      );
      let inputMax = max(
        this.projectsData,
        (d: BubbleProject) => d.fluctuation
      );
      if (!inputMin) {
        inputMin = -50;
      }
      if (!inputMax) {
        inputMax = 50;
      }
      const maxValue = Math.max(Math.abs(inputMin), Math.abs(inputMax));
      const linearScale = scaleLinear().domain([0, maxValue]).range([0, 100]);
      const positiveColorInterpolator = interpolateRgb('#d9d9d9', '#00ff00');
      const negativeColorInterpolator = interpolateRgb('#d9d9d9', '#ff0000');
      const valueToColor = (value: number) => {
        const scaledValue = linearScale(Math.abs(value));
        const normalizedValue = Math.max(0, Math.min(1, scaledValue / 100));
        let _color;
        if (value >= 0) {
          _color = positiveColorInterpolator(normalizedValue);
        } else {
          _color = negativeColorInterpolator(normalizedValue);
        }
        return color(_color)?.formatHex();
      };

      this.projectsData.forEach((project) => {
        project.setColor(valueToColor(project.fluctuation) ?? '#d9d9d9');
      });
    }

    /**
     * Filtre Scale
     */
    if (filter.configuration.type == 'scale') {
      const inputMin = min(
        this.projectsData,
        (d: BubbleProject) => d.floorPrice
      );
      const inputMax = max(
        this.projectsData,
        (d: BubbleProject) => d.floorPrice
      );
      if (inputMin === undefined || inputMax === undefined) {
        throw new Error('Data is empty or not valid.');
      }
      const linearScale = scaleLinear()
        .domain([inputMin, inputMax])
        .range([
          filter.configuration.limits.min,
          filter.configuration.limits.max,
        ]);
      this.bubbles
        .selectAll('circle')
        .transition()
        .duration(500)
        .ease(easeCubic)
        .attr('r', (d: BubbleProject) => {
          if (visualization.spatialMarkers.length > 0) {
            const marker = this.spatialMarkers.find((marker) =>
              d.blockchain.some((id) => id === marker.id)
            );
            if (marker) {
              d.setRadius(linearScale(d.floorPrice));
              return d.radius;
            } else {
              d.setRadius(0);
              return 0;
            }
          } else {
            d.setRadius(linearScale(d.floorPrice));
            return d.radius;
          }
        })
        .style('fill', (d: BubbleProject) => d.color);
    }
  }

  ticked = () => {
    this.updateVisualization();
  };

  dragstarted = (event: any, d: any) => {
    if (!event.active)
      this.simulation.alphaTarget(this.simulationActivity).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  dragged = (event: any, d: any) => {
    d.fx = event.x;
    d.fy = event.y;

    if (d.attractor) {
      // console.log(d);
      d.updateAttractorPosition(event.x, event.y);
    }
  };

  dragended = (event: any, d: any) => {
    if (!event.active) this.simulation.alphaTarget(this.simulationActivity);
    d.fx = null;
    d.fy = null;
    if (d.attractor) {
      if (this.spatialMarkers.length == 1) {
        this.updateForces1(d, 0.1);
      }
      if (this.spatialMarkers.length == 2) {
        this.updateForces2(0.1);
      }
      if (this.spatialMarkers.length == 3) {
        this.updateForces3(0.1);
      }
    }
  };

  calculatePointC(
    x_A: number,
    y_A: number,
    x_B: number,
    y_B: number,
    gravityCenter: { x: number; y: number }
  ) {
    const d = 150;
    // Milieu segment AB
    const x_M = (x_A + x_B) / 2;
    const y_M = (y_A + y_B) / 2;

    // Vecteur dir droite AB
    const u_x = x_B - x_A;
    const u_y = y_B - y_A;

    // Vecteur perpendiculaire
    const v_x = -u_y;
    const v_y = u_x;

    // Normalisation du vecteur
    const norm = Math.sqrt(v_x * v_x + v_y * v_y);
    const vv_x = v_x / norm;
    const vv_y = v_y / norm;

    // Calcul point C
    const x_C = x_M + vv_x * d;
    const y_C = y_M + vv_y * d;

    if (
      this.isFurtherstPosition(
        x_C,
        y_C,
        x_M,
        y_M,
        gravityCenter.x,
        gravityCenter.y
      )
    ) {
      return { x: x_C, y: y_C };
    } else {
      return { x: x_M - vv_x * d, y: y_M - vv_y * d };
    }
  }

  isFurtherstPosition(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    targetX: number,
    targetY: number
  ) {
    const dx1 = x1 - targetX;
    const dy1 = y1 - targetY;
    const dx2 = x2 - targetX;
    const dy2 = y2 - targetY;

    if (Math.sqrt(dx1 * dx1 + dy1 * dy1) > Math.sqrt(dx2 * dx2 + dy2 * dy2)) {
      return true;
    } else {
      return false;
    }
  }

  zoom(sens: boolean) {
    if (sens) {
      this.initialBubbleRadius += 1;
    } else {
      this.initialBubbleRadius -= 1;
    }
    if (this.initialBubbleRadius < 5) {
      this.initialBubbleRadius = 5;
    }
    if (this.initialBubbleRadius > 50) {
      this.initialBubbleRadius = 50;
    }
    console.log(this.initialBubbleRadius);
    this.wrangleData();
  }
}
