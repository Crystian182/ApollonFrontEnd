import { Component, OnInit } from '@angular/core';
import { MeasureService } from '../../services/measure.service';
import { Measure } from '../../models/measure';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  measures: Measure[] = []

  constructor(public measureService: MeasureService) { }

  ngOnInit() {
    this.measureService.getAll().subscribe(measures => {
      this.measures = measures;
    })
  }

}
