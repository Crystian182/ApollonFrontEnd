import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona.service';
import { RecapitoService } from '../../services/recapito.service';
import { Persona } from '../../models/Persona';
import { Recapito } from '../../models/Recapito';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CentralinaService } from '../../services/centralina.service';
import { Centralina } from '../../models/Centralina';
import { Misurazione } from '../../models/Misurazione';
import { MisurazioneService } from '../../services/misurazione.service';
import { ModalComponent } from '../modal/modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  relational: boolean = true;

  persone: Persona[] = [];
  recapiti: Recapito[] = [];
  centraline: Centralina[] = [];
  misurazioni: Misurazione[] = [];
  
  selectedPersona: Persona;
  selectedRecapito: Recapito;
  selectedCentralina: Centralina;
  selectedMisurazione: Misurazione;

  constructor(private titleService: Title,
              public personaService: PersonaService,
              public recapitoService: RecapitoService,
              public centralinaService: CentralinaService,
              public misurazioneService: MisurazioneService,
              public modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle('Pagina di CRUD - MySql');
    this.updateData();
  }

  updateData() {
    this.personaService.getAll().subscribe(persone => {
      this.persone = persone
    })

    this.recapitoService.getAll().subscribe(recapiti => {
      this.recapiti = recapiti
    })

    this.centralinaService.getAll().subscribe(centraline => {
      this.centraline = centraline
    })

    this.misurazioneService.getAll().subscribe(misurazioni => {
      this.misurazioni = misurazioni
    })
  }

  switchDB() {
    if(this.relational) {
      this.relational = false;
      this.titleService.setTitle('Pagina di CRUD - MongoDB');
    } else {
      this.relational = true;
      this.titleService.setTitle('Pagina di CRUD - MySql');
    }
  }

  setPersona(p) {
    this.selectedMisurazione = undefined;
    this.selectedRecapito = undefined;
    this.selectedCentralina = undefined;
    this.selectedPersona = p;
  }

  setRecapito(r) {
    this.selectedPersona = undefined;
    this.selectedMisurazione = undefined;
    this.selectedCentralina = undefined;
    this.selectedRecapito = r;
  }

  setCentralina(c) {
    this.selectedPersona = undefined;
    this.selectedRecapito = undefined;
    this.selectedMisurazione = undefined;
    this.selectedCentralina = c;
  }

  setMisurazione(m) {
    this.selectedPersona = undefined;
    this.selectedRecapito = undefined;
    this.selectedCentralina = undefined;
    this.selectedMisurazione = m;
  }

  deleteObject() {
    if(this.selectedPersona != undefined && this.selectedRecapito == undefined && this.selectedCentralina == undefined && this.selectedMisurazione == undefined) {
      this.personaService.delete(this.selectedPersona.idpersona).subscribe(res => {
        this.updateData();
        this.selectedPersona = undefined;
      }, err => {
        console.log(err)
      })
    } else if(this.selectedRecapito != undefined && this.selectedPersona == undefined && this.selectedCentralina == undefined && this.selectedMisurazione == undefined) {
      this.recapitoService.delete(this.selectedRecapito.idrecapito).subscribe(res => {
        this.updateData();
        this.selectedRecapito = undefined;
      }, err => {
        console.log(err)
      })
    } else if(this.selectedCentralina != undefined && this.selectedPersona == undefined && this.selectedRecapito == undefined && this.selectedMisurazione == undefined) {
      this.centralinaService.delete(this.selectedCentralina._id).subscribe(res => {
        this.updateData();
        this.selectedCentralina = undefined;
      }, err => {
        console.log(err)
      })
    } else if(this.selectedMisurazione != undefined && this.selectedPersona == undefined && this.selectedRecapito == undefined && this.selectedCentralina == undefined) {
      this.misurazioneService.delete(this.selectedMisurazione._id).subscribe(res => {
        this.updateData();
        this.selectedMisurazione = undefined;
      }, err => {
        console.log(err)
      })
    }
  }

  editObject(type, object) {
    const modalRef = this.modalService.open(ModalComponent)
    modalRef.componentInstance.type = type

    if (type == 'Persona') {
      modalRef.componentInstance.persona = JSON.parse(JSON.stringify(object))
    } else if (type == 'Centralina') {
      modalRef.componentInstance.centralina = JSON.parse(JSON.stringify(object))
    } else if (type == 'Misurazione') {
      modalRef.componentInstance.misurazione = JSON.parse(JSON.stringify(object))
      modalRef.componentInstance.centraline = this.centraline
    }

    modalRef.result.then((result) => {
      if(result != undefined) {
        this.updateData();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  newObject(type) {
    const modalRef = this.modalService.open(ModalComponent)
    modalRef.componentInstance.type = type

    if(type == 'Misurazione') {
      modalRef.componentInstance.centraline = this.centraline
    }

    modalRef.result.then((result) => {
      if(result != undefined) {
        this.updateData()
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
