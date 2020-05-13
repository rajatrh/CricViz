import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';
import { Player } from 'src/app/shared/model/player';
import { ParallelCoordService } from './parallel-coord.service';

@Component({
  selector: 'app-parallel-coord',
  templateUrl: './parallel-coord.component.html',
  styleUrls: ['./parallel-coord.component.scss']
})
export class ParallelCoordComponent implements OnInit {

  constructor(private dataService: CommonDataService) {
  }

  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
    })
  }

}
