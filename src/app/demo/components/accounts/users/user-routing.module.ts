import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UserComponent },
		{ path: 'register-user', loadChildren: () => import('./registeruser/registeruser.module').then(m => m.RegisterUserModule) },
		{ path: 'edit-user/:id', loadChildren: () => import('./edituser/edituser.module').then(m => m.EditUserModule) },
	])],
	exports: [RouterModule]
})
export class UserRoutingModule { }
