import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CompanyComponent },
		{ path: 'register-company', loadChildren: () => import('./registercompany/registercompany.module').then(m => m.RegisterCompanyModule) },
		{ path: 'edit-company/:id', loadChildren: () => import('./editcompany/editcompany.module').then(m => m.EditCompanyModule) },
	])],
	exports: [RouterModule]
})
export class CompanyRoutingModule { }
