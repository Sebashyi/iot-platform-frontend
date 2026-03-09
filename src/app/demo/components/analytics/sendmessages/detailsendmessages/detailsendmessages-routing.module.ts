import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailSendMessagesComponent} from './detailsendmessages.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DetailSendMessagesComponent },
    ])],
    exports: [RouterModule]
})
export class DetailSendMessagesRoutingModule { }
