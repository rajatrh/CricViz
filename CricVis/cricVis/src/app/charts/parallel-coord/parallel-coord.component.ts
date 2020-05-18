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

  color = d3.scale.ordinal()
    .domain(["W", "L"])
    .range(["red", "green"])
  //d3.scale.category10()

  constructor(public dataService: CommonDataService) {
  }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
      this.myDiv.nativeElement.innerHTML = '';
      let data = []
      this.dataService.filteredPlayerScoreCard.forEach(inning => {

        let row = []
        data.push({
          'Runs': this.nullCheck(inning.r),
          'Balls Taken': inning.b,
          'Strike Rate': inning.sr,
          'Fours': inning.fours,
          'Sixes': inning.sixes,
          'Dismissal Mode': this.nullCheck(inning.dismissedMethod, 'dm'),
          'Result': inning.result
        })
      })

      d3.parcoords({ dimensionTitles: {} })(this.myDiv.nativeElement)
        .alpha(0.7).
        data(data).
        color((d) => {
          this.color(d.Result)
        }).
        render().createAxes().brushMode("1D-axes");
    })
  }

  nullCheck(val, col = 'none') {
    if (val == null) {
      if (col == 'dm') {
        return 'Not Out'
      }
    } else {
      return val
    }
  }
}
