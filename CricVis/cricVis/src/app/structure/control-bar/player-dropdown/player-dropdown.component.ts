import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonDataService } from 'src/app/shared/common-data.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Player } from 'src/app/shared/model/player';

@Component({
  selector: 'app-player-dropdown',
  templateUrl: './player-dropdown.component.html',
  styleUrls: ['./player-dropdown.component.scss']
})
export class PlayerDropdownComponent implements OnInit {
  options: Player[]

  playerCtrl = new FormControl();
  filteredPlayers: Observable<Player[]>;

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    this.options = this.dataService.dropdownPlayers
    this.filteredPlayers = this.playerCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterPlayers(state) : this.options.slice())
      );

    this.playerCtrl.patchValue("MS Dhoni")
    this.newPlayer({ id: 1, fullName: "MS Dhoni",
    shortName: "MS Dhoni",
    nationality: "India",
    dateOfBirth: "1981-07-07" })
  }

  private _filterPlayers(value: string): Player[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(player => player.fullName.toLowerCase().indexOf(filterValue) === 0);
  }

  newPlayer(p) {
    this.dataService.fetchPlayerSubject.next(p)
  }



}
