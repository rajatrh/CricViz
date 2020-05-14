import { Injectable } from '@angular/core';
import { Team } from './model/team'
import { Venue } from './model/venue'
import { Player } from './model/player'
import { HttpClient } from '@angular/common/http';
import { UrlPickerService } from './url-picker.service';
import { Subject } from 'rxjs';
import { PlayerScore } from './model/player-score';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  fetchPlayerSubject = new Subject<any>()
  refreshChartsSubject = new Subject<Boolean>()
  applyFilter = new Subject<Boolean>()

  playerScoreCard: PlayerScore[];
  filteredPlayerScoreCard: PlayerScore[];
  teams: Team[] = []
  venues: Venue[] = []
  players: Player[] = []

  mapping = new Map<any,Map<any, any>>()

  dropdownPlayers: Player[] = []

  constructor(private httpClient: HttpClient,
    private urlPickerService: UrlPickerService) {
    this.fetchPlayerSubject.subscribe((p) => {
      this.fetchPlayerData(p);
    })
  }

  fetchData() {
    return this.httpClient.get<any>(this.urlPickerService.getURL('/setupData'))
  }

  fetchPlayerData(p) {
    this.httpClient.get<PlayerScore[]>(this.urlPickerService.getURL('/fetchPlayerScorecard') + '?id=' + p.id).subscribe(res => {
      this.playerScoreCard = res;
      this.filteredPlayerScoreCard = res;
      this.refreshChartsSubject.next(true)
      this.applyFilter.next(true)
    })
  }
}
