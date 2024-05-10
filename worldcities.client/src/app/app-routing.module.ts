import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'
import {HomeComponent} from './home/home.component';
import {CitiesComponent} from './cities/cities.component';
import {CountriesComponent} from './countries/countries.component';
import {CityEditComponent} from './cities/city-edit.component';
import {NgbdTableComplete} from './complete/table-complete';
import {CountryEditComponent} from "./countries/country-edit.component";
import {LoginComponent} from "./auth/login.component";


const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'cities', component: CitiesComponent},
  {path: 'city/:id', component: CityEditComponent},
  {path: 'city', component: CityEditComponent},
  {path: 'countries', component: CountriesComponent},
  {path: 'country/:id', component: CountryEditComponent},
  {path: 'country', component: CountryEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
