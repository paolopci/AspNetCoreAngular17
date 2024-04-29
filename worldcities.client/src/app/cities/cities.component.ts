import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { City } from './city';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent implements OnInit {

  //public cities!: City[];
  public cities!: MatTableDataSource<City>;
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  // valori di default 
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  // queste sono public because we need to use them from the HTML template via two-way data binding
  public defaultSortColumn: string = 'name';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // per eseguire l'ordinamento dei dati ritornati
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.loadData();
  }

  getData(event: PageEvent) {
    var url = environment.baseUrl + 'api/Cities';
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString()) // xchè HttpParams è immutabile !!!!!!
      .set('pageSize', event.pageSize.toString())
      .set('sortColumn', (this.sort) ? this.sort.active : this.defaultSortColumn)
      .set('sortOrder', (this.sort) ? this.sort.direction : this.defaultSortOrder);
    this.http.get<any>(url, { params }).subscribe({
      next: (result) => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.cities = new MatTableDataSource<City>(result.data);
      }, error: (error) => console.error(error)
    });
  }

  loadData() {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }
}