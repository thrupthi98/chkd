import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { PatientComponent } from './patient/patient.component';
import { SurgeonsComponent } from './surgeons/surgeons.component';
import { SurgeriesComponent } from './surgeries/surgeries.component';
import { SurgeryListComponent } from './surgery-list/surgery-list.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  {path:"",component:HomeComponent},
  {path: "pre-op", component: SurgeryListComponent },
  {path: "admin", component:AdminComponent},
  {path: "surgery", component: SurgeriesComponent},
  {path: "users", component:UsersComponent},
  {path: "surgeon", component:SurgeonsComponent},
  {path:"no-access",component:NoAccessComponent},
  {path:"patient", component:PatientComponent},
  {path:"analytics", component:AnalyticsComponent},
  {path:'**',component:HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
