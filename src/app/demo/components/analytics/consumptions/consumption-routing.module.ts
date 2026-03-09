import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsumptionComponent } from './consumption.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ConsumptionComponent },
	])],
	exports: [RouterModule]
})
export class ConsumptionRoutingModule { }
