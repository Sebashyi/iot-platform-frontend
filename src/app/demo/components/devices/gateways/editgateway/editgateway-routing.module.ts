import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditGatewayComponent } from './editgateway.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditGatewayComponent }
	])],
	exports: [RouterModule]
})
export class EditGatewayRoutingModule { }
