import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeterComponent } from './meter.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MeterComponent },
        { path: 'register-meter', loadChildren: () => import('./registermeter/registermeter.module').then(m => m.RegisterMeterModule) },
        { path: 'edit-meter/:id', loadChildren: () => import('./editmeter/editmeter.module').then(m => m.EditMeterModule) },
        { path: 'detail-meter/:id', loadChildren: () => import('./detailmeter/detailmeter.module').then(m => m.DetailMeterModule) },
        { path: 'detail-message/:id', loadChildren: () => import('./detailmeter/detailmessage/detailmessage.module').then(m => m.DetailMessageModule) },
    ])],
    exports: [RouterModule]
})
export class MeterRoutingModule { }
