import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Country } from './country';
import { CountryService } from './country.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ngbd-table-complete',
  standalone: true,
  imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, CommonModule],
  templateUrl: './table-complete.html',
  providers: [CountryService, DecimalPipe],
})
export class NgbdTableComplete implements OnInit {
  countries$: Observable<Country[]>;
  countriesList!: Country[];
  //COUNTRIES!: Country[];
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(public service: CountryService, private http: HttpClient) {
    this.countries$ = service.countries$;
    this.total$ = service.total$;
  }
  ngOnInit(): void {
    var url = environment.baseUrl + 'api/Countries';
    this.http.get<any>(url).subscribe({
      next: (result) => {
        this.total$ = result.totalCount;
        this.countriesList = result.data;

      }, error: (error) => console.error(error)
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
