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

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  persone: Persona[] = [];
  recapiti: Recapito[] = [];
  relational: boolean = true;
  selectedObject: any = {};
  selectedMisurazione: Misurazione;
  centraline: Centralina[] = [];
  misurazioni: Misurazione[] = [];

  constructor(public personaService: PersonaService,
              public recapitoService: RecapitoService,
              public centralinaService: CentralinaService,
              public misurazioneService: MisurazioneService,
              public modalService: NgbModal) { }

  ngOnInit() {
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
    } else {
      this.relational = true;
    }
  }

  setselected(o) {
    this.selectedObject = o;
  }

  setselectedmisurazione(o) {
    this.selectedMisurazione = o
  }

  deleteObject() {
    if(this.selectedMisurazione != undefined) {
      this.misurazioneService.delete(this.selectedMisurazione.id).subscribe(res => {
        this.updateData();
        this.selectedMisurazione = undefined;
      }, err => {
        console.log(err)
      })
    }
    if(this.checkType(this.selectedObject) == "Persona") {
      this.personaService.delete(this.selectedObject.idpersona).subscribe(res => {
        this.updateData();
      }, err => {
        console.log('Errore')
      })
    } else if(this.checkType(this.selectedObject) == "Recapito") {
      this.recapitoService.delete(this.selectedObject.idrecapito).subscribe(res => {
        this.updateData();
      }, err => {
        console.log('Errore')
      })
    } else if(this.checkType(this.selectedObject) == "Centralina") {
      this.centralinaService.delete(this.selectedObject._id).subscribe(res => {
        this.updateData();
      }, err => {
        console.log(err)
      })
    }
  }

  editObject(type, object) {
    if (type == 'Persona') {
      const modalRef = this.modalService.open(ModalComponent)
      modalRef.componentInstance.type = type
      modalRef.componentInstance.editpersona = object

      modalRef.result.then((persona) => {
        if(persona != undefined) {
          this.updateData();
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'Centralina') {
      const modalRef = this.modalService.open(ModalComponent)
      modalRef.componentInstance.type = type
      modalRef.componentInstance.editcentralina = object

      modalRef.result.then((result) => {
        if(result != undefined) {
          this.updateData();
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'Misurazione') {
      const modalRef = this.modalService.open(ModalComponent)
      modalRef.componentInstance.type = type
      modalRef.componentInstance.editmisurazione = object
      modalRef.componentInstance.centraline = this.centraline

      modalRef.result.then((result) => {
        if(result != undefined) {
          this.updateData();
        }
      }).catch((error) => {
        console.log(error);
      });
    }
    

    
  }

  checkType(o) {
    if(o.idpersona == undefined && o._id == undefined) {
      return "Recapito"
    } else if(o.idrecapito == undefined && o._id == undefined) {
      return "Persona"
    } else if(o.idrecapito == undefined && o.idpersona == undefined) {
      return "Centralina"
    }
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
