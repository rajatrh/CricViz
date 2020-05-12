import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { CommonDataService } from './common-data.service'
import { Team } from './model/team';
import { Player } from './model/player';
import { Venue } from './model/venue';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {

  constructor(private httpClient: HttpClient,
    private commonDataService: CommonDataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.fetchTeams();
    this.fetchPlayers();
    this.fetchVenues();
  }

  fetchTeams() {
    this.httpClient.get<Team[]>('http://0.0.0.0:8081/getTeams').subscribe((res: Team[]) => {
      this.commonDataService.teams = res
    })
  }

  fetchPlayers() {
    this.httpClient.get<Player[]>('http://0.0.0.0:8081/getPlayers').subscribe((res: Player[]) => {
      this.commonDataService.players = res
    })
  }

  fetchVenues() {
    this.httpClient.get<Venue[]>('http://0.0.0.0:8081/getVenues').subscribe((res: Venue[]) => {
      this.commonDataService.venues = res
    })
  }
}
