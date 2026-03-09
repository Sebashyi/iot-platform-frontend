import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextModule } from "primeng/inputtext";
import { ToolbarModule } from 'primeng/toolbar';
import { RegisterUserComponent } from './registeruser.component';
import { RegisterUserRoutingModule } from './registeruser-routing.module';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DropdownModule,
		MultiSelectModule,
		InputTextModule,
		ToolbarModule,
		PasswordModule, 
		ToastModule,
		DialogModule,
		ButtonModule,
		RegisterUserRoutingModule
	],
	declarations: [RegisterUserComponent]
})
export class RegisterUserModule { }
