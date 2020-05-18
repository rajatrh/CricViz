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
    height: 230,
    margin: {
      left: 50,
      right: 10,
      bottom: 30,
      top: 10
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
    var x = d3.scaleBand()
      .rangeRound([0, this.barChartData.width - 50])
      .paddingOuter(0.2)
      .paddingInner(0.1);

    var y = d3.scaleLinear()
      .rangeRound([this.barChartData.height, 0]);

    var svg = d3.select(this.myDiv.nativeElement)
      .append("svg")
      .attr("width", this.barChartData.width)
      .attr("height", this.barChartData.height)

    var g = svg.append("g")
      .attr("transform", "translate(" +
        this.barChartData.margin.left + "," +
        this.barChartData.margin.top + ")");

    // var tip = d3.select("#barChartContainer")
    //   .append("div")
    //   .attr("class", "tip")
    //   .style("position", "absolute")
    //   .style("visibility", "hidden")
    //   .style("z-index", "20");

    x.domain(this.barChartData.data.map(function (d) { return d.year }));
    y.domain([0, d3.max(this.barChartData.data, function (d) { return d.count; })]);

    // This is the xaxis
    g.append("g")
      .attr("transform", "translate(0," + (this.barChartData.height - 20) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("x", "5")
      .attr("y", "15")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    //Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(10))

    // Label for y axis
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.barChartData.height / 2)
      .attr("y", -40)
      .attr("text-anchor", "end")
      .text("Count")

    g.selectAll(".bar")
      .data(this.barChartData.data)
      .enter().append("rect")
      .attr("fill", "blue")
      .attr("x", function (d) { return x(d.year); })
      .attr("y", function (d) { return y(d.count); })
      .attr("width", x.bandwidth() - 5)
      .attr("height", d => { return this.barChartData.height - y(d.count) })

    //   .on("mouseover", function (d) {


    //on hover
    // g.selectAll(".bar")
    //   .data(this.barChartData.data)
    //   .enter().append("rect")
    //   .attr("class", "bar")
    //   .attr("x", function (d) { return x(d.key); })
    //   .attr("y", function (d) { return y(d.value); })
    //   .attr("width", x.bandwidth() - 5)
    //   .attr("height", d => { return this.barChartData.height - y(d.value) })
    //   .on("mouseover", function (d) {

    //     // increase the width
    //     var xPos = +d3.select(this).attr("x");
    //     var yPos = +d3.select(this).attr("y");
    //     //console.log(yPos)
    //     var wid = +d3.select(this).attr("width");
    //     var hei = +d3.select(this).attr("height");
    //     d3.select(this).attr("x", xPos - 3).attr("width", wid + 6);
    //     d3.select(this).attr("height", hei + 5)
    //     d3.select(this).attr("y", yPos - 5)

    //     // Create tip with HTML
    //     return tip.html(function () {
    //       return "<span style='font-weight: bold !important'> <b>" + d.key + "</b></span> : <span style='color:black'>" + d.value + "</span>";   //tip.text(d.value)
    //     }).style("visibility", "visible")
    //       .style("top", (y(d.value) - 32) + 'px')
    //       .style("left", x(d.key) - 5 + 'px')
    //   })
    //   .on("mouseout", function () {
    //     // reset the width and postition
    //     var hei = +d3.select(this).attr("height");
    //     var yPos = +d3.select(this).attr("y");
    //     d3.select(this).attr("x", function (d) {
    //       return x(d.key)
    //     })
    //       .attr("width", x.bandwidth() - 5)
    //       .attr("height", hei - 5)
    //       .attr("y", yPos + 5);
    //     return tip.style("visibility", "hidden");
    //   });
  }
}

