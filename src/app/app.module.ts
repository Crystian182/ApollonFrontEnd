import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NewmeasureComponent } from './components/newmeasure/newmeasure.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewmeasureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    HttpModule,
    NgbModalModule,
    NgbModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NewmeasureComponent
  ]
})
export class AppModule { }
