import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Country } from './country';


@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrl: './country-edit.component.scss'
})
export class CountryEditComponent implements OnInit {
  // view title 
  title?: string;
  // form model
  form!: FormGroup;
  // the country object to edit or create
  country?: Country;
  // the country object id, as fetched from the active route:
  // It's NULL when we're adding a new country,
  // and not NULL when we're editing an existing one.
  id?: number;
  // the countries array for the select
  countries?: Country[];

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField('name')],
      iso2: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)], this.isDupeField('iso2')],
      iso3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3}$/)], this.isDupeField('iso3')],
    });
    this.loadData();
  }

  isDupeField(name: string): AsyncValidatorFn { }

  loadData() {
    // retrieve the ID from the 'id' parameter
    var idParam = this.activeRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
  }
}
