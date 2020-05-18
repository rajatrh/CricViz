import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonDataService } from 'src/app/shared/common-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  title = 'cricVis';
  isFilterEnabled = false;
  data;
  constructor(private route: ActivatedRoute,
    private dataService: CommonDataService) { }
  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.processData()

    this.dataService.fetchPlayerSubject.subscribe(s => {
      this.isFilterEnabled = true;
    })
  }

  processData() {
    this.dataService.dropdownPlayers = this.data['batsmen']
    this.dataService.teams = this.data['teams']
    this.dataService.venues = this.data['venues']
    this.dataService.players = this.data['players']

    // Load name id mapping
    let localMap = new Map<any, any>()
    this.dataService.teams.forEach(t => {
      localMap.set(t.id, t.abbreviation)
    })
    this.dataService.mapping.set('teamId', localMap)

    let localMap1 = new Map<any, any>()
    this.dataService.venues.forEach(v => {
      localMap1.set(v.id, v.fullName + ' | ' + v.country)
    })
    this.dataService.mapping.set('venueId', localMap1)

    let localMap2 = new Map<any, any>()
    this.dataService.players.forEach(p => {
      localMap2.set(p.id, p.fullName)
    })
    this.dataService.mapping.set('playerId', localMap2)
  }

}
