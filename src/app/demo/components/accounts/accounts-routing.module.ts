import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'company', loadChildren: () => import('./companies/company.module').then(m => m.CompanyModule) },
        { path: 'user', loadChildren: () => import('./users/user.module').then(m => m.UserModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AccountsRoutingModule { }
