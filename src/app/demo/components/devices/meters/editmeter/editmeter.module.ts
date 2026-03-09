import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import {EditMeterComponent} from './editmeter.component';
import {EditMeterRoutingModule} from './editmeter-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { GoogleMapsModule } from "@angular/google-maps";
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DropdownModule,
		InputTextModule,
        CheckboxModule,
		GoogleMapsModule,
		RadioButtonModule,
		ToolbarModule,
		DialogModule,
		ToastModule,
		ButtonModule,
		EditMeterRoutingModule,
	],
	declarations: [EditMeterComponent]
})
export class EditMeterModule { }
