import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataResolverService } from './shared/data-resolver.service';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve:{
      cres: DataResolverService
    } 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
