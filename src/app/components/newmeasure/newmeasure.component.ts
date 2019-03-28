/*import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Misurazio } from '../../models/measure';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { isNumber } from 'util';
import { MeasureService } from '../../services/measure.service';

@Component({
  selector: 'app-newmeasure',
  templateUrl: './newmeasure.component.html',
  styleUrls: ['./newmeasure.component.css']
})
export class NewmeasureComponent implements OnInit {
  @ViewChild("search") public searchElementRef: ElementRef;

  measure: Measure = {};
  valid: boolean = true;
  public searchControl: FormControl;

  constructor(public mapsAPILoader: MapsAPILoader,
              public ngZone: NgZone,
              public activeModal: NgbActiveModal,
              public measureService: MeasureService) { }

  ngOnInit() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(position => {
        this.measure.lat=position.coords.latitude;
        this.measure.lng=position.coords.longitude;
      },
        error => {
            console.log(error)
        }
      );
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
            this.measure.lat = place.geometry.location.lat();
            this.measure.lng = place.geometry.location.lng();
          });
        });
      autocomplete.setComponentRestrictions
      } catch (e) {
        console.log(e)
      }
    });
  }

  markerDragEnd($event) {
    this.measure.lat = $event.coords.lat;
    this.measure.lng = $event.coords.lng;
  }

  closeModal() {
    this.activeModal.close();
  }

  save(value) {
    if(value == "" || value == undefined) {
      this.valid = false;
    } else {
      this.valid = true;
      this.measure.value = value;
      this.measureService.saveMeasure(this.measure).subscribe(measure => {
        this.activeModal.close(measure);
      })
    }
  }

}
*/