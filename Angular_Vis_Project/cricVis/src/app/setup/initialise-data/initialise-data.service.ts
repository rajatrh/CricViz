import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitialiseDataService {
  private url = 'http://0.0.0.0:8081/';

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  testUrl(): Observable<[]> {
    return this.http.get<[]>(this.url)
  }
}
