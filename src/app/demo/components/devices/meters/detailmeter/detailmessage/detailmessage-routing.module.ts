import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailMessageComponent } from './detailmessage.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DetailMessageComponent },
    ])],
    exports: [RouterModule]
})
export class DetailMessageRoutingModule { }
