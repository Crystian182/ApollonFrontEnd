import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { Persona } from '../models/Persona';

const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personaUrl: string = 'http://' + this.global.backend_address + '/persona';

  constructor(private http: HttpClient, public global: GlobalService) { }

  getAll(): Observable<Persona[]>{
    return this.http.get<Persona[]>(this.personaUrl);
  }

  delete(idpersona: number): Observable<Persona>{
    return this.http.delete<Persona>(this.personaUrl + '/' + idpersona);
  }
}
