import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GatewayService } from '../../../service/gateway.service';
import { Gateway } from '../../../api/gateway.model';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EventCommunicationService } from '../../../service/event-communication.service';
import { co } from '@fullcalendar/core/internal-common';

@Component({
    templateUrl: './gateway.component.html',
    providers: [MessageService],
})
export class GatewayComponent implements OnInit {

    gateways: Gateway[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    selectedGateways: Gateway[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    gatewayDialog: boolean = false;
    deleteGatewayDialog: boolean = false;
    deleteGatewaysDialog: boolean = false;
    gateway: Gateway = {} as Gateway;
    submitted: boolean = false;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private readonly gatewayService: GatewayService,
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'uniqueKey', header: 'Code' },
            { field: 'serial', header: 'Serial' },
            { field: 'name', header: 'Name' },
            { field: 'type', header: 'Type' },
            { field: 'region', header: 'Region' },
            { field: 'subRed', header: 'Sub Red' },
            { field: 'state', header: 'State' },
            { field: 'classB', header: 'Class B' },
            { field: 'pktfwd', header: 'Pktfwd' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'longitude', header: 'Longitude' },
            { field: 'mqtt', header: 'MQTT' },
            { field: 'createdAt', header: 'Created At' },
            { field: 'uniqueKeyCompany', header: 'Company Code' },
            { field: 'comunication', header: 'Communication' },
            { field: 'macDirection', header: 'MAC Address' }
        ];
        this.getGateways();

        this.eventService.companyChange$.subscribe(() => {
            this.uniqueKeyCompany = localStorage.getItem('selectedCompanyId') || '';
            this.getGateways();
        });
    }

    openNew() {
        this.router.navigate(['/devices/gateway/register-gateway']);
    }

    deleteSelectedGateways() {
        this.deleteGatewaysDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteGatewaysDialog = false;

        const deleteRequests = this.selectedGateways.map(gateway =>
            this.gatewayService.deleteGateway(gateway.uniqueKey).toPromise()
        );
        Promise.all(deleteRequests)
            .then(() => {
                this.gateways = this.gateways.filter(val => !this.selectedGateways.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Gateways Eliminados', life: 3000 });
                this.selectedGateways = [];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los gateways seleccionados.' });
            });
    }

    confirmDelete() {
        this.deleteGatewayDialog = false;
        this.gatewayService.deleteGateway(this.gateway.uniqueKey).subscribe({
            next: () => {
                this.gateways = this.gateways.filter(val => val.uniqueKey !== this.gateway.uniqueKey);
                this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Gateway Eliminado', life: 3000 });
                this.gateway = {} as Gateway;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el gateway.' });
            }
        });
    }


    hideDialog() {
        this.gatewayDialog = false;
        this.submitted = false;
    }

    findIndexByUniqueKey(uniqueKey: string): number {
        let index = -1;
        for (let i = 0; i < this.gateways.length; i++) {
            if (this.gateways[i].uniqueKey === uniqueKey) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openEdit(gateway: Gateway) {
        this.router.navigate([`/devices/gateway/edit-gateway/${gateway.uniqueKey}`]);
    }

    getGateways() {
        this.loading = true;

        this.gatewayService.getGatewaysByCompany(this.uniqueKeyCompany).subscribe({
            next: (data) => {
                if (!data || data.length === 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sin datos',
                        detail: 'No hay gateways registrados para esta compañía.',
                        life: 3000
                    });
                    this.gateways = [];
                } else {
                    this.gateways = data;
                }
                this.loading = false;
            },
            error: (err) => {
                if (err.status === 404) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'No encontrados',
                        detail: 'No se encontraron gateways para la compañía.',
                        life: 3000
                    });
                    this.gateways = [];
                } else if (err.status === 500) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error del servidor',
                        detail: 'Error interno del servidor al intentar obtener los gateways.',
                        life: 3000
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error desconocido',
                        detail: 'Ocurrió un error al obtener los gateways.',
                        life: 3000
                    });
                }

                this.loading = false;
            }
        });
    }

}
