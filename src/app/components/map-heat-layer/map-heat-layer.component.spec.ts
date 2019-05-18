import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHeatLayerComponent } from './map-heat-layer.component';

describe('MapHeatLayerComponent', () => {
  let component: MapHeatLayerComponent;
  let fixture: ComponentFixture<MapHeatLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapHeatLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHeatLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
