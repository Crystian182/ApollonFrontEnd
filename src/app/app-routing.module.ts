import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudComponent } from './components/crud/crud.component';
import { MapHeatLayerComponent } from './components/map-heat-layer/map-heat-layer.component';
import { OSMComponent } from './components/osm/osm.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'map', component: MapHeatLayerComponent},
  {path: 'osm', component: OSMComponent},
  {path: 'testgraph', component: TestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
