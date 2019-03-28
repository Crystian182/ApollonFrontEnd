import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Recapito } from '../../models/Recapito';
import { RecapitoService } from '../../services/recapito.service';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/Persona';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Centralina } from '../../models/Centralina';
import { CentralinaService } from '../../services/centralina.service';
import { MisurazioneService } from '../../services/misurazione.service';
import { Misurazione } from '../../models/Misurazione';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() type: String;
  @Input() editpersona: Persona;
  @Input() centraline: Centralina[];
  @Input() editcentralina: Centralina;
  @Input() editmisurazione: Misurazione;

  @ViewChild("search") public searchElementRef: ElementRef;
  public searchControl: FormControl;

  rows : Number[] = [] ;
  recapiti: Recapito[] = [];
  persona: Persona;
  recapitiPersona: Recapito[] = [];
  centralina: Centralina = {};
  

  constructor(public personaService: PersonaService,
              public recapitoService: RecapitoService,
              public centralinaService: CentralinaService,
              public misurazioneService: MisurazioneService,
              public activeModal: NgbActiveModal,
              public mapsAPILoader: MapsAPILoader,
              public ngZone: NgZone) { }

  ngOnInit() {
    if(this.editpersona != undefined) {
      this.recapitoService.getByIdPersona(this.editpersona.idpersona).subscribe(recs => {
        this.recapitiPersona = recs;
      })
    } else if(this.editcentralina != undefined) {
      this.centralina = this.editcentralina
    } else {
      this.rows.length = 1;
    }

    if(this.type == 'Centralina') {

      if(this.editcentralina == undefined) {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(position => {
          this.centralina.lat=position.coords.latitude;
          this.centralina.lng=position.coords.longitude;
        },
          error => {
              console.log(error)
          }
        );
      }
    }
      //create search FormControl
    this.searchControl = new FormControl();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {   
      try {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["establishment"]
        });
    
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            
            //set latitude, longitude and zoom
            this.centralina.lat = place.geometry.location.lat();
            this.centralina.lng = place.geometry.location.lng();
          });
        });
      autocomplete.setComponentRestrictions
      } catch (e) {
        console.log(e)
      }
    });
    }
  }

  addrow(){
    this.rows.push(this.rows.length+1);
    this.recapitiPersona.length++
  }

  markerDragEnd($event) {
    this.centralina.lat = $event.coords.lat;
    this.centralina.lng = $event.coords.lng;
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

  saveCentralina(name) {
    if(name != '') {
      this.centralina.nome = name;
      this.centralinaService.saveCentralina(this.centralina).subscribe(res => {
        this.activeModal.close(res);
      })
    }
  }

  editCentralina(name) {
    this.centralina.nome = name
    this.centralinaService.update(this.centralina).subscribe(res => {
      this.activeModal.close(res);
    })
  }

  saveMisurazione(idcentralina, valore) {
    if(idcentralina != '' && valore != '') {
      this.misurazioneService.saveMisurazione({valore: valore, centralina: {_id: idcentralina}} as Misurazione).subscribe(res => {
        this.activeModal.close(res);
      })
    } 
  }

  editMisurazione(idcentralina, valore) {
    if(idcentralina != '' && valore != '') {
      this.editmisurazione.valore = valore;
      this.editmisurazione.centralina = {_id: idcentralina};
      this.misurazioneService.updateMisurazione(this.editmisurazione).subscribe(res => {
        this.activeModal.close(res);
      })
    } 
  }
}
