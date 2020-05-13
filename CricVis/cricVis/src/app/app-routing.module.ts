import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataResolverService } from './shared/data-resolver.service';
import { AppComponent } from './app.component';
import { DashboardComponent } from './structure/dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve:{
      data: DataResolverService
    } 
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
