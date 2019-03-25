import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-newobject',
  templateUrl: './newobject.component.html',
  styleUrls: ['./newobject.component.css']
})
export class NewobjectComponent implements OnInit {
  @Input() type: String;

  rows : Number[] = [] ;

  constructor() { }

  ngOnInit() {
    this.rows.length = 1;
  }

  addrow(){
    this.rows.push(this.rows.length+1);
  }

}
