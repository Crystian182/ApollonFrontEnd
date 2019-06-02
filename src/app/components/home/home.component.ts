import { Component, OnInit } from '@angular/core';
import { OsmService } from 'src/app/services/osm.service';
import { MisurazioneService } from 'src/app/services/misurazione.service';
import * as d3 from 'd3'
import { Mese } from 'src/app/models/Mese';

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
  selectedVariability: String = '';
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
    console.log(this.currentZoom)
    var glbox = evt.map.getView().calculateExtent(evt.map.getSize()); // doesn't look as expected.
    var box = ol.proj.transformExtent(glbox,'EPSG:3857','EPSG:4326');
    this.long1 = box[0];
    this.lat1 = box[3];
    this.lat2 = box[1];
    this.long2 = box[2];
    console.log('x1,y1 ' + this.long1 + ',' + this.lat1)
    console.log('x2,y1 ' + this.long2 + ',' + this.lat1)
    console.log('x1,y2 ' + this.long1 + ',' + this.lat2)
    console.log('x2,y2 '  + this.long2 + ',' + this.lat2)
    this.updateLayer(evt);
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
    this.selectedVariability = variability;
    if(this.selectedVariability == 'anno') {
      this.misurazioneService.getYears().subscribe(res => {
        this.startYears = res;
      })
    } else if(this.selectedVariability == 'mese') {
      this.misurazioneService.getYears().subscribe(res => {
        this.startYears = res;
      })
    } else if(this.selectedVariability == 'giorno') {
      this.misurazioneService.getYears().subscribe(res => {
        this.startYears = res;
      })
    } else if(this.selectedVariability == 'ora') {

    }
  }

  //////////////////////////////// ANNO

  onChangeStartYear($event, startyear) {
    if(startyear == 'default') {
      
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
    this.selectedEndYear = endyear;
  }

  ////////////////////////////////////////////////


  //////////////////////////////// MESE

  onChangeStartYearOfMonth($event, startyear) {
    this.selectedStartYear = startyear;
      this.misurazioneService.getMonthOfYears(startyear).subscribe(res => {
        this.startMonths = [];
        this.selectedStartMonth = undefined;
        this.endYears = [];
        this.selectedEndYear = undefined;
        this.endMonths = [];
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

  onChangeStartMonth($event, startmonth) {
    this.selectedStartMonth = startmonth;
    this.misurazioneService.getYears().subscribe(res => {
      this.endYears = [];
      this.selectedEndYear = undefined;
      this.endMonths = [];
      this.selectedEndMonth = undefined;
      for(let y of res) {
        if(y.anno >= this.selectedStartYear) {
          this.endYears.push(y)
        }
      }
    })
  }

  onChangeEndYearOfMonth($event, endyear) {
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

  onChangeEndMonth($event, endmonth) {
    this.selectedEndMonth = endmonth;
  }

  ////////////////////////////////////////////////


  

  



  onChangeStartDay($event, startday) {
    this.selectedStartDay = startday;
  }

  

  onChangeEndYearOfDay($event, endyear) {
    this.selectedEndYear = endyear;
      this.misurazioneService.getMonthOfYears(endyear).subscribe(res => {
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

  onChangeStartMonthOfDay($event, startmonth) {
    this.selectedStartMonth = startmonth;
      this.misurazioneService.getDayOfMonth(this.selectedStartYear, startmonth).subscribe(res => {
        for(let d of res) {
          this.startDays.push(d.giorno)
        }
      })
  }

  onChangeEndMonthOfDay($event, endmonth) {
    this.selectedEndMonth = endmonth;
    this.endDays = [];
      this.misurazioneService.getDayOfMonth(this.selectedEndYear, endmonth).subscribe(res => {
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
