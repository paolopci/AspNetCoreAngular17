import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { City } from './city';
import { Country } from '../countries/country';




@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss'
})
export class CityEditComponent implements OnInit {

  title?: string;
  form!: FormGroup;
  city?: City;
  id?: number;
  countries?: Country[]; // salvo tutto l'elenco dei paesi

  constructor(private http: HttpClient, private activedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl(''),
      countryId: new FormControl('')
    });
    this.loadData();
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
