import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { Recapito } from '../models/Recapito';

const headers = new HttpHeaders({'Content-Type' : 'application/json; charset=utf-8'});

@Injectable({
  providedIn: 'root'
})
export class RecapitoService {

  recapitoUrl: string = 'http://' + this.global.backend_address + '/recapito';

  constructor(private http: HttpClient, public global: GlobalService) { }

  getAll(): Observable<Recapito[]>{
    return this.http.get<Recapito[]>(this.recapitoUrl);
  }
}
