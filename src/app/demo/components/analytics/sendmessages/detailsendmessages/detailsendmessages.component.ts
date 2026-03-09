import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Message } from '../../../../api/message.model';
import { MessagesService } from '../../../../service/messages.service';
import { DateFormatService } from '../../../../service/dateformat.service';

@Component({
    templateUrl: './detailsendmessages.component.html',
    providers: [MessageService],
})
export class DetailSendMessagesComponent implements OnInit {

    messages: Message[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    gatewayDialog: boolean = false;
    deleteGatewayDialog: boolean = false;
    deleteGatewaysDialog: boolean = false;
    submitted: boolean = false;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly messagesService: MessagesService,
        private readonly dateFormatService: DateFormatService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'uniqueKey', header: 'Code' },
            { field: 'serial', header: 'Serial' },
            { field: 'name', header: 'Name' },
        ];
        const messageId = this.route.snapshot.paramMap.get('id');
        console.log('id', messageId);

        this.messagesService.getMessageById(messageId).subscribe({
            next: (message: Message) => {
                if (message.createdAt) {
                    message.createdAt = this.dateFormatService.formatDate(message.createdAt) as any;
                }
                this.messages = [message];
                console.log('message', this.messages);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching message:', err);
                this.loading = false;
            }
        });
    }

    onGoBack(): void {
        this.location.back();
    }
}
