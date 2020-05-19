import { Injectable } from '@angular/core';
import { Team } from './model/team'
import { Venue } from './model/venue'
import { Player } from './model/player'
import { HttpClient } from '@angular/common/http';
import { UrlPickerService } from './url-picker.service';
import { Subject } from 'rxjs';
import { PlayerScore } from './model/player-score';
import { RadarData } from './model/radar-data';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  fetchPlayerSubject = new Subject<any>()
  refreshChartsSubject = new Subject<any[]>()
  applyFilter = new Subject<Boolean>()

  //Interaction Here
  timelineHoverSubject = new Subject<any>();
  pcModifyService = new Subject<any>();

  playerScoreCard: PlayerScore[];
  filteredPlayerScoreCard: PlayerScore[];

  teams: Team[] = []
  venues: Venue[] = []
  players: Player[] = []
  scatterData = {
    batsman: [],
    bowler: []
  };

  mapping = new Map<any, Map<any, any>>()

  dropdownPlayers: Player[] = []

  globalRadarData = new RadarData()

  constructor(private httpClient: HttpClient,
    private urlPickerService: UrlPickerService) {
    this.fetchPlayerSubject.subscribe((p) => {
      this.fetchPlayerData(p);
    })

    this.pcModifyService.subscribe(p => {
      this.filteredPlayerScoreCard = p;
      this.refreshChartsSubject.next([true, false, true, true, false])
    })
  }

  fetchData() {
    return this.httpClient.get<any>(this.urlPickerService.getURL('/setupData'))
  }

  fetchPlayerData(p) {
    this.httpClient.get<PlayerScore[]>(this.urlPickerService.getURL('/fetchPlayerScorecard') + '?id=' + p.id)
      .subscribe((res: PlayerScore[]) => {
        this.playerScoreCard = res;
        this.filteredPlayerScoreCard = res;
        this.globalRadarData.getValues(res);
        this.refreshChartsSubject.next([true, true, true, true, true])
        this.applyFilter.next(true)
      })
  }
}
