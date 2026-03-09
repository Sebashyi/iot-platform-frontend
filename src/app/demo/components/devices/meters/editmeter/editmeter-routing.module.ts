import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditMeterComponent } from './editmeter.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditMeterComponent }
	])],
	exports: [RouterModule]
})
export class EditMeterRoutingModule { }
