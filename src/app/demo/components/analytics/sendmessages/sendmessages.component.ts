import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EventCommunicationService } from '../../../service/event-communication.service';
import { Message } from '../../../api/message.model';
import { DatePipe } from '@angular/common';
import { MessagesService } from '../../../service/messages.service';
import { DateFormatService } from '../../../service/dateformat.service';
import { MeterService } from '../../../service/meter.service';

@Component({
    templateUrl: './sendmessages.component.html',
    providers: [MessageService, DatePipe],
})
export class SendMessagesComponent implements OnInit {

    messages: Message[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    message: any[] = [];
    submitted: boolean = false;
    selectedMessages: Message[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    filteredMessages: Message[] = [];
    data: Message[] = [];
    meterSerials: string[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly eventService: EventCommunicationService,
        private readonly datePipe: DatePipe,
        private readonly messagesService: MessagesService,
        private readonly dateFormatService: DateFormatService,
        private readonly meterService: MeterService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'number', header: 'Number' },
            { field: 'name', header: 'Name' },
            { field: 'typeMessage', header: 'Type Message' },
            { field: 'decoded_value', header: 'Decoded Value' },
            { field: 'gateway', header: 'Gateway' },
            { field: 'date', header: 'Date' }
        ];
        this.getMeterSerials();

        this.eventService.companyChange$.subscribe(() => {
            this.uniqueKeyCompany = localStorage.getItem('selectedCompanyId') || '';
            this.getMeterSerials();
        });
        this.messages = this.data;
        this.filteredMessages = [...this.messages];
    }

    hideDialog() {
        this.submitted = false;
    }

    findIndexByUniqueKey(number: string): number {
        let index = -1;
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].uniqueKey === number) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openDetail(message: Message) {
        this.router.navigate([`/analytics/sendMessages/message-detail/${message.uniqueKey}`]);
    }

    updateTable() {
        this.getMeterSerials();
    }

    filterByDateRange() {
        if (this.startDate && this.endDate) {
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);
            endDate.setHours(23, 59, 59, 999);
            this.getMeterSerials();

            this.filteredMessages = this.messages.filter(message => {
                const messageDate = new Date(message.createdAt);

                return messageDate >= startDate && messageDate <= endDate;
            });

            console.log('Filtered Messages:', this.filteredMessages);
            this.messages = this.filteredMessages;
        } else {
            this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'No se ha seleccionado ningún rango de fecha.' });
        }
    }


    clearFilters() {
        this.startDate = null;
        this.endDate = null;
        this.filteredMessages = [...this.messages];
        this.messages = this.data;
    }

    getMeterSerials(): void {
        this.messages = [];

        if (!this.uniqueKeyCompany) {
            console.warn('No se ha seleccionado una compañía');
            this.meterSerials = [];
            return;
        }

        this.meterService.getMeterSerialsByCompany(this.uniqueKeyCompany).subscribe({
            next: (serials) => {
                if (!serials || serials.length === 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sin seriales',
                        detail: 'No se encontraron seriales de medidores para esta compañía.',
                        life: 3000
                    });
                    this.meterSerials = [];
                    return;
                }

                this.meterSerials = serials;
                this.getMessagesBySerials(this.meterSerials);
            },
            error: (error) => {
                switch (error.status) {
                    case 400:
                        console.error('🔴 Error completo:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Solicitud inválida',
                            detail: 'El ID de la compañía no es válido.',
                            life: 3000
                        });
                        break;
                    case 404:
                        console.error('🔴 Error completo:', error);
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'No encontrados',
                            detail: 'No se encontraron medidores para esta compañía.',
                            life: 3000
                        });
                        this.meterSerials = [];
                        break;
                    case 500:
                        console.error('🔴 Error completo:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error del servidor',
                            detail: 'Ocurrió un error interno al intentar obtener los seriales.',
                            life: 3000
                        });
                        break;
                    default:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error desconocido',
                            detail: 'No se pudieron obtener los seriales de medidores.',
                            life: 3000
                        });
                }

                this.meterSerials = [];
            }
        });
    }


    getMessagesBySerials(serials: string[]): void {
        this.loading = true;
        this.messagesService.getMessagesBySerials(serials).subscribe({
            next: data => {
                this.messages = data.map(message => {
                    return {
                        ...message,
                        date: this.dateFormatService.formatDate(message.createdAt)
                    };
                });
                this.filteredMessages = [...this.messages];
                this.loading = false;
            },
            error: error => {
                console.error('Error al obtener mensajes por seriales:', error);
                this.loading = false;

                // Verificar si el error es 404 Not Found
                if (error.status === 404) {
                    this.messages = [];
                    this.filteredMessages = [];
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Información',
                        detail: 'No existen mensajes para los medidores seleccionados',
                        life: 3000
                    });
                } else {
                    // Para otros tipos de errores, mostrar mensaje de error
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los mensajes por seriales',
                        life: 3000
                    });
                }
            }
        });
    }
}