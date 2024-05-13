import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {CitiesComponent} from './cities/cities.component';
// add Material Angular Module
import {AngularMaterialModule} from './angular-material.module';
import {ChildComponent} from './child/child.component';
import {CountriesComponent} from './countries/countries.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor'

// Cap 7 reactive forms!!!!!
import {ReactiveFormsModule} from '@angular/forms';
import {CityEditComponent} from './cities/city-edit.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DecimalPipe, CommonModule} from '@angular/common';
import {CountryEditComponent} from './countries/country-edit.component';
// import {CityService} from "./cities/city.service";
// import {CountryService} from "./countries/country.service";
import {LoginComponent} from './auth/login.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    CitiesComponent,
    ChildComponent,
    CountriesComponent,
    CityEditComponent,
    CountryEditComponent,
    LoginComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NgbModule,
    DecimalPipe,
    CommonModule
  ],
  providers: [
    // provideAnimationsAsync(),
    // CityService,
    // CountryService,
    // AuthInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
