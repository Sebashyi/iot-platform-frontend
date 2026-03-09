import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterCompanyComponent } from './registercompany.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RegisterCompanyComponent }
	])],
	exports: [RouterModule]
})
export class RegisterCompanyRoutingModule { }
