import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { SurgeonsComponent } from './surgeons/surgeons.component';
import { SurgeriesComponent } from './surgeries/surgeries.component';
import { SurgeryListComponent } from './surgery-list/surgery-list.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  {path:"",component:LoginComponent},
  { path: "pre-op", component: SurgeryListComponent },
  { path: "admin", component:AdminComponent},
  { path: "surgery", component: SurgeriesComponent},
  {path: "users", component:UsersComponent},
  {path: "surgeon", component:SurgeonsComponent},
  {path:"no-access",component:NoAccessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
