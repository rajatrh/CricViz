import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [MatAutocompleteModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule],
    exports: [MatAutocompleteModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule]
})

export class AngularMaterialModule { }