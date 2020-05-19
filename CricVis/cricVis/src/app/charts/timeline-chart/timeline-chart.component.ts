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
  cardTitle = 'Fantasy Score Timeline'

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
            bowlF: (inning.bowl_score) || (inning.bowl_score < 0) ? 0 : +inning.bowl_score,
          }
        )
      })


      this.lineChartData.data = []
      this.dataService.filteredPlayerScoreCard.forEach(inning => {
        let opp = this.dataService.mapping.get('teamId').get(inning.oppTeamId)
        this.lineChartData.data.push(
          {
            date: parseTime(inning.matchDate),
            batF: inning.bat_score < 0 ? 0 : +inning.bat_score,
            bowlF: inning.bowl_score < 0 ? 0 : +inning.bowl_score,
            batScore: inning.r_x ? inning.r_x + ' (' + inning.b + ') vs ' + opp : '',
            bowlScore: inning.w ? inning.w + 'wickets vs '+ opp : '',
            inId: inning.playerId.toString() + inning.matchId.toString()
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
        .html(function(d, score=null) { 
        return "<span style='background-color:steelblue;padding:5px;opacity:1; color:#fff'>"
        + d + " <span style='font-size:x-small;'>" +score + "</span></span>"
    });

    svg.call(tip);

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
        .on("mouseover", (d,i,n) => this.mouseOverBat(d,i,n, tip))
        .on("mouseout", (d,i,n) => this.mouseOut(d,i,n, tip));
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
        .on("mouseover", (d,i,n) => this.mouseOverBowl(d,i,n, tip))
        .on("mouseout", (d,i,n) => this.mouseOut(d,i,n, tip, "green"));
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

  mouseOverBat(d, i, n, tip) {
    d3.select(n[i]).style("fill", "pink").attr("r", 6).style("cursor","pointer")
    tip.show(d.batF,d.batScore, n[i]);
    this.dataService.timelineHoverSubject.next([d.inId, 1]);
  }

  mouseOverBowl(d, i, n, tip) {
    d3.select(n[i]).style("fill", "lightgreen").attr("r", 6).style("cursor","pointer")
    tip.show(d.bowlF,d.batScore, n[i]);
    this.dataService.timelineHoverSubject.next([d.inId, 1]);
  }

  mouseOut(d, i, n, tip, color='red') {
      d3.select(n[i]).style('fill', color).attr("r", 3)
      tip.hide(d);
      this.dataService.timelineHoverSubject.next([d.inId, 0]);
  }

}
