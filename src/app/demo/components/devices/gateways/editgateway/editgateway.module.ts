import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from 'primeng/checkbox';
import { GoogleMapsModule } from "@angular/google-maps";
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { EditGatewayComponent } from './editgateway.component';
import { EditGatewayRoutingModule } from './editgateway-routing.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ChipsModule,
		DropdownModule,
		InputTextModule,
        CheckboxModule,
		GoogleMapsModule,
		RadioButtonModule,
		ToolbarModule,
        InputSwitchModule,
		DialogModule,
		ToastModule,
		ButtonModule,
		EditGatewayRoutingModule,
	],
	declarations: [EditGatewayComponent]
})
export class EditGatewayModule { }
