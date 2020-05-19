import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss']
})
export class TimelineChartComponent implements OnInit {
  @ViewChild('timelineChartDiv', { static: true }) myDiv: ElementRef;
  cardTitle = 'Innings Timeline'

  checkbox = {
    batFS: true,
    bowlFS: true
  }

  lineChartData = {
    width: window.innerWidth / 2.7,
    height: 200,
    parsedmasterData: [],
    data: [],
    margin: { top: 20, right: 10, bottom: 30, left: 50 }
  }
  svg: any;

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    var parseTime = d3.timeParse("%Y-%m-%d");
    this.dataService.refreshChartsSubject.subscribe(s => {

      this.lineChartData.parsedmasterData = []
      this.dataService.playerScoreCard.forEach(inning => {
        this.lineChartData.parsedmasterData.push(
          {
            date: parseTime(inning.matchDate),
            batF: (inning.bat_score) || (inning.bat_score < 0) ? 0 : +inning.bat_score,
            bowlF: (inning.bowl_score) || (inning.bowl_score < 0) ? 0 : +inning.bowl_score
          }
        )
      })


      this.lineChartData.data = []
      this.dataService.filteredPlayerScoreCard.forEach(inning => {
        this.lineChartData.data.push(
          {
            date: parseTime(inning.matchDate),
            batF: inning.bat_score < 0 ? 0 : +inning.bat_score,
            bowlF: inning.bowl_score < 0 ? 0 : +inning.bowl_score
          }
        )
      })
      this.createLineChart()
    })
  }

  createLineChart(parseData = true) {
    this.myDiv.nativeElement.innerHTML = '';
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, this.lineChartData.width]);
    var y = d3.scaleLinear().range([this.lineChartData.height, 0]);

    var svg = d3.select(this.myDiv.nativeElement)
      .append("svg:svg")
      .attr("width", this.lineChartData.width +
        this.lineChartData.margin.left +
        this.lineChartData.margin.right)
      .attr("height", this.lineChartData.height +
        this.lineChartData.margin.top +
        this.lineChartData.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.lineChartData.margin.left + ","
        + this.lineChartData.margin.top + ")");
    
    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10,0])
        .html(function(d) { 
        console.log('Tip', d);
        // return '<span></span>'; 
        return "<strong>Score:</strong> <span style='color:#0'>" + d + "</span>";
    });

    svg.call(tip);

    // if (parseData) {
    //   this.lineChartData.data.forEach(function (d) {
    //     d.date = parseTime(d.date);
    //     d.batF = +d.batF;
    //     d.bowlF = +d.bowlF;
    //   });
    // }

    // Scale the range of the data
    x.domain(d3.extent(this.lineChartData.data, function (d) { return d.date; }));
    y.domain([0, d3.max(this.lineChartData.data, function (d) {
      return Math.max(d.batF, d.bowlF);
    })]);

    svg.append("g")
      .attr("transform", "translate(0," + this.lineChartData.height + ")")
      .call(d3.axisBottom(x).ticks(8));

    svg.selectAll(".dot")
      .data(this.lineChartData.parsedmasterData)
      .enter().append("circle") // Uses the enter().append() method
      .attr("fill", "#D3D3D3") // Assign a class for styling
      .attr("cx", function (d, i) { return x(d.date) })
      .attr("cy", function (d) { return y(d.batF) })
      .attr("r", 3);

    if (this.checkbox.batFS) {
      svg.selectAll(".dot")
        .data(this.lineChartData.data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("fill", "red") // Assign a class for styling
        .attr("class", "batClass")
        .attr("cx", function (d, i) { return x(d.date) })
        .attr("cy", function (d) { return y(0) })
        .attr("r", 3)
        .on("mouseover", function(d, i) {
          d3.select(this).style("fill", "#000000")
          console.log("mouse over value:")
          //console.log(d);
          tip.show(d.batF, this);
        }).on("mouseout", function(d) {
            d3.select(this).style('fill', "red")
            tip.hide(d);
        });
    }

    if (this.checkbox.bowlFS) {
      svg.selectAll(".dot")
        .data(this.lineChartData.data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("fill", "green") // Assign a class for styling
        .attr("class", "bowlClass")
        .attr("cx", function (d, i) { return x(d.date) })
        .attr("cy", function (d) { return y(0) })
        .attr("r", 3)
        .on("mouseover", function(d, i) {
          d3.select(this).style("fill", "#000000")
          //console.log("mouse over value:")
          console.log(d);
          tip.show(d.bowlF, this);
        }).on("mouseout", function(d) {
            d3.select(this).style('fill', "green")
            tip.hide(d);
        });
    }

    svg.selectAll("circle").filter(".batClass")
      .transition()
      .delay(function (d, i) { return (i * 3) })
      .duration(1200)
      .attr("cx", function (d) { return x(d.date); })
      .attr("cy", function (d) { return y(d.batF); })
      

    svg.selectAll("circle").filter(".bowlClass")
      .transition()
      .delay(function (d, i) { return (i * 3) })
      .duration(1200)
      .attr("cx", function (d) { return x(d.date); })
      .attr("cy", function (d) { return y(d.bowlF); })


    svg.append("g")
      .call(d3.axisLeft(y))

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("color", "black")
      .text("Fantasy Score")
  }

}
