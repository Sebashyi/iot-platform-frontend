import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {GatewayComponent} from './gateway.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GatewayComponent },
        { path: 'register-gateway', loadChildren: () => import('./registergateway/registergateway.module').then(m => m.RegisterGatewayModule) },
        { path: 'edit-gateway/:id', loadChildren: () => import('./editgateway/editgateway.module').then(m => m.EditGatewayModule) },
    ])],
    exports: [RouterModule]
})
export class GatewayRoutingModule { }
