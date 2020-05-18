import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {
  @ViewChild('barChartDiv', { static: true }) myDiv: ElementRef;

  barChartData = {
    width: 300,
    height: 220,
    margin: {
      left: 50,
      right: 10,
      bottom: 10,
      top: 20
    },
    data: [
      { 'year': 2016, 'count': 45 },
      { 'year': 2015, 'count': 22 },
      { 'year': 2014, 'count': 99 }
    ]
  }
  svg: any;

  constructor(private dataService: CommonDataService) { }
  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
    })

    this.barChart()
  }

  barChart() {

    var x = d3.scale.ordinal().range([0, this.barChartData.width]);

    var y = d3.scale.linear().range([this.barChartData.height, 0]);



    var svg =
      d3.select(this.myDiv.nativeElement)
        .append("svg")
        .attr("width", this.barChartData.width + this.barChartData.margin.left + this.barChartData.margin.right)
        .attr("height", this.barChartData.height + this.barChartData.margin.top + this.barChartData.margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + this.barChartData.margin.left + "," + this.barChartData.margin.top + ")");

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);
    
    x.domain(this.barChartData.data.map(function (d) { console.log(d['year']); return d['year']; }));
    y.domain([0, d3.max(this.barChartData.data, function (d) { return d['count']; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.barChartData.height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

    svg.selectAll("bar")
      .data(this.barChartData.data)
      .enter()
      .append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) { console.log(x(d.year)); return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function (d) { return y(d.count); })
      .attr("height", d => { return this.barChartData.height - y(d.count); });
  }
}

