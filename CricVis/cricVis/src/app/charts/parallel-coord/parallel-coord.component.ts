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

  color = d3.scale.category10()
  // function(d) { return d3.scale.linear()
  //   .domain([0, 150])
  //   .range(["red", "green"])
  //   .interpolate(d3.interpolateLab)(d[0]) };

  constructor(public dataService: CommonDataService) {
  }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      this.myDiv.nativeElement.innerHTML = '';
      let data = []
      this.dataService.filteredPlayerScoreCard.forEach(inning => {
        
        let row = []
        row.push(this.nullCheck(inning.r))
        row.push(inning.b)
        row.push(inning.sr)
        row.push(inning.fours)
        row.push(inning.sixes)
        data.push(row)
      })

      d3.parcoords()(this.myDiv.nativeElement)
      .alpha(0.7).color(this.color)
      .data(data).render().createAxes().brushMode("1D-axes");
    })
  }

  nullCheck(val) {
    if (val == null) {
      console.log(val)
      return ''
    } else {
      return val
    }
  }
}
