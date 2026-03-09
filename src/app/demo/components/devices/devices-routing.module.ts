import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'meter', loadChildren: () => import('./meters/meter.module').then(m => m.MeterModule) },
        { path: 'gateway', loadChildren: () => import('./gateways/gateway.module').then(m => m.GatewayModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class DevicesRoutingModule { }
