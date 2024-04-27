import { Component, OnInit } from '@angular/core';
import { City } from './city';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}


