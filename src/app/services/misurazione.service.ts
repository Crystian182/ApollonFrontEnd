import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { Misurazione } from '../models/Misurazione';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});

@Injectable({
  providedIn: 'root'
})
export class MisurazioneService {

  misurazioneUrl: string = 'http://' + this.global.backend_address + '/misurazioni';

  constructor(private http: HttpClient, public global: GlobalService) { }

  d3test(): Observable<any>{
    return this.http.get<any>('https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01');
  }

  getEFMedium(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/efmedium');
  }

  getCarrierMedium(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/carriermedium');
  }

  getDayChanges(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/daychanges');
  }

  getAll(): Observable<Misurazione[]>{
    return this.http.get<Misurazione[]>(this.misurazioneUrl);
  }

  getAllTest(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl);
  }

  saveMisurazione(misurazione: Misurazione): Observable<Misurazione>{
    return this.http.post<Misurazione>(this.misurazioneUrl, misurazione, {headers});
  }

  updateMisurazione(misurazione: Misurazione): Observable<Misurazione>{
    return this.http.put<Misurazione>(this.misurazioneUrl, misurazione, {headers});
  }

  delete(idmisurazione: Number): Observable<Misurazione>{
    return this.http.delete<Misurazione>(this.misurazioneUrl + '/' + idmisurazione);
  }

}
