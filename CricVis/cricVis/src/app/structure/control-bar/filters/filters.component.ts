import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  filters = [
    {
      name: 'Match Type', value: 'matchType',
      options: ['A', 'B'], selectedOptions: [],
      fc : new FormControl(), width: '90px'
    },
    {
      name: 'Played For', value: 'teamId',
      options: ['X', 'Y'], selectedOptions: [],
      fc : new FormControl(), width: '120px'
    },
    {
      name: 'Venues', value: 'venueid',
      options: ['Z', 'K'], selectedOptions: [],
      fc : new FormControl(), width: '120px'
    }
  ]
  
  constructor() {
  }

  ngOnInit() {
  }

}
