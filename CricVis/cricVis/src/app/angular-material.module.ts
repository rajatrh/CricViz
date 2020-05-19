import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    imports: [MatAutocompleteModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule],
    exports: [MatAutocompleteModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule]
})

export class AngularMaterialModule { }