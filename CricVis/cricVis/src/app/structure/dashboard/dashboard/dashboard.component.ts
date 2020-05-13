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
  data;
  constructor(private route: ActivatedRoute,
    private dataService: CommonDataService) { }
  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.processData()
  }

  processData() {
    this.dataService.dropdownPlayers = this.data['batsmen']
    this.dataService.teams = this.data['teams']
    this.dataService.venues = this.data['venues']
    this.dataService.players = this.data['players']
  }
}
