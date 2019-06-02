import { Component, OnInit } from '@angular/core';
import { OsmService } from 'src/app/services/osm.service';
import { MisurazioneService } from 'src/app/services/misurazione.service';
import * as d3 from 'd3'
import { Mese } from 'src/app/models/Mese';
import { interval } from 'rxjs';

declare var ol: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  map: any;
  layer: any;
  latitude: number = 40.35481;
  longitude: number = 18.17244;
  searchResults: any[] = [];
  heatmapData: any[] = [];
  data: any;
  details: boolean;
  searchAddress: any;
  result: any;
  emptyresults: boolean = false;
  sumelem: Number;
  efmedium: any[] = []
  currentZoom: Number = 8;
  long1: Number;
  long2: Number;
  lat1: Number;
  lat2: Number;
  heatmaplayer: any;
  opt: boolean = false;
  radiusValue: Number;
  blurValue: Number;
  selectedVariability: String = undefined;
  startYears: String[] = [];
  endYears: String[] = [];
  selectedStartYear: String;
  selectedEndYear: String;
  startMonths: Mese[] = [];
  endMonths: Mese[] = [];
  month: Mese;
  selectedStartMonth: Number;
  selectedEndMonth: Number;
  startDays: Number[] = [];
  endDays: Number[] = [];
  selectedStartDay: Number;
  selectedEndDay: Number;
  startHours: String[] = [];
  endHours: String[] = [];
  selectedStartHour: String;
  selectedEndHour: String;
  currentPrecision: any;
  intervallTimer: any = interval(5000);
  subscription: any;
  animating: boolean = false;
  label: String = "";

  constructor(private osmService: OsmService,
              private misurazioneService: MisurazioneService) { }

  ngOnInit() {

    this.showPieChart();
    this.showLineChart();
    this.showBarChart();

    //self=this

    //this.misurazioneService.getMedia().subscribe(res => {
      this.details = false;
      this.layer = new ol.source.OSM()
      //this.data = new ol.source.Vector();
      //console.log(res)
      /*for(let d of res) {
        var pointFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([d.longitudine, d.latitudine])),
          weight: d.weight
        });
        this.data.addFeature(pointFeature);
      }   

      this.heatmaplayer = new ol.layer.Heatmap({
        source: this.data,
        opacity: 0.6,
        radius: 12,
        blur: 25
     })*/

    var vectorLayer = new ol.layer.Vector({
      name: 'firstvector',
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([(this.longitude), (this.latitude)], 'EPSG:4326', 'EPSG:3857')),
          })]
        }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          opacity: 0.5,
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          scale: 0.08,
          src: "https://image.flaticon.com/icons/svg/33/33622.svg"
          })
      })
    });

    this.map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }),
      layers: [
        new ol.layer.Tile({
          source: this.layer
        }), 
        //this.heatmaplayer,
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 8,
        minZoom: 2,
        maxZoom: 19
      })
    });
    //console.log(this.map.getView().getZoom())
    /*this.map.getView().on('propertychange', function(e) {
      switch (e.key) {
         case 'resolution':
           console.log(e.oldValue);
           break;
      }
   });*/
   
   //console.log(this.map.getView().getZoom());
  //this.map.on('moveend', this.onMoveEnd);
  this.map.on('moveend', evt => {
    this.currentZoom = evt.map.getView().getZoom();
    var glbox = evt.map.getView().calculateExtent(evt.map.getSize()); // doesn't look as expected.
    var box = ol.proj.transformExtent(glbox,'EPSG:3857','EPSG:4326');
    this.long1 = box[0];
    this.lat1 = box[3];
    this.lat2 = box[1];
    this.long2 = box[2];
    if(!this.animating) {
      this.updateLayer(evt);
    }
  });
  //});
  }

  switchZoom(zoom) {
    if(2 <= zoom && zoom <= 3) {
      return 1;
    } else if(3 < zoom && zoom <= 5) {
      return 2;
    } else if(5 < zoom && zoom <= 8) {
      return 3;
    } else if(8 < zoom && zoom <= 19) {
      return 4;
    } 
  }

  updateLayer(evt) {
    let precision = this.switchZoom(this.currentZoom)
    this.currentPrecision = precision;
    //y2 <= lat <= y1
    //x1 <= long <= x2
    //zoom -> endpoint diversi
        //zoom varia da 2 a 19
        //4 livelli zoom:
                        //da 2 a 6 zoom 1
                        //da 7 a 10 zoom 2
                        //da 11 a 14 zoom 3
                        //da 15 a 19 zoom 4

    this.misurazioneService.getMedia(precision, this.lat1, this.lat2, this.long1, this.long2).subscribe(res => {
      evt.map.removeLayer(this.heatmaplayer)
      this.data = new ol.source.Vector();
      for(let d of res) {
        var pointFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([d.longitudine, d.latitudine])),
          weight: d.weight
        });
        this.data.addFeature(pointFeature);
      }   

      if(precision <= 2) {
        this.radiusValue = 40
        this.blurValue = 10
      } else {
        this.radiusValue = 15
        this.blurValue = 30
      }

      this.heatmaplayer = new ol.layer.Heatmap({
        source: this.data,
        radius: this.radiusValue,
        blur: this.blurValue
     })
     evt.map.addLayer(this.heatmaplayer)
    })
  }

  search(address) {
    if(address != "") {
      this.emptyresults = false;  
      this.osmService.search(address).subscribe(res => {
        if(res.length === 0){
          this.emptyresults = true;
          var view = this.map.getView();
          view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
          view.setZoom(10); 
          var layers =  this.map.getLayers();
          layers.forEach( function (layer) {
            if(layer.get('name')==='vector'){
              layers.pop(layer);
            }
          });
        }
        this.details = false;
        this.searchResults = res;
        this.searchAddress = address;
      })
    } else{
        alert("Inserisci un indirizzo valido")
    }
  }

  zoomIn(display_name, lat, lon){
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([Number(lon), Number(lat)]));
    view.setZoom(12); 
    var vector = new ol.layer.Vector({
      name: 'vector',
      source:new ol.source.Vector({
      features: [new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([Number(lon),Number(lat)], 'EPSG:4326', 'EPSG:3857')),
      })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          opacity: 1,
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          scale: 0.08,
          src: "https://image.flaticon.com/icons/svg/33/33622.svg"
          })
      })
    });

    var layers =  this.map.getLayers();
    layers.forEach( function (layer) {
      if(layer.get('name')==='firstvector'){
          layers.pop(layer);
          console.log(layers)
      }
      if(layer.get('name')==='vector'){
        layers.pop(layer);
        console.log(layers)
      }
    });
  
    this.map.addLayer(vector)
    this.details = true;  
    this.result={
      display_name: display_name,
      lat: lat,
      lon: lon
    }
  }

  back(){
    this.details = false;
  }

  onChange($event, variability) {
    if(variability == 'default') {
      this.selectedVariability = undefined;
      this.startYears = [];
      this.endYears = [];
      this.startMonths = [];
      this.endMonths = [];
      this.startDays = [];
      this.endDays = [];
      this.startHours = [];
      this.endHours = [];
      this.selectedStartYear = undefined;
      this.selectedEndYear = undefined;
      this.selectedStartMonth = undefined;
      this.selectedEndMonth = undefined;
      this.selectedStartDay = undefined;
      this.selectedEndDay = undefined;
      this.selectedStartHour = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedVariability = variability;
      this.startYears = [];
      this.endYears = [];
      this.startMonths = [];
      this.endMonths = [];
      this.startDays = [];
      this.endDays = [];
      this.startHours = [];
      this.endHours = [];
      this.selectedStartYear = undefined;
      this.selectedEndYear = undefined;
      this.selectedStartMonth = undefined;
      this.selectedEndMonth = undefined;
      this.selectedStartDay = undefined;
      this.selectedEndDay = undefined;
      this.selectedStartHour = undefined;
      this.selectedEndHour = undefined;
      this.misurazioneService.getYears().subscribe(res => {
        this.startYears = res;
      })
    }
  }

  //////////////////////////////// ANNO

  onChangeStartYear($event, startyear) {
    if(startyear == 'default') {
      this.endYears = [];
      this.selectedStartYear = undefined;
      this.selectedEndYear = undefined;
    } else {
      this.selectedStartYear = startyear;
        this.misurazioneService.getYears().subscribe(res => {
          this.endYears = [];
          this.selectedEndYear = undefined;
          for(let y of res) {
            if(y.anno > this.selectedStartYear) {
              this.endYears.push(y)
            }
          }
        })
    }
  }

  onChangeEndYear($event, endyear) {
    if(endyear == 'default') {
      this.selectedEndYear = undefined
    } else {
      this.selectedEndYear = endyear;
    }
  }

  ////////////////////////////////////////////////


  //////////////////////////////// MESE

  onChangeStartYearOfMonth($event, startyear) {
    if(startyear == 'default') {
      this.startMonths = [];
      this.endMonths = [];
      this.endYears = [];
      this.selectedStartYear = undefined;
      this.selectedStartMonth = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
    } else {
      this.selectedStartYear = startyear;
      this.misurazioneService.getMonthOfYears(startyear).subscribe(res => {
        this.startMonths = [];
        this.endMonths = [];
        this.endYears = [];
        this.selectedStartMonth = undefined;
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        for(let m of res) {
           this.month = {
              nome: this.getNameOfMonth(m.mese),
              numero: m.mese
           }
           this.startMonths.push(this.month)
        }
      })
    }
  }

  onChangeStartMonth($event, startmonth) {
    if(startmonth == 'default') {
      this.endMonths = [];
      this.endYears = [];
      this.selectedStartMonth = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
    } else {
      this.selectedStartMonth = startmonth;
      this.misurazioneService.getYears().subscribe(res => {
        this.endMonths = [];
        this.endYears = [];
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        for(let y of res) {
          if(y.anno >= this.selectedStartYear) {
            this.endYears.push(y)
          }
        }
      })
    }
  }

  onChangeEndYearOfMonth($event, endyear) {
    if(endyear == 'default') {
      this.endMonths = [];
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
    } else {
      this.selectedEndYear = endyear;
      this.misurazioneService.getMonthOfYears(endyear).subscribe(res => {
        this.endMonths = [];
        this.selectedEndMonth = undefined;
        for(let m of res) {
           this.month = {
              nome: this.getNameOfMonth(m.mese),
              numero: m.mese
           }
           if((this.selectedEndYear == this.selectedStartYear && this.selectedStartMonth < this.month.numero) ||
                  this.selectedEndYear > this.selectedStartYear) {
             this.endMonths.push(this.month)
           }
        }
      })
    }
  }

  onChangeEndMonth($event, endmonth) {
    if(endmonth == 'default') {
      this.selectedEndMonth = undefined;
    } else {
      this.selectedEndMonth = endmonth;
    }
  }

  ////////////////////////////////////////////////


  //////////////////////////////// GIORNO

  onChangeStartYearOfDay($event, startyear) {
    if(startyear == 'default') {
      this.startMonths = [];
      this.startDays = [];
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.selectedStartYear = undefined;
      this.selectedStartMonth = undefined;
      this.selectedStartDay = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
    } else {
      this.selectedStartYear = startyear;
      this.misurazioneService.getMonthOfYears(startyear).subscribe(res => {
        this.startMonths = [];
        this.startDays = [];
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.selectedStartMonth = undefined;
        this.selectedStartDay = undefined;
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        for(let m of res) {
           this.month = {
              nome: this.getNameOfMonth(m.mese),
              numero: m.mese
           }
           this.startMonths.push(this.month)
        }
      })
    }
  }

  onChangeStartMonthOfDay($event, startmonth) {
    if(startmonth == 'default') {
      this.startDays = [];
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.selectedStartMonth = undefined;
      this.selectedStartDay = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
    } else {
      this.selectedStartMonth = startmonth;
      this.misurazioneService.getDayOfMonth(this.selectedStartYear, startmonth).subscribe(res => {
        this.startDays = [];
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.selectedStartDay = undefined;
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        for(let d of res) {
          this.startDays.push(d.giorno)
        }
      })
    }
  }

  onChangeStartDayOfDay($event, startday) {
    if(startday == 'default') {
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.selectedStartDay = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
    } else {
      this.selectedStartDay = startday;
      this.misurazioneService.getYears().subscribe(res => {
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        for(let y of res) {
          if(y.anno >= this.selectedStartYear) {
            this.endYears.push(y)
          }
        }
      })
    } 
  }

  onChangeEndYearOfDay($event, endyear) {
    if(endyear == 'default') {
      this.endMonths = [];
      this.endDays = [];
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
    } else {
      this.selectedEndYear = endyear;
      this.misurazioneService.getMonthOfYears(endyear).subscribe(res => {
        this.endMonths = [];
        this.endDays = [];
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        for(let m of res) {
           this.month = {
              nome: this.getNameOfMonth(m.mese),
              numero: m.mese
           }
           if(this.selectedStartMonth <= this.month.numero) {
             this.endMonths.push(this.month)
           }
        }
      })
    }
  }

  onChangeEndMonthOfDay($event, endmonth) {
    if(endmonth == 'default') {
      this.endDays = [];
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
    } else {
      this.selectedEndMonth = endmonth;
      this.misurazioneService.getDayOfMonth(this.selectedEndYear, endmonth).subscribe(res => {
        this.endDays = [];
        this.selectedEndDay = undefined;
        for(let d of res) {
          if(this.selectedStartYear == this.selectedEndYear) {
            if(this.selectedStartMonth == this.selectedEndMonth) {
              if(this.selectedStartDay < d.giorno) {
                this.endDays.push(d.giorno)
              }
            } else if(this.selectedStartMonth < this.selectedEndMonth) {
              this.endDays.push(d.giorno)
            }
          } else if(this.selectedStartYear < this.selectedEndYear) {
            this.endDays.push(d.giorno)
          }
        }
      })
    }
  }

  onChangeEndDayOfDay($event, endday) {
    if(endday == 'default') {
      this.selectedEndDay = undefined;
    } else {
      this.selectedEndDay = endday;
    }
  }

  ////////////////////////////////////////////////


  //////////////////////////////// GIORNO

  onChangeStartYearOfHour($event, startyear) {
    if(startyear == 'default') {
      this.startMonths = [];
      this.startDays = [];
      this.startHours = [];
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.endHours = [];
      this.selectedStartYear = undefined;
      this.selectedStartMonth = undefined;
      this.selectedStartDay = undefined;
      this.selectedStartHour = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedStartYear = startyear;
      this.misurazioneService.getMonthOfYears(startyear).subscribe(res => {
        this.startMonths = [];
        this.startDays = [];
        this.startHours = [];
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.endHours = [];
        this.selectedStartMonth = undefined;
        this.selectedStartDay = undefined;
        this.selectedStartHour = undefined;
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        this.selectedEndHour = undefined;
        for(let m of res) {
           this.month = {
              nome: this.getNameOfMonth(m.mese),
              numero: m.mese
           }
           this.startMonths.push(this.month)
        }
      })
    }
  }

  onChangeStartMonthOfHour($event, startmonth) {
    if(startmonth == 'default') {
      this.startDays = [];
      this.startHours = [];
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.endHours = [];
      this.selectedStartMonth = undefined;
      this.selectedStartDay = undefined;
      this.selectedStartHour = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedStartMonth = startmonth;
      this.misurazioneService.getDayOfMonth(this.selectedStartYear, startmonth).subscribe(res => {
        this.startDays = [];
        this.startHours = [];
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.endHours = [];
        this.selectedStartDay = undefined;
        this.selectedStartHour = undefined;
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        this.selectedEndHour = undefined;
        for(let d of res) {
          this.startDays.push(d.giorno)
        }
      })
    }
  }

  onChangeStartDayOfHour($event, startday) {
    if(startday == 'default') {
      this.startHours = [];
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.endHours = [];
      this.selectedStartDay = undefined;
      this.selectedStartHour = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedStartDay = startday;
      this.misurazioneService.getHourOfDay(this.selectedStartYear, this.selectedStartMonth, this.selectedStartDay).subscribe(res => {
        this.startHours = [];
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.endHours = [];
        this.selectedStartHour = undefined;
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        this.selectedEndHour = undefined;
        for(let h of res) {
          this.startHours.push(h.ora.substring(0, h.ora.length-3))
        }
      })
    } 
  }

  onChangeStartHour($event, starthour) {
    if(starthour == 'default') {
      this.endYears = [];
      this.endMonths = [];
      this.endDays = [];
      this.endHours = [];
      this.selectedStartHour = undefined;
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedStartHour = starthour + ':00'
      this.misurazioneService.getYears().subscribe(res => {
        this.endYears = [];
        this.endMonths = [];
        this.endDays = [];
        this.endHours = [];
        this.selectedEndYear = undefined;
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        this.selectedEndHour = undefined;
        for(let y of res) {
          if(y.anno >= this.selectedStartYear) {
            this.endYears.push(y)
          }
        }
      })
    }
  }

  onChangeEndYearOfHour($event, endyear) {
    if(endyear == 'default') {
      this.endMonths = [];
      this.endDays = [];
      this.endHours = [];
      this.selectedEndYear = undefined;
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedEndYear = endyear;
      this.misurazioneService.getMonthOfYears(endyear).subscribe(res => {
        this.endMonths = [];
        this.endDays = [];
        this.endHours = [];
        this.selectedEndMonth = undefined;
        this.selectedEndDay = undefined;
        this.selectedEndHour = undefined;
        for(let m of res) {
           this.month = {
              nome: this.getNameOfMonth(m.mese),
              numero: m.mese
           }
           if((this.selectedEndYear == this.selectedStartYear && this.selectedStartMonth <= this.month.numero) ||
                  this.selectedEndYear > this.selectedStartYear) {
             this.endMonths.push(this.month)
           }
        }
      })
    }
  }

  onChangeEndMonthOfHour($event, endmonth) {
    if(endmonth == 'default') {
      this.endDays = [];
      this.endHours = [];
      this.selectedEndMonth = undefined;
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedEndMonth = endmonth;
      this.misurazioneService.getDayOfMonth(this.selectedEndYear, endmonth).subscribe(res => {
        this.endDays = [];
        this.endHours = [];
        this.selectedEndDay = undefined;
        this.selectedEndHour = undefined;
        for(let d of res) {
          if(this.selectedStartYear == this.selectedEndYear) {
            if(this.selectedStartMonth == this.selectedEndMonth) {
              if(this.selectedStartDay <= d.giorno) {
                this.endDays.push(d.giorno)
              }
            } else if(this.selectedStartMonth < this.selectedEndMonth) {
              this.endDays.push(d.giorno)
            }
          } else if(this.selectedStartYear < this.selectedEndYear) {
            this.endDays.push(d.giorno)
          }
        }
      })
    }
  }

  onChangeEndDayOfHour($event, endday) {
    if(endday == 'default') {
      this.endHours = [];
      this.selectedEndDay = undefined;
      this.selectedEndHour = undefined;
    } else {
      this.selectedEndDay = endday;
      this.misurazioneService.getHourOfDay(this.selectedStartYear, this.selectedStartMonth, this.selectedStartDay).subscribe(res => {
        this.endHours = [];
        this.selectedEndHour = undefined;
        for(let h of res) {
          if(this.selectedStartHour.substring(0, this.selectedStartHour.length-6) < h.ora.substring(0, h.ora.length-6)) {
            this.endHours.push(h.ora.substring(0, h.ora.length-3))
          }
        }
      })
    } 
  }

  onChangeEndHour($event, endhour) {
    if(endhour == 'default') {
      this.selectedEndHour = undefined;
    } else {
      this.selectedEndHour = endhour + ':00'
    }
  }

  ////////////////////////////////////////////////

  getNameOfMonth(value) {
    if(value == 1) {
      return 'Gennaio';
    } else if(value == 2) {
      return 'Febbraio';
    } else if(value == 3) {
      return 'Marzo';
    } else if(value == 4) {
      return 'Aprile';
    } else if(value == 5) {
      return 'Maggio';
    } else if(value == 6) {
      return 'Giugno';
    } else if(value == 7) {
      return 'Luglio';
    } else if(value == 8) {
      return 'Agosto';
    } else if(value == 9) {
      return 'Settembre';
    } else if(value == 10) {
      return 'Ottobre';
    }else if(value == 11) {
      return 'Novembre';
    } else if(value == 12) {
      return 'Dicembre';
    }
  }

  startAnimation() {
    if(this.selectedVariability == 'anno') {
      if(this.selectedStartYear == undefined || this.selectedEndYear == undefined) {
        alert('Completa tutti i campi per iniziare l\'animazione')
      } else {
        this.misurazioneService.getMediaAnno(this.currentPrecision, this.lat1, this.lat2,
          this.long1, this.long2, this.selectedStartYear, this.selectedEndYear).subscribe(res => {
            this.animateLayer(res);
        })
      }
    } else if(this.selectedVariability == 'mese') {
      if(this.selectedStartYear == undefined || this.selectedEndYear == undefined ||
        this.selectedStartMonth == undefined || this.selectedEndMonth == undefined) {
        alert('Completa tutti i campi per iniziare l\'animazione')
      } else {
        this.misurazioneService.getMediaMese(this.currentPrecision, this.lat1, this.lat2,
          this.long1, this.long2, this.selectedStartYear + '-' + this.selectedStartMonth,
          this.selectedEndYear + '-' + this.selectedEndMonth).subscribe(res => {
            this.animateLayer(res);
        })
      }
    } else if(this.selectedVariability == 'giorno') {
      if(this.selectedStartYear == undefined || this.selectedEndYear == undefined ||
        this.selectedStartMonth == undefined || this.selectedEndMonth == undefined ||
        this.selectedStartDay == undefined || this.selectedEndDay == undefined) {
        alert('Completa tutti i campi per iniziare l\'animazione')
      } else {
        this.misurazioneService.getMediaGiorno(this.currentPrecision, this.lat1, this.lat2, this.long1, this.long2,
          this.selectedStartYear + '-' + this.selectedStartMonth + '-' + this.selectedStartDay,
          this.selectedEndYear + '-' + this.selectedEndMonth + '-' + this.selectedEndDay).subscribe(res => {
            this.animateLayer(res);
        })
      }
    } else if(this.selectedVariability == 'ora') {
      if(this.selectedStartYear == undefined || this.selectedEndYear == undefined ||
        this.selectedStartMonth == undefined || this.selectedEndMonth == undefined ||
        this.selectedStartDay == undefined || this.selectedEndDay == undefined ||
        this.selectedStartHour == undefined || this.selectedEndHour == undefined) {
        alert('Completa tutti i campi per iniziare l\'animazione')
      } else {
        this.misurazioneService.getMediaOra(this.currentPrecision, this.lat1, this.lat2, this.long1, this.long2,
          this.selectedStartYear + '-' + this.selectedStartMonth + '-' + this.selectedStartDay + ' ' + this.selectedStartHour,
          this.selectedEndYear + '-' + this.selectedEndMonth + '-' + this.selectedEndDay + ' ' + this.selectedEndHour).subscribe(res => {
            this.animateLayer(res);
        })
      }
    }
  }

  animateLayer(data) {
    this.animating = true;
    let i = 0;
    let properties = Object.keys(data);
    this.updateAnimationLayer(data[properties[i]])
    this.label = properties[i];
    i = 1;
    this.subscription = this.intervallTimer.subscribe(() => {
      this.updateAnimationLayer(data[properties[i]])
      this.label = properties[i];
      if(i == properties.length-1) {
        i=0
      } else {
        i++;
      }
    });
    //
  }

  updateAnimationLayer(data) {
    this.map.removeLayer(this.heatmaplayer)
    this.data = new ol.source.Vector();
    for(let d of data) {
      var pointFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([d.longitudine, d.latitudine])),
        weight: d.weight
      });
      this.data.addFeature(pointFeature);
    }   

    if(this.currentPrecision <= 2) {
      this.radiusValue = 40
      this.blurValue = 10
    } else {
      this.radiusValue = 15
      this.blurValue = 30
    }

    this.heatmaplayer = new ol.layer.Heatmap({
      source: this.data,
      radius: this.radiusValue,
      blur: this.blurValue
    })
    this.map.addLayer(this.heatmaplayer)
  }

  stopAnimation() {
    this.subscription.unsubscribe();
    this.animating = false;
    this.label = "";
  }

  showPieChart() {
    this.misurazioneService.getEFMedium().subscribe(res => {
      var data = res;
      this.efmedium = data;
  
      var svgWidth = 450, svgHeight = 450, margin = 40, radius =  Math.min(svgWidth, svgHeight) / 2 - margin;
      var svg = d3.select('svg')
          .attr("width", svgWidth)
          .attr("height", svgHeight);
      
      //Create group element to hold pie chart    
      var g = svg.append("g")
          .attr("transform", "translate(" + svgWidth/2 + "," + svgHeight/2 + ")") ;
      
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      
      var pie = d3.pie().value(function(d) { 
          return d.percentage; 
      });
      
      var path = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);
      
      var arc = g.selectAll("arc")
          .data(pie(data))
          .enter()
          .append("g");
      
      arc.append("path")
          .attr("d", path)
          .attr("fill", function(d) {
            if(d.data.label=="Basso") {
              return "#2db41f";
          } else if(d.data.label=="Medio") {
            return "#cad10e";
          } else if(d.data.label=="Alto") {
            return "#d10a0a";
          }})
          .attr("stroke", "black")
          .style("stroke-width", "2px")
          .style("opacity", 0.7);
              
      var label = d3.arc()
          .outerRadius(radius)
          .innerRadius(0);
                  
      arc.append("text")
          .attr("transform", function(d) { 
              return "translate(" + label.centroid(d) + ")"; 
          })
          .attr("text-anchor", "middle")
          .text(function(d) { if(d.data.percentage != 0) {
            return d.data.percentage+"%"; 
          }
        });

      })
    
  }

  showLineChart() {
    this.misurazioneService.getDayChanges().subscribe(res => {
      var parsedData = this.parseData(res);
      this.drawChart(parsedData);
    })
    
  }
  
  parseData(data) {
    var arr = [];
    for (var i of data) {
        arr.push({
            hour: d3.timeParse("%H")(i.hour), //date
            value: +i.level //convert string to number
        });
    }
    return arr;
}

drawChart(data) {
  var svgWidth = 500, svgHeight = 300;
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  var svg = d3.select('#linechart')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
      
  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var x = d3.scaleTime()
      .rangeRound([0, width]);
  
  var y = d3.scaleLinear()
      .rangeRound([height, 0]);
  
  var line = d3.line()
      .x(function(d) { return x(d.hour)})
      .y(function(d) { return y(d.value)})
      x.domain(d3.extent(data, function(d) { return d.hour }));
      y.domain(d3.extent(data, function(d) { return d.value }));
  
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();
  
  g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Level (dBm)");
  
  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }

  showBarChart() {
    this.misurazioneService.getCarrierMedium().subscribe(res => {
      var data = res;
   
      var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 300 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      // set the ranges
      var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
      var y = d3.scaleLinear()
                .range([height, 0]);
                
      var svg = d3.select("#barchart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d._id; }));
        y.domain([d3.max(data, function(d) { return d.avgdbm; })-10, -100]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d._id); })
            .attr("fill", function(d) {
                return color(d.avgdbm);})
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.avgdbm); })
            .attr("height", function(d) { return height - y(d.avgdbm); });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Level (dBm)");;
      });

  }

}
