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

  constructor(private osmService: OsmService,
              private misurazioneService: MisurazioneService) { }

  ngOnInit() {

    this.misurazioneService.getAllTest().subscribe(res => {
      this.layer = new ol.source.OSM()

      this.data = new ol.source.Vector(); 
      for(let d of res) {
        var pointFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([d.lng, d.lat])),
          weight: d.weight 
        });
        this.data.addFeature(pointFeature);
      }    

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
       })
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
      this.osmService.search(address).subscribe(res => {
        console.log(res)
        this.searchResults = res
      })
    } else{
        alert("Inserisci un indirizzo valido")
    }
  }

  zoomIn(lat, lon){
    console.log(lat,lon)
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([Number(lon), Number(lat)]));
    view.setZoom(8);
  }

}
