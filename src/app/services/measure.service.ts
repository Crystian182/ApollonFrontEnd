import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  measuresUrl: string = 'http://' + this.global.backend_address + '/measures';

  constructor(private http: HttpClient, public global: GlobalService) { }

 /* getById(id: number): Observable<Measure>{
    return this.http.get<Measure>(this.measuresUrl + '/' + id);
  }

  getAll(): Observable<Measure[]>{
    return this.http.get<Measure[]>(this.measuresUrl);
  }

  saveMeasure(measure: Measure): Observable<Measure>{
    return this.http.post<Measure>(this.measuresUrl, measure, {headers});
  }*/
}
