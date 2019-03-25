import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewobjectComponent } from './newobject.component';

describe('NewobjectComponent', () => {
  let component: NewobjectComponent;
  let fixture: ComponentFixture<NewobjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewobjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewobjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
