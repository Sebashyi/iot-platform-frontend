import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from "primeng/inputtext";
import { ToolbarModule } from 'primeng/toolbar';
import { RegisterCompanyComponent } from './registercompany.component';
import { RegisterCompanyRoutingModule } from './registercompany-routing.module';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		InputTextModule,
		ToolbarModule,
		ToastModule,
		DialogModule,
		RippleModule,
		TooltipModule,
		ButtonModule,
		RegisterCompanyRoutingModule,
	],
	declarations: [RegisterCompanyComponent]
})
export class RegisterCompanyModule { }
