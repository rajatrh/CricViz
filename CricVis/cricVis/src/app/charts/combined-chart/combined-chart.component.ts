import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'app-combined-chart',
  templateUrl: './combined-chart.component.html',
  styleUrls: ['./combined-chart.component.scss']
})

export class CombinedChartComponent implements OnInit {
  @ViewChild('combinedChartDiv', { static: true }) myDiv: ElementRef;

  attributes = [{
    chartType: 'hist',
    viewValue: 'Strike Rate',
    value: 'sr',
    attrData: {
      data: [],
      numberOfBins: 12
    }
  },
  {
    chartType: 'hist',
    viewValue: 'Economy',
    value: 'e',
    attrData: {
      data: [],
      numberOfBins: 12
    }
  },
  {
    chartType: 'pie',
    viewValue: 'Dismissed Method',
    value: 'dismissedMethod',
    attrData: {
      data: [],
      lables: [],
      numberOfPies: 8
    }
  }]

  selectedAttribute = 'sr'

  barChartData = {
    width: window.innerWidth / 5.8,
    height: 215,
    margin: {
      left: 30,
      right: 10,
      bottom: 20,
      top: 10
    },
    data: []
  }
  svg: any;

  constructor(private dataService: CommonDataService) { }
  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      this.processData()
    })
  }

  processData() {
    let currentAttr = this.attributes.filter(x => x.value == this.selectedAttribute)[0]

    if (currentAttr.chartType == 'hist') {
      currentAttr.attrData.data = []

      this.dataService.filteredPlayerScoreCard.forEach(inn => {
        if (inn[currentAttr.value]) {
          currentAttr.attrData.data.push(+inn[currentAttr.value])
        }
      })

      this.barChart(currentAttr.attrData.data, currentAttr.attrData.numberOfBins)
    } else {
      currentAttr.attrData.data = []
      let labelMapping = new Map<any, any>()

      this.dataService.filteredPlayerScoreCard.forEach(inn => {
        let val = inn[currentAttr.value]
        if (val) {
          if (!labelMapping.has(val)) {
            labelMapping.set(val, 0)
          }
          labelMapping.set(val, labelMapping.get(val) + 1)
        }
      })

      labelMapping = new Map([...labelMapping.entries()].sort((a, b) => b[1] - a[1]));
      for (const [key, value] of labelMapping.entries()) {
        currentAttr.attrData.data.push({a: key, v: +value})
      }

      this.pieChart(currentAttr.attrData.data)

    }
  }

  barChart(values, numberOfBins) {
    if (values.length < 1) return;

    this.myDiv.nativeElement.innerHTML = '';
    var svg = d3.select(this.myDiv.nativeElement)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")

    let tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
        // return '<span></span>'; 
        return "<span style='background-color:steelblue;padding:5px;opacity:1; color:#fff'>count :" + d.length + "</span>"
      });

    svg.call(tip);

    var g = svg.append("g")
      .attr("transform", "translate(" + this.barChartData.margin.left + "," + this.barChartData.margin.top + ")");

    var x = d3.scaleLinear()
      .domain(d3.extent(values))
      .rangeRound([0, this.barChartData.width])

    var histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(d3.range(x.domain()[0], x.domain()[1], (x.domain()[1] - x.domain()[0]) / numberOfBins));

    var bins = histogram(values);

    var binWidth = Math.round((bins[0].x1 - bins[0].x0) * 100) / 100
    var y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => {
        return d.length;
      })])
      .rangeRound([this.barChartData.height, 0]);

    g.append("g")
      .attr("transform", "translate(0," + (this.barChartData.height) + ")")
      .call(d3.axisBottom(x).ticks(numberOfBins))
      .selectAll("text")
      .attr("x", "5")
      .attr("y", "15")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    //y-axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(10))

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.barChartData.height / 2)
      .attr("y", -30)
      .attr("text-anchor", "end")
      .text("Count")

    //Transform before
    var bar = g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
      .style("fill", "orange")
      .style("opacity", "1")
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })

    bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 2)
      .attr("height", d => {
        return this.barChartData.height - y(0);
      })
      .on("mouseover", function (d, i) {
        d3.select(this).style("opacity", "0.7").style("cursor","pointer")

        tip.show(d, this);
      }).on("mouseout", function (d) {
        d3.select(this).style("opacity", "1").style("fill", "orange")
        tip.hide(d);
      });

    svg.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("height", d => { return this.barChartData.height - y(d.length); })
      .delay(function (d, i) { return (i * 100) })

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 42)
      .attr("x", -10)
      .style("text-anchor", "end")
      .style("color", "black")
      .text("Count")
  }

  pieChart(values) {
    this.myDiv.nativeElement.innerHTML = '';

    var width = 250,
      height = 200,
      radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory10)

    var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var labelArc = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    var pie = d3.pie()
      .sort(null)
      .value(function (d) { return d.v; });

    var svg = d3.select(this.myDiv.nativeElement).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
        return "<span style='background-color:steelblue;padding:5px;opacity:1; color:#fff'>" + d.data.a+  " : " + d.value + "</span>"
      });

    svg.call(tip);

    var g = svg.selectAll(".arc")
      .data(pie(values))
      .enter().append("g")
      .attr("class", "arc")
      .on("mouseover", function (d, i) {
        d3.select(this).style("opacity", "0.7").style("cursor","pointer")

        tip.show(d, this);
      }).on("mouseout", function (d) {
        d3.select(this).style("opacity", "1")
        tip.hide(d);
      });

    g.append("path")
      .attr("d", arc)
      .style("fill", function (d) { return color(d.data.a); });

    g.append("text")
      .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("stroke","#fff")
      .text(function (d) { return d.data.v; });
  }

  eventSelection() {
    this.processData()
  }
}

