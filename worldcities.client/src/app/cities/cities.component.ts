import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from './city';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';




@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {
 
  //public cities!: City[];
  public cities!:MatTableDataSource<City>;
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.http.get<City[]>(environment.baseUrl + 'api/Cities').subscribe({
      next: (result) => {
        this.cities = new MatTableDataSource<City>(result);
        this.cities.paginator=this.paginator;
      }, error: (err) => console.error(err)
    });
  }

}


