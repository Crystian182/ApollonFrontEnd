import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

//import { NewmeasureComponent } from './components/newmeasure/newmeasure.component';
import { CrudComponent } from './components/crud/crud.component';
import { NewobjectComponent } from './components/newobject/newobject.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    //NewmeasureComponent,
    CrudComponent,
    NewobjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDeqBKjtOUNXR_H33V1oWKYSWWjsGA3J-E',
      language: 'it',
      libraries: ['geometry', 'places']
    }),
    NgbModalModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    //NewmeasureComponent,
    NewobjectComponent
  ]
})
export class AppModule { }
