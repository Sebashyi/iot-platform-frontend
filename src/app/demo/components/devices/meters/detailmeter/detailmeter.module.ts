import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { DetailMeterComponent} from './detailmeter.component';
import { DetailMeterRoutingModule} from './detailmeter-routing.module';
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
import { TableModule } from 'primeng/table';

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
		DetailMeterRoutingModule,
		TableModule
	],
	declarations: [DetailMeterComponent]
})
export class DetailMeterModule { }
