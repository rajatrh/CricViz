import { Component, OnInit } from '@angular/core';
import { InitialiseDataService } from './initialise-data.service'

@Component({
  selector: 'app-initialise-data',
  templateUrl: './initialise-data.component.html',
  styleUrls: ['./initialise-data.component.scss']
})
export class InitialiseDataComponent implements OnInit {

  constructor(private initialiseDataService: InitialiseDataService) { }

  ngOnInit() {
    this.initialiseDataService.testUrl().subscribe(res => {
      console.log(res)
    })
  }

}
