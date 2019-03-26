import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona.service';
import { RecapitoService } from '../../services/recapito.service';
import { Persona } from '../../models/Persona';
import { Recapito } from '../../models/Recapito';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewobjectComponent } from '../newobject/newobject.component';

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

  constructor(public personaService: PersonaService,
              public recapitoService: RecapitoService,
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

  deleteObject() {
    if(this.checkType(this.selectedObject) == "Persona") {
      this.personaService.delete(this.selectedObject.idpersona).subscribe(res => {
        this.updateData();
      }, err => {
        console.log('Errore')
      })
    } else {
      this.recapitoService.delete(this.selectedObject.idrecapito).subscribe(res => {
        this.updateData();
      }, err => {
        console.log('Errore')
      })
    }
  }

  editObject(type, object) {
    if(type == 'Persona') {
      const modalRef = this.modalService.open(NewobjectComponent)
      modalRef.componentInstance.type = type
      modalRef.componentInstance.editpersona = object

      modalRef.result.then((persona) => {
        if(persona != undefined) {
          this.updateData();
        }
      }).catch((error) => {
        console.log(error);
      });
    }
    

    
  }

  checkType(o) {
    if(o.idpersona == undefined) {
      return "Recapito"
    }
    return "Persona"
  }

  newObject(type) {
    const modalRef = this.modalService.open(NewobjectComponent)
    modalRef.componentInstance.type = type

    modalRef.result.then((result) => {
      if(result != undefined) {
        this.updateData()
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
