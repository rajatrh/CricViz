import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @ViewChild('pieChartDiv', { static: true }) myDiv: ElementRef;

  cardTitle = 'Fantasy Score Breakdown'

  pieChartData = {
    width: 300,
    height: 250,
    radius: 100,
    aColor: [
      'rgb(178, 55, 56)',
      'rgb(213, 69, 70)',
      'rgb(230, 125, 126)',
      'rgb(239, 183, 182)'
    ],
    data: [
      { "label": "Colorectale levermetastase (n=336)", "value": 74 },
      { "label": "Primaire maligne levertumor (n=56)", "value": 12 },
      { "label": "Levensmetatase van andere origine (n=32)", "value": 7 },
      { "label": "Beningne levertumor (n=34)", "value": 7 }
    ]
  }
  svg: any;

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      this.myDiv.nativeElement.innerHTML = '';
      this.createPieChart()
    })
  }

  createPieChart() {

    this.svg = d3.select(this.myDiv.nativeElement)
      .append("svg:svg").data([this.pieChartData.data])
      .attr("width", this.pieChartData.width)
      .attr("height", this.pieChartData.height)
      .append("svg:g")
      .attr("transform", "translate(" + (this.pieChartData.width / 2) + "," + (this.pieChartData.height / 2) + ")");

    var pie = d3.layout.pie()
      .value(d => { return d.value; });
    var arc = d3.svg.arc()
      .outerRadius(this.pieChartData.radius);

    var arcs = this.svg.selectAll("g.slice")
      .data(pie).enter()
      .append("svg:g")
      .attr("class", "slice");

    var paths = arcs.append("svg:path")
      .attr("fill", (d, i) => {
        return this.pieChartData.aColor[i];
      })
      .attr("d", d => { return arc(d); })
      ;

    var tooltip = d3.select(this.myDiv.nativeElement)
      .append('div')
      .attr('class', 'tooltip');

    paths.on('mouseover', function (d) {
      tooltip.html(d.value);
      tooltip.style('display', 'block');
      tooltip.style('cursor', 'pointer')
      tooltip.style('opacity', 2);
      console.log('On the pie chart')
    }).on('mousemove', function (d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    }).on('mouseout', function () {
      tooltip.style('display', 'none');
      tooltip.style('opacity', 0);
    })



    arcs.append("svg:text")
      .attr("transform", d => {
        d.innerRadius = this.pieChartData.radius / 2; /* Distance of label to the center*/
        d.outerRadius = this.pieChartData.radius;
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "smaller")
      .text((d, i) => {
        if (this.pieChartData.data[i].value > 30) {
          return this.pieChartData.data[i].value + '%';
        }
      });

  }

}
