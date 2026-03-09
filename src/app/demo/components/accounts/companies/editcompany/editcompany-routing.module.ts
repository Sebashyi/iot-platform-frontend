import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditCompanyComponent } from './editcompany.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditCompanyComponent }
	])],
	exports: [RouterModule]
})
export class EditCompanyRoutingModule { }
