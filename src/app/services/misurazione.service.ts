import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MisurazioneService {

  misurazioneUrl: string = 'http://' + this.global.backend_address + '/misurazioni';

  constructor(private http: HttpClient, public global: GlobalService) { }

  getDBMedium(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/averageDB');
  }

  getCarrierMedium(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/carriermedium');
  }

  getDayChanges(): Observable<any[]>{
    return this.http.get<any[]>(this.misurazioneUrl + '/daychanges');
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

}
