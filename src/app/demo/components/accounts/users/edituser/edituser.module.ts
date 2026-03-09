import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { EditUserComponent } from './edituser.component';
import { EditUserRoutingModule } from './edituser-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
		InputTextModule,
		ButtonModule,
        EditUserRoutingModule
    ],
    declarations: [EditUserComponent]
})
export class EditUserModule { }
