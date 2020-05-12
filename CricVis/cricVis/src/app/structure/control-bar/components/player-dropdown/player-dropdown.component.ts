import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-player-dropdown',
  templateUrl: './player-dropdown.component.html',
  styleUrls: ['./player-dropdown.component.scss']
})
export class PlayerDropdownComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  constructor() { }

  ngOnInit() {
  }

}
