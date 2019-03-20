import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmeasureComponent } from './newmeasure.component';

describe('NewmeasureComponent', () => {
  let component: NewmeasureComponent;
  let fixture: ComponentFixture<NewmeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
