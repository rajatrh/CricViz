import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonDataService } from 'src/app/shared/common-data.service';

declare var d3: any;

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {
  @ViewChild('myDiv1', { static: true }) myDiv: ElementRef;
  


  constructor(private dataService: CommonDataService) { }
  ngOnInit() {
    this.dataService.refreshChartsSubject.subscribe(s => {
    })
  }
}
