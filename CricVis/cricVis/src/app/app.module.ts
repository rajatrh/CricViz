import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { } from '@angular/cdk'
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';

import { DataResolverService } from './shared/data-resolver.service';
import { CommonDataService } from './shared/common-data.service';
import { ControlBarComponent } from './structure/control-bar/control-bar.component';
import { PlayerDropdownComponent } from './structure/control-bar/components/player-dropdown/player-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    ControlBarComponent,
    PlayerDropdownComponent
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
  providers: [CommonDataService,DataResolverService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
