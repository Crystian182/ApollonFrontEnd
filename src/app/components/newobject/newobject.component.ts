import { Component, OnInit, Input } from '@angular/core';
import { Recapito } from '../../models/Recapito';
import { RecapitoService } from '../../services/recapito.service';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/Persona';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newobject',
  templateUrl: './newobject.component.html',
  styleUrls: ['./newobject.component.css']
})
export class NewobjectComponent implements OnInit {
  @Input() type: String;
  @Input() editpersona: Persona;

  rows : Number[] = [] ;
  recapiti: Recapito[] = [];
  persona: Persona;
  recapitiPersona: Recapito[] = [];

  constructor(public personaService: PersonaService,
              public recapitoService: RecapitoService,
              public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if(this.editpersona != undefined) {
      this.recapitoService.getByIdPersona(this.editpersona.idpersona).subscribe(recs => {
        this.recapitiPersona = recs;
      })
    } else {
      this.rows.length = 1;
    }
  }

  addrow(){
    this.rows.push(this.rows.length+1);
    this.recapitiPersona.length++
  }

  savePersona(name, surname, dob) {
    if(!(name == '' || surname == '' || dob == '')) {
      this.persona = {nome: name, cognome: surname, data_nascita: dob, recapiti: this.recapiti} as Persona
      this.personaService.save(this.persona).subscribe(res => {
        this.activeModal.close(res[0]);
      })
      }
    }

  updateRecapiti(phone, i) {
    this.recapiti[i] = ({numero: phone} as Recapito)
  }

  deleteRecapito(recapito, i) {
    this.recapitiPersona.splice(i, 1)
  }

  updateRecapitiPersona(phone, i) {
    this.recapitiPersona[i] = ({numero: phone} as Recapito)
  }

  closeModal(){
    this.activeModal.close();
  }

  saveEditPersona(name, surname, dob){
    if(!(name == '' || surname == '' || dob == '')) {
      this.persona = {idpersona: this.editpersona.idpersona, nome: name, cognome: surname, data_nascita: dob, recapiti: this.recapitiPersona} as Persona
      this.personaService.update(this.persona).subscribe(res => {
        this.activeModal.close(res[0]);
      })
    }
  }
}
