import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'
import {HomeComponent} from './home/home.component';
import {CitiesComponent} from './cities/cities.component';
import {CountriesComponent} from './countries/countries.component';
import {CityEditComponent} from './cities/city-edit.component';
import {NgbdTableComplete} from './complete/table-complete';
import {CountryEditComponent} from "./countries/country-edit.component";


const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'cities', component: CitiesComponent},
  {path: 'country/:id', component: CountryEditComponent},
  {path: 'country', component: CountryEditComponent},
  {path: 'countries', component: CountriesComponent},
  {path: 'city/:id', component: CityEditComponent},
  {path: 'city', component: CityEditComponent},
  {path: 'demo', component: NgbdTableComplete},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
