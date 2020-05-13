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
  fetchPlayerSubject = new Subject<Player>()
  refreshChartsSubject = new Subject<PlayerScore[]>()
  playerScoreCard: PlayerScore[];
  teams: Team[] = []
  venues: Venue[] = []
  players: Player[] = []
  dropdownPlayers: Player[] = []

  constructor(private httpClient: HttpClient,
    private urlPickerService: UrlPickerService) {
    this.fetchPlayerSubject.subscribe((p: Player) => {
      this.fetchPlayerData(p);
    })
  }

  fetchData() {
    return this.httpClient.get<Player[]>(this.urlPickerService.getURL('/setupData'))
  }

  fetchPlayerData(p: Player) {
    this.httpClient.get<PlayerScore[]>(this.urlPickerService.getURL('/fetchPlayerScorecard') + '?id=' + p.id).subscribe(res => {
      this.playerScoreCard = res;
      this.refreshChartsSubject.next(res)
    })
  }
}
