import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SurgeryListComponent } from './surgery-list/surgery-list.component';
import { DialogComponent } from './surgery-list/dialog/dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { SurgeriesComponent } from './surgeries/surgeries.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { SurgeonsComponent } from './surgeons/surgeons.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';


@NgModule({
  declarations: [
    AppComponent,
    SurgeryListComponent,
    DialogComponent,
    UsersComponent,
    SurgeriesComponent,
    LoginComponent,
    AdminComponent,
    NoAccessComponent,
    SurgeonsComponent,
    ResetPassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatListModule,
    MatCheckboxModule,
    MatSortModule,
    MatTabsModule,
    MatCardModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
