import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona.service';
import { RecapitoService } from '../../services/recapito.service';
import { Persona } from '../../models/Persona';
import { Recapito } from '../../models/Recapito';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  persone: Persona[] = [];
  recapiti: Recapito[] = [];

  constructor(public personaService: PersonaService, public recapitoService: RecapitoService) { }

  ngOnInit() {
    this.personaService.getAll().subscribe(persone => {
      this.persone = persone
    })

    this.recapitoService.getAll().subscribe(recapiti => {
      this.recapiti = recapiti
    })
  }

}
