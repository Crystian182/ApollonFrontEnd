import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

public backend_address = "localhost:8000";
 //public address = "localhost";
  constructor() { }
}
