import { Component, OnInit } from '@angular/core';
import { OsmService } from 'src/app/services/osm.service';
import { MisurazioneService } from 'src/app/services/misurazione.service';

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

  constructor(private osmService: OsmService,
              private misurazioneService: MisurazioneService) { }

  ngOnInit() {

    this.misurazioneService.getAllTest().subscribe(res => {
      this.details = false;
      this.layer = new ol.source.OSM()
      this.data = new ol.source.Vector(); 
      for(let d of res) {
        var pointFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([d.lng, d.lat])),
          weight: d.weight 
        });
        this.data.addFeature(pointFeature);
      }   

    var vectorLayer = new ol.layer.Vector({
      source:new ol.source.Vector({
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
        }), new ol.layer.Heatmap({
          source: this.data,
          opacity: 0.7,
          radius: 15,
          blur: 20
       }), vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 8
      })
    });
    })
  }

  search(address) {
    if(address != "") {
      this.details = false;  
      this.searchAddress = address;
      this.osmService.search(address).subscribe(res => {
        console.log(res)
        this.searchResults = res
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
      source:new ol.source.Vector({
      features: [new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([Number(lon),Number(lat)], 'EPSG:4326', 'EPSG:3857')),
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
  this.map.getLayers().forEach(layer => {
   // console.log(layer.get('name'))
    if(layer.get('name')==='vectorLayer'){
      console.log('quii')
      this.map.removeLayer(layer)
    }
  });
   // this.map.removeLayer()
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

}
