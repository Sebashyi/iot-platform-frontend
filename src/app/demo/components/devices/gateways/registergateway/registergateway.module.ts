import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
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
import { ButtonModule } from 'primeng/button';
import { RegisterGatewayComponent } from './registergateway.component';
import { RegisterGatewayRoutingModule } from './registergateway-routing.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		AutoCompleteModule,
		DropdownModule,
		InputTextModule,
        CheckboxModule,
		GoogleMapsModule,
		RadioButtonModule,
		ToolbarModule,
		ButtonModule,
        InputSwitchModule,
		DialogModule,
		ToastModule,
		RegisterGatewayRoutingModule,
	],
	declarations: [RegisterGatewayComponent]
})
export class RegisterGatewayModule { }
