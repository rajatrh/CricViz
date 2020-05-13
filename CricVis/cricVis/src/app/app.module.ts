import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { } from '@angular/cdk'
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';

import { DataResolverService } from './shared/data-resolver.service';
import { CommonDataService } from './shared/common-data.service';
import { FiltersComponent } from './structure/control-bar/filters/filters.component';
import { PlayerDropdownComponent } from './structure/control-bar/player-dropdown/player-dropdown.component';
import { DashboardComponent } from './structure/dashboard/dashboard/dashboard.component';
import { ParallelCoordComponent } from './charts/parallel-coord/parallel-coord.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader.service';
import { LoaderInterceptorService } from './shared/loader-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    FiltersComponent,
    PlayerDropdownComponent,
    DashboardComponent,
    ParallelCoordComponent,
    LoaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [CommonDataService,DataResolverService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
