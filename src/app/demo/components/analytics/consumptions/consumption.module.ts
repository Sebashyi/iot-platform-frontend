import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from 'primeng/checkbox';
import { GoogleMapsModule } from "@angular/google-maps";
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ConsumptionComponent} from './consumption.component';
import { ConsumptionRoutingModule} from './consumption-routing.module';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		InputTextModule,
        CheckboxModule,
		GoogleMapsModule,
		RadioButtonModule,
		ToolbarModule,
		ButtonModule,
		DialogModule,
		ToastModule,
		PanelModule,
		TabViewModule,
		ChartModule,
		SliderModule,
		CalendarModule,
		DropdownModule,
		TableModule,
		SelectButtonModule,
		ConsumptionRoutingModule,
	],
	declarations: [ConsumptionComponent]    
})
export class ConsumptionModule { }
