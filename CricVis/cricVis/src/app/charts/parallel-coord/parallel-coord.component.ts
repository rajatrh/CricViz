import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'app-parallel-coord',
  templateUrl: './parallel-coord.component.html',
  styleUrls: ['./parallel-coord.component.scss']
})
export class ParallelCoordComponent implements OnInit {
  @ViewChild('myDiv', { static: true }) myDiv: ElementRef;
  heightpc = '34vh'
  data = []
  constructor(public dataService: CommonDataService) {
  }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      this.heightpc = '34vh'
      this.data = []
      this.myDiv.nativeElement.innerHTML = '';

      if (this.dataService.filteredPlayerScoreCard.length > 1) {
        this.dataService.filteredPlayerScoreCard.forEach(inning => {
          // if (inning.r_x != null) {
            this.data.push({
              'Runs': this.nullCheck(inning.r_x),
              'Balls Taken': this.nullCheck(inning.b),
              'Strike Rate': this.nullCheck(inning.sr),
              'Fours': this.nullCheck(inning.fours),
              'Sixes': this.nullCheck(inning.sixes),
              // 'Dismissal Mode': this.nullCheck(inning.dismissedMethod, 'dm'),
              
            // })
          // } if (inning.ov != null) {
            // this.data.push({
              'Overs Bowled': this.nullCheck(inning.ov),
              'Economy Rate': this.nullCheck(inning.e),
              'Wickets Taken': this.nullCheck(inning.w),
              'result': this.nullCheck(inning.result)
            })
          // }
        })
        this.pc()
      } else {
        this.heightpc = '0vh'
      }
    })
  }

  nullCheck(val) {
    if (val == null) {
      return ''
    } else {
      return val
    }
  }

  pc() {
    var resultColorScale = d3.scaleOrdinal()
      .domain(["W", "L", "N", "D"])
      .range(["lightgreen", "red", "black", "black"]);

    var margin = { top: 30, right: 10, bottom: 10, left: 10 };
    var width = (window.innerWidth * 0.6) - margin.left - margin.right;
    var height = 260 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width]).padding(1),
      y = {};

    var line = d3.line(),
      axis = d3.axisLeft(),
      background,
      foreground;

    var dimensions = null;

    const svg = d3.select(this.myDiv.nativeElement);

    const svg_adjusted = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var out = d3.select(output)  
    // out.text(d3.tsvFormat(sample_data.slice(0,24)));

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(this.data[0]).filter(d => {
      return ((d != "name") && (d != "result")) && (y[d] = d3.scaleLinear()
        .domain(d3.extent(this.data, p => { return +p[d]; }))
        .range([height, 0]));
    }));

    // Add grey background lines for context.
    background = svg_adjusted.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(this.data)
      .enter().append("path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg_adjusted.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(this.data)
      .enter().append("path")
      .attr("d", path)
      .style("stroke", d => {
        return resultColorScale(d['result'])
      })
      .style("opacity", 0.6)

    // Add a group element for each dimension.
    const g = svg_adjusted.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", d => { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
      .attr("class", "axis")
      .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(d => { return d; });

    // Add and store a brush for each axis.
    g.append("g")
      .attr("class", "brush")
      .each(function (d) {
        d3.select(this).call(y[d].brush = d3.brushY()
          .extent([[-10, 0], [10, height]])
          .on("brush", brush)
          .on("end", brush)
        )
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

    function path(d) {
      return line(dimensions.map(p => { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = [];
      svg.selectAll(".brush")
        .filter(function (d) {
          y[d].brushSelectionValue = d3.brushSelection(this);
          return d3.brushSelection(this);
        })
        .each(function (d) {
          // Get extents of brush along each active selection axis (the Y axes)
          actives.push({
            dimension: d,
            extent: d3.brushSelection(this).map(y[d].invert)
          });
        });

      var selected = [];
      // Update foreground to only display selected values
      foreground.style("display", function (d) {
        let isActive = actives.every(function (active) {
          let result = active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
          return result;
        });
        // Only render rows that are active across all selectors
        if (isActive) selected.push(d);
        return (isActive) ? null : "none";
      });
    }
  }
}
