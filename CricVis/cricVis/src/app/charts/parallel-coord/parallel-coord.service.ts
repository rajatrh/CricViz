import { Injectable } from '@angular/core';
import { Player } from 'src/app/shared/model/player';
import { CommonDataService } from 'src/app/shared/common-data.service';
import { HttpClient } from '@angular/common/http';
import { UrlPickerService } from 'src/app/shared/url-picker.service';
import { PlayerScore } from 'src/app/shared/model/player-score';

@Injectable({
  providedIn: 'root'
})
export class ParallelCoordService {
  constructor() { }
}
