import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';
import { Subscription } from 'rxjs/internal/Subscription';

declare var d3: any;

@Component({
  selector: 'app-parallel-coord',
  templateUrl: './parallel-coord.component.html',
  styleUrls: ['./parallel-coord.component.scss']
})
export class ParallelCoordComponent implements OnInit, OnDestroy {
  @ViewChild('myDiv', { static: true }) myDiv: ElementRef;
  heightpc = '34vh'
  data = []

  svg;
  foreground;
  background;
  highlighted;

  timelineHover = new Subscription()
  constructor(public dataService: CommonDataService) {
  }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      if (s[1]) {
        this.heightpc = '34vh'
        this.data = []
        this.myDiv.nativeElement.innerHTML = '';

        if (this.dataService.filteredPlayerScoreCard.length > 1) {
          this.dataService.filteredPlayerScoreCard.forEach(inning => {
            this.data.push({
              'Runs': this.nullCheck(inning.r_x),
              'Balls Taken': this.nullCheck(inning.b),
              'Strike Rate': this.nullCheck(inning.sr),
              'Fours': this.nullCheck(inning.fours),
              'Sixes': this.nullCheck(inning.sixes),
              'Overs Bowled': this.nullCheck(inning.ov),
              'Economy Rate': this.nullCheck(inning.e),
              'Wickets Taken': this.nullCheck(inning.w),
              'result': this.nullCheck(inning.result),
              'id': this.nullCheck(inning.playerId).toString() + this.nullCheck(inning.matchId).toString(),
              'playerid': this.nullCheck(inning.playerId),
              'matchid': this.nullCheck(inning.matchId)
            })
          })
          this.pc()
        } else {
          this.heightpc = '0vh'
        }
      }
    })

    this.timelineHover = this.dataService.timelineHoverSubject.subscribe(ev => {
      this.highlighted
        .filter(function (d) { return d.id == ev[0]; })
        .style("opacity", ev[1])

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
      axis = d3.axisLeft()

    var dimensions = null;

    this.svg = d3.select(this.myDiv.nativeElement);

    const svg_adjusted = this.svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var out = d3.select(output)  
    // out.text(d3.tsvFormat(sample_data.slice(0,24)));

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(this.data[0]).filter(d => {
      return ((d != "name") && (d != "result") && (d != 'id')) && (d != 'matchid')
        && (d != 'playerid') && (y[d] = d3.scaleLinear()
          .domain(d3.extent(this.data, p => { return +p[d]; }))
          .range([height, 0]));
    }));

    // Add grey background lines for context.
    this.background = svg_adjusted.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(this.data)
      .enter().append("path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    this.foreground = svg_adjusted.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(this.data)
      .enter().append("path")
      .attr("d", path)

      .style("stroke", d => {
        return resultColorScale(d['result'])
      })
      .style("opacity", 0.6)

    this.highlighted = svg_adjusted.append("g")
      .attr("class", "foreground")
      .style("stroke-width", "5")
      .selectAll("path")
      .data(this.data)
      .enter().append("path")
      .attr("d", path)
      .style("stroke", "steelblue")
      .style("opacity", 0)

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
      .each((d, i, n) => {
        d3.select(n[i]).call(y[d].brush = d3.brushY()
          .extent([[-10, 0], [10, height]])
          .on("brush", (d, i, n) => this.brushPC(d, i, n, y))
          .on("end", (d, i, n) => this.brushPC(d, i, n, y, 'end'))
        )
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

    function path(d) {
      return line(dimensions.map(p => { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    // function brush() {
    //   var actives = [];
    //   svg.selectAll(".brush")
    //     .filter(function (d) {
    //       y[d].brushSelectionValue = d3.brushSelection(this);
    //       return d3.brushSelection(this);
    //     })
    //     .each(function (d) {
    //       // Get extents of brush along each active selection axis (the Y axes)
    //       actives.push({
    //         dimension: d,
    //         extent: d3.brushSelection(this).map(y[d].invert)
    //       });
    //     });

    //   var selected = [];
    //   // Update foreground to only display selected values
    //   foreground.style("display", function (d) {
    //     let isActive = actives.every(function (active) {
    //       let result = active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
    //       return result;
    //     });
    //     // Only render rows that are active across all selectors
    //     if (isActive) selected.push(d);
    //     return (isActive) ? null : "none";
    //   });
    // }
  }

  brushPC(d, n, i, y, even = 'start') {

    var actives = [];
    this.svg.selectAll(".brush")
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
    this.foreground.style("display", function (d) {
      let isActive = actives.every(function (active) {
        let result = active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
        return result;
      });
      // Only render rows that are active across all selectors
      if (isActive) selected.push(d);
      return (isActive) ? null : "none";
    });

    if (even == 'end') {
      let lol = []
      selected.forEach(d => {
        lol.push(this.dataService.playerScoreCard.filter(x => (x.matchId == d.matchid) && (x.playerId == d.playerid))[0])
      })

      this.dataService.pcModifyService.next(lol)
    }

  }

  ngOnDestroy() {
    this.timelineHover.unsubscribe()
  }
}
