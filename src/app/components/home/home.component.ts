import { Component, OnInit } from '@angular/core';
import { OsmService } from 'src/app/services/osm.service';
import { MisurazioneService } from 'src/app/services/misurazione.service';
import * as d3 from 'd3'

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

    this.showPieChart();
    this.showLineChart();
    this.showBarChart();

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

  showPieChart() {
    this.misurazioneService.getEFMedium().subscribe(res => {
      var data = res;
      //console.log(data)
      /*var data = [
      {platform: "Tim", "percentage": 50}, 
      {platform: "Vodafone", "percentage": 0},
      {platform: "Wind", "percentage": 50}
      ];*/
    //console.log(dataa)
  
    var svgWidth = 500, svgHeight = 300, radius =  Math.min(svgWidth, svgHeight) / 2;
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    //Create group element to hold pie chart    
    var g = svg.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")") ;
    
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
        }});
            
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
    this.misurazioneService.d3test().subscribe(res => {
      var parsedData = this.parseData(res);
      this.drawChart(parsedData);
    })
    
  }
  
  parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        arr.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convert string to number
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
      .x(function(d) { return x(d.date)})
      .y(function(d) { return y(d.value)})
      x.domain(d3.extent(data, function(d) { return d.date }));
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
      .text("Price ($)");
  
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

  /*var data = [{salesperson: 'Bob', sales: 33},
              {salesperson: 'Robin', sales: 12},
              {salesperson: 'Anne', sales: 41}]*/

    // format the data
    /*data.forEach(function(d) {
      d.avgdbm = +d.avgdbm;
    });*/

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d._id; }));
    y.domain([-90, d3.max(data, function(d) { return d.avgdbm; })-10]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d._id); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.avgdbm); })
        .attr("height", function(d) { return height - y(d.avgdbm); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
  });

  }

}
