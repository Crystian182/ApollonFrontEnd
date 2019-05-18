import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudComponent } from './components/crud/crud.component';
import { D3TestComponent } from './components/d3-test/d3-test.component';
import { MapHeatLayerComponent } from './components/map-heat-layer/map-heat-layer.component';
import { OSMComponent } from './components/osm/osm.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'test', component: D3TestComponent},
  {path: 'map', component: MapHeatLayerComponent},
  {path: 'osm', component: OSMComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
