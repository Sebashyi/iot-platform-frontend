import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageDecoded } from '../../../../../api/message-decoded.model';
import { MessagesService } from '../../../../../service/messages.service';
import { DateFormatService } from '../../../../../service/dateformat.service';
import { ModelService } from '../../../../../service/model.service';

@Component({
    selector: 'app-detail-message',
    templateUrl: './detailmessage.component.html',
    providers: [MessageService, DatePipe]
})
export class DetailMessageComponent implements OnInit {


    cols: any[] = [];
    loading: boolean = true;
    messages: MessageDecoded[] = [];

    constructor(
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly datePipe: DatePipe,
        private readonly messagesService: MessagesService,
        private readonly dateFormatService: DateFormatService,
        private readonly modelService: ModelService
    ) { }

    ngOnInit(): void {
        this.cols = [
            { field: 'uniqueKey', header: 'uniqueKey' },
        ];
        const messageDecodedId = this.route.snapshot.paramMap.get('id');
        const model = this.route.snapshot.queryParamMap.get('model');
        if (!model) {
            this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener el modelo del medidor.',
            life: 3000
            });
            return;
        }
        this.getMessageDecoded(messageDecodedId, model);
    }

    onGoBack(): void {
        this.location.back();
    }

    getMessageDecoded(id: string, model: string): void {
        this.loading = true;
        this.messages = [];
        this.modelService.getBrandByModelName(model).subscribe({
            next: brandData => {
                if (brandData === 'Bove') {
                    this.messagesService.getAllMessagesDecodedBoveById(id).subscribe({
                        next: data => {
                            if (data) {
                                if (data.createdAt) {
                                    data.createdAt = this.dateFormatService.formatDate(data.createdAt) as any;
                                }
                                this.messages = [data];
                            } else {
                                console.error('El dato recibido no es válido:', data);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'El formato de los datos recibidos no es válido.',
                                    life: 3000
                                });
                            }
                            this.loading = false;
                            console.log('Mensaje Bove:', this.messages);
                        },
                        error: error => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo cargar el mensaje de Bove.',
                                life: 3000
                            });
                            this.loading = false;
                        }
                    });
                } else if (brandData === 'Younio') {
                    this.messagesService.getAllMessagesDecodedYounioById(id).subscribe({
                        next: data => {
                            if (data) {
                                if (data.createdAt) {
                                    data.createdAt = this.dateFormatService.formatDate(data.createdAt) as any;
                                }
                                this.messages = [data];
                            } else {
                                console.error('El dato recibido no es válido:', data);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'El formato de los datos recibidos no es válido.',
                                    life: 3000
                                });
                            }
                            this.loading = false;
                            console.log('Mensaje Younio:', this.messages);
                        },
                        error: error => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo cargar el mensaje de Younio.',
                                life: 3000
                            });
                            this.loading = false;
                        }
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Marca no soportada.',
                        life: 3000
                    });
                    this.loading = false;
                }
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener la marca del medidor.',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }
}
