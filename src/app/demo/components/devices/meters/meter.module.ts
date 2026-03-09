import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MeterComponent } from './meter.component';
import { MeterRoutingModule } from './meter-routing.module';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ToolbarModule,
		ButtonModule,
		PanelModule,
        TableModule,
        ButtonModule,
        ProgressBarModule,
        ToastModule,
		DialogModule,
		InputTextModule,
		FileUploadModule,
		MeterRoutingModule,
	],
	declarations: [MeterComponent]
})
export class MeterModule { }

