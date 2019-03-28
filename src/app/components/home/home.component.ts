import { Component, OnInit } from '@angular/core';
import { MeasureService } from '../../services/measure.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //measures: Measure[] = []

  constructor(public measureService: MeasureService,
              private modalService: NgbModal) { }

  ngOnInit() {
    /*this.measureService.getAll().subscribe(measures => {
      this.measures = measures;
    })*/
  }

  /*newMeasure() {
    this.modalService.open(NewmeasureComponent).result.then((measure) => {
      if(measure != undefined) {
        this.measures.push(measure)
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteMeasure() {
    console.log("ciao")

  }*/

}
