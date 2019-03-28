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

  getAll(): Observable<Misurazione[]>{
    return this.http.get<Misurazione[]>(this.misurazioneUrl);
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
