import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';


@NgModule({
    imports: [
        CommonModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        CompanyRoutingModule, 
        ToastModule
    ],
    declarations: [CompanyComponent]
})
export class CompanyModule { }
