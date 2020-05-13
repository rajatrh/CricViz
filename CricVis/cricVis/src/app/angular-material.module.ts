import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [MatAutocompleteModule,
        MatSelectModule,
        MatInputModule],
    exports: [MatAutocompleteModule,
        MatSelectModule,
        MatInputModule]
})

export class AngularMaterialModule { }