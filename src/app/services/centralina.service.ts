import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { Centralina } from '../models/Centralina';

const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});

@Injectable({
  providedIn: 'root'
})
export class CentralinaService {

  centralinaUrl: string = 'http://' + this.global.backend_address + '/centraline';

  constructor(private http: HttpClient, public global: GlobalService) { }

  getAll(): Observable<Centralina[]>{
    return this.http.get<Centralina[]>(this.centralinaUrl);
  }

  saveCentralina(centralina: Centralina): Observable<Centralina>{
    return this.http.post<Centralina>(this.centralinaUrl, centralina, {headers});
  }

  delete(idcentralina: Number): Observable<Centralina>{
    return this.http.delete<Centralina>(this.centralinaUrl + '/' + idcentralina);
  }

  update(centralina: Centralina): Observable<Centralina>{
    return this.http.put<Centralina>(this.centralinaUrl, centralina, {headers});
  }
}
