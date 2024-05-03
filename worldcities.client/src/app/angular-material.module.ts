import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import{MatTableModule} from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";


@NgModule({
    imports:[
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        MatInputModule,
        MatSortModule,
        MatSelectModule
    ],
    exports:[
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        MatInputModule,
        MatSortModule,
        MatSelectModule
    ]
})
export class AngularMaterialModule{}