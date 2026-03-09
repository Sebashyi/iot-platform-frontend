import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterMeterComponent } from './registermeter.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RegisterMeterComponent }
	])],
	exports: [RouterModule]
})
export class RegisterMeterRoutingModule { }
