import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'sendMessages', loadChildren: () => import('./sendmessages/sendmessages.module').then(m => m.SendMessagesModule) },
        { path: 'consumption', loadChildren: () => import('./consumptions/consumption.module').then(m => m.ConsumptionModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
