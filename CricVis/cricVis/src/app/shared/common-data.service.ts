import { Injectable } from '@angular/core';
import { Team } from './model/team'
import { Venue } from './model/venue'
import { Player } from './model/player'

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  teams: Team[] = []
  venues: Venue[] = []
  players: Player[] = []
  
  constructor() { }
}
