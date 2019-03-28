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
  @Input() persona: Persona;
  @Input() centralina: Centralina;
  @Input() centraline: Centralina[];
  @Input() misurazione: Misurazione;

  @ViewChild("search") public searchElementRef: ElementRef;
  public searchControl: FormControl;  

  constructor(public personaService: PersonaService,
              public recapitoService: RecapitoService,
              public centralinaService: CentralinaService,
              public misurazioneService: MisurazioneService,
              public activeModal: NgbActiveModal,
              public mapsAPILoader: MapsAPILoader,
              public ngZone: NgZone) { }

  ngOnInit() {
    if(this.type == 'Persona' && this.persona == undefined) {
      this.persona = {};
      this.persona.recapiti = [];
    }

    if(this.type == 'Misurazione' && this.misurazione == undefined) {
      this.misurazione = {};
      this.misurazione.centralina = {};
    }

    if(this.type == 'Centralina') {
      if(this.centralina == undefined) {
        this.centralina = {};
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

      //Google Maps
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
    this.persona.recapiti.length++
  }

  markerDragEnd($event) {
    this.centralina.lat = $event.coords.lat;
    this.centralina.lng = $event.coords.lng;
  }

  savePersona(name, surname, dob) {
    if(!(name == '' || surname == '' || dob == '')) {
      this.persona.nome = name;
      this.persona.cognome = surname;
      this.persona.data_nascita = dob;
      this.personaService.save(this.persona).subscribe(res => {
        this.activeModal.close(res);
      })
    }
  }

  deleteRecapito(recapito, i) {
    this.persona.recapiti.splice(i, 1)
  }

  updateRecapiti(phone, i) {
    this.persona.recapiti[i] = ({numero: phone} as Recapito)
  }

  closeModal(){
    this.activeModal.close();
  }

  updatePersona(name, surname, dob){
    if(!(name == '' || surname == '' || dob == '')) {
      this.persona.nome = name;
      this.persona.cognome = surname;
      this.persona.data_nascita = dob;
      this.personaService.update(this.persona).subscribe(res => {
        this.activeModal.close(res);
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

  updateCentralina(name) {
    this.centralina.nome = name
    this.centralinaService.update(this.centralina).subscribe(res => {
      this.activeModal.close(res);
    })
  }

  saveMisurazione(idcentralina, valore) {
    if(idcentralina != '' && valore != '') {
      this.misurazione.valore = valore;
      this.misurazione.centralina = {_id: idcentralina};
      this.misurazioneService.saveMisurazione(this.misurazione).subscribe(res => {
        this.activeModal.close(res);
      })
    } 
  }

  updateMisurazione(idcentralina, valore) {
    if(idcentralina != '' && valore != '') {
      this.misurazione.valore = valore;
      this.misurazione.centralina = {_id: idcentralina};
      this.misurazioneService.updateMisurazione(this.misurazione).subscribe(res => {
        this.activeModal.close(res);
      })
    } 
  }
}
