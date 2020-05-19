import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements OnInit {
  @ViewChild('scatterChartDiv', { static: true }) myDiv: ElementRef;

  cardTitle = 'Player Cluster'

  scatterChartData = {
    width: window.innerWidth / 6,
    height: 200,
    data: [{ x: 20, y: 30 }, { x: 10, y: 50 }, { x: 30, y: 15 }],
    margin: { top: 20, right: 10, bottom: 20, left: 35 }
  }
  svg: any;

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      this.myDiv.nativeElement.innerHTML = '';
      this.scatterChartData.data = this.dataService.scatterData.batsman
      this.createScatterChart()
    })
  }

  createScatterChart() {
    console.log(this.scatterChartData.data)
    this.myDiv.nativeElement.innerHTML = '';

    var color = d3.scaleOrdinal(d3.schemeCategory10);
   
    // set the ranges
    var x = d3.scaleLinear().range([0, this.scatterChartData.width]);
    var y = d3.scaleLinear().range([this.scatterChartData.height, 0]);

    var svg = d3.select(this.myDiv.nativeElement)
      .append("svg:svg")
      .attr("width", this.scatterChartData.width +
        this.scatterChartData.margin.left +
        this.scatterChartData.margin.right)
      .attr("height", this.scatterChartData.height +
        this.scatterChartData.margin.top +
        this.scatterChartData.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.scatterChartData.margin.left + ","
        + this.scatterChartData.margin.top + ")");


    // Scale the range of the data
    x.domain(d3.extent(this.scatterChartData.data, function (d) { return d.x; }));
    y.domain([0, d3.max(this.scatterChartData.data, function (d) {
      return Math.max(d.y);
    })]);

    svg.append("g")
      .attr("transform", "translate(0," + this.scatterChartData.height + ")")
      .call(d3.axisBottom(x).ticks(8));


    svg.selectAll(".dot")
      .data(this.scatterChartData.data)
      .enter().append("circle") // Uses the enter().append() method
      .style('fill', function(d){return color(d.cluster);})
      .attr("cx", function (d, i) { return x(0) })
      .attr("cy", function (d) { return y(d.y) })
      .attr("r", 3);

    svg.selectAll("circle")
      .transition()
      .delay(function (d, i) { return (i * 3) })
      .style('fill', function(d){return color(d.cluster);})
      .duration(1400)
      .attr("cx", function (d) { return x(d.x); })
      .attr("cy", function (d) { return y(d.y); })

    svg.append("g")
      .call(d3.axisLeft(y).ticks(8))
  }

}
