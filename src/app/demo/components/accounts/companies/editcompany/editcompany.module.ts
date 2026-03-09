import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from 'primeng/checkbox';
import { GoogleMapsModule } from "@angular/google-maps";
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditCompanyComponent } from './editcompany.component';
import { EditCompanyRoutingModule } from './editcompany-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		InputTextareaModule,
		InputTextModule,
        CheckboxModule,
		GoogleMapsModule,
		RadioButtonModule,
		ToolbarModule,
		SplitButtonModule,
        InputSwitchModule,
        EditCompanyRoutingModule,
		DialogModule,
		ToastModule
	],
	declarations: [EditCompanyComponent]
})
export class EditCompanyModule { }
