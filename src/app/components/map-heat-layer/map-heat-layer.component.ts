import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-map-heat-layer',
  templateUrl: './map-heat-layer.component.html',
  styleUrls: ['./map-heat-layer.component.css']
})
export class MapHeatLayerComponent implements OnInit {

  @ViewChild("search") public searchElementRef: ElementRef;
  public searchControl: FormControl; 
  jesse: boolean = true;

  private map: google.maps.Map = null;
  private originalMap: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;
  
  latitudine: number = 37.775;
  longitudine: number = -122.434;
  

  constructor(public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone) { }

  ngOnInit() {
    
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
            this.latitudine = place.geometry.location.lat();
            this.longitudine = place.geometry.location.lng();
          });
        });
        autocomplete.setComponentRestrictions

      } catch (e) {
        console.log(e)
      }
    });
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    this.originalMap = mapInstance;
    

    // here our in other method after you get the coords; but make sure map is loaded

    var heatMapData = [
      {location: new google.maps.LatLng(37.782, -122.447), weight: 1000},
      new google.maps.LatLng(37.782, -122.445),
      {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
      {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
      {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
      new google.maps.LatLng(37.782, -122.437),
      {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},
    
      {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
      {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
      new google.maps.LatLng(37.785, -122.443),
      {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
      new google.maps.LatLng(37.785, -122.439),
      {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
      {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
    ];

        this.heatmap = new google.maps.visualization.HeatmapLayer({
          map: this.map,
          data: heatMapData

    })
    
}

switch() {

  this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);

  var heatMapData = [
    {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
    new google.maps.LatLng(37.782, -122.445),
    {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
    {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
    {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
    new google.maps.LatLng(37.782, -122.437),
    {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},
  
    {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
    {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
    new google.maps.LatLng(37.785, -122.443),
    {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
    new google.maps.LatLng(37.785, -122.439),
    {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
    {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
  ];

  var heatMapData2 = [
    {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
    new google.maps.LatLng(37.782, -122.445),
    {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
    {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
    {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
    new google.maps.LatLng(37.782, -122.437),
    {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5}
  ];

    if(this.jesse) {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: heatMapData
    });
      this.jesse = false;
    } else {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: heatMapData2
    });
      this.jesse = true;
    
  }
  }

  changeGradient() {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
  }

  changeRadius() {
    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
  }
}


