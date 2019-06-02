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

  getMedia(precision: Number, lat1: Number, lat2: Number,long1: Number,long2: Number): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/media/zoom=' + precision + '&lat1=' + lat1 +
                                '&lat2=' + lat2 + '&long1=' + long1 + '&long2=' + long2);
  }

  getMediaAnno(precision: Number, lat1: Number, lat2: Number,long1: Number,long2: Number, start: String, end: String): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/media/anno/from=' + start + '&to=' + end + '&zoom=' + precision + '&lat1=' + lat1 +
                                '&lat2=' + lat2 + '&long1=' + long1 + '&long2=' + long2);
  }

  getMediaGiorno(precision: Number, lat1: Number, lat2: Number,long1: Number,long2: Number, start: String, end: String): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/media/giorno/from=' + start + '&to=' + end + '&zoom=' + precision + '&lat1=' + lat1 +
                                '&lat2=' + lat2 + '&long1=' + long1 + '&long2=' + long2);
  }

  getMediaOra(precision: Number, lat1: Number, lat2: Number,long1: Number,long2: Number, start: String, end: String): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/media/ora/from=' + start + '&to=' + end + '&zoom=' + precision + '&lat1=' + lat1 +
                                '&lat2=' + lat2 + '&long1=' + long1 + '&long2=' + long2);
  }

  getMediaMese(precision: Number, lat1: Number, lat2: Number,long1: Number,long2: Number, start: String, end: String): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/media/mese/from=' + start + '&to=' + end + '&zoom=' + precision + '&lat1=' + lat1 +
                                '&lat2=' + lat2 + '&long1=' + long1 + '&long2=' + long2);
  }

  getYears(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/getyears');
  }

  getMonthOfYears(year: String): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/getmonthofyear/' + year);
  }

  getDayOfMonth(year: String, month: String): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/getdayofmonth/year=' + year + '&month=' + month);
  }

  getHourOfDay(year: String, month: Number, day: Number): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/gethourofday/year=' + year + '&month=' + month + '&day=' + day);
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
