import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { environment } from '../../environments/environment';
import { City } from './city';
import { Country } from '../countries/country';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BaseFormComponent} from "../base-form.component";




@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss'
})
export class CityEditComponent extends BaseFormComponent  implements OnInit {

  title?: string;
  // form!: FormGroup;
  city?: City;
  id?: number;
  countries?: Country[]; // salvo tutto l'elenco dei paesi

  constructor(private http: HttpClient, private activedRoute: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({  // ho messo anche la Validazione !!!!
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required) // i validatori async verranno controllati dopo aver
    }, null, this.isDupeCity());                          // controllato TUTTI i validatori sincroni quindi dopo
    this.loadData();                                      // tutti i Validators.required
  }


  loadData() {
    // load countries
    this.loadCountries();
    // retrieve the ID from the id parameter
    var idParam = this.activedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {
      // ritorno la città dal Server
      var url = environment.baseUrl + 'api/Cities/' + this.id;
      this.http.get<City>(url).subscribe({
        next: (result) => {
          this.city = result;
          this.title = "Edit - " + this.city.name;
          // update the form with the city value
          this.form.patchValue(this.city);
        }, error: (error) => console.error(error)
      });
    } else {
      // inserisco una nuova città
      this.title = "Create a new City";
    }
  }

  loadCountries() {
    var url = environment.baseUrl + 'api/Countries';
    var params = new HttpParams()
      .set('pageIndex', "0")
      .set('pageSize', "9999")
      .set('sortColumn', 'name')
      .set('sortOrder', 'asc');

    this.http.get<any>(url, { params }).subscribe({
      next: (result) => {
        this.countries = result.data;
      }, error: (error) => console.error(error)
    });
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      var url = environment.baseUrl + 'api/Cities/IsDupeCity';
      return this.http.post<boolean>(url, city).pipe(
        map(result => {
          return (result ? { isDupeCity: true } : null);
        }));
    }
  }



  onSubmit() {
    var city = (this.id) ? this.city : <City>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if (this.id) {
        // Edit mode
        var url = environment.baseUrl + 'api/Cities/' + city.id;
        this.http.put<City>(url, city).subscribe({
          next: (result) => {
            console.log("City " + city!.id + " has been updated");
            // go back to cities list
            this.router.navigate(['/cities']);
          }, error: (error) => console.error(error)
        });
      } else {
        // add NEW mode
        var url = environment.baseUrl + 'api/Cities';
        this.http.post<City>(url, city).subscribe({
          next: (result) => {
            console.log('City ' + result.id + ' has been created.');
            // go back to cities list
            this.router.navigate(['/cities']);
          }, error: (error) => console.error(error)
        });
      }
    }
  }
}
