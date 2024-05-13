import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Country} from './country';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {CountryService} from "./country.service";
import { MatTableDataSource } from '@angular/material/table';
import {AuthService} from "../auth/auth.service";


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent implements OnInit {
  //public countries!: MatTableDataSource<Country>;
  public countries!: MatTableDataSource<Country>;
  public isAuthenticated = false;
  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totCities'];
  // valori di default
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  // queste sono public because we need to use them from the HTML template via two-way data binding
  public defaultSortColumn: string = 'name';
  public defaultSortOrder: 'asc' | 'desc' = 'asc';
  public defaultFilterColumn: string = 'name'; // colonna filtro di default
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // per eseguire l'ordinamento dei dati ritornati
  @ViewChild(MatSort) sort!: MatSort
  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(private countryService: CountryService,private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadData();
    this.isAuthenticated=this.authService.isAuthenticated();
  }

  loadData(query?: string) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {

    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;

    this.countryService.getData(event.pageIndex, event.pageSize, sortColumn, sortOrder, filterColumn, filterQuery)
      .subscribe({
        next: (result) => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
            this.countries = new MatTableDataSource<Country>(result.data);
         // this.countries = result.data;
        }, error: (error) => console.error(error)
      });
  }

  // debounce filter text changes
  onFilterTextChanged(filterText: string) {
    if (!this.filterTextChanged.observed) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }

}
