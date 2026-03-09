import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterGatewayComponent } from './registergateway.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: RegisterGatewayComponent }
	])],
	exports: [RouterModule]
})
export class RegisterGatewayRoutingModule { }
