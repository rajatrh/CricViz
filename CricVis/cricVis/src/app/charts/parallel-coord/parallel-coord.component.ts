import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

import { PlayerScore } from 'src/app/shared/model/player-score';

@Component({
  selector: 'app-parallel-coord',
  templateUrl: './parallel-coord.component.html',
  styleUrls: ['./parallel-coord.component.scss']
})
export class ParallelCoordComponent implements OnInit {
  @ViewChild('myDiv', { static: true }) myDiv: ElementRef;

 

  color = function(d) { return d3.scale.linear()
    .domain([0, 150])
    .range(["#7AC143", "#00B0DD"])
    .interpolate(d3.interpolateLab)(d[0]) };

  constructor(private dataService: CommonDataService, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe((s: PlayerScore[]) => {
      this.myDiv.nativeElement.innerHTML = '';
      let data = []
      s.forEach(inning => {
        let row = []
        row.push(inning.r)
        row.push(inning.b)
        row.push(inning.fowW)
        row.push(inning.fowR)
        row.push(inning.over) 
        data.push(row)
      })

      console.log(data)

      d3.parcoords()(this.myDiv.nativeElement)
      .alpha(0.4).color(this.color)
      .data(data).render().createAxes().brushMode("1D-axes");
    })
  }

  ngAfterViewInit() {
    console.log(this.myDiv)
  }

}
