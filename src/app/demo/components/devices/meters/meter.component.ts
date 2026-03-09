import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MeterService } from '../../../service/meter.service';
import { Meter } from '../../../api/meter.model';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EventCommunicationService } from '../../../service/event-communication.service';
import * as Papa from 'papaparse';
import { FileUpload } from 'primeng/fileupload';

@Component({
    templateUrl: './meter.component.html',
    providers: [MessageService],
})
export class MeterComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: FileUpload;
    meters: Meter[] = [];
    items: MenuItem[] = [];
    cols: any[] = [];
    selectedMeters: Meter[] = [];
    loading: boolean = true;
    uniqueKeyCompany: string = localStorage.getItem('selectedCompanyId') || '';
    meterDialog: boolean = false;
    deleteMetersDialog: boolean = false;
    meter: Meter = {} as Meter;
    submitted: boolean = false;
    dialogTableVisible: boolean = false;
    importMeters: Meter[] = [];
    private csvFile: File | null = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private readonly meterService: MeterService,
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'uniqueKey', header: 'Unique Key' },
            { field: 'name', header: 'Name' },
            { field: 'devEui', header: 'Device EUI' },
            { field: 'serial', header: 'Serial' },
            { field: 'diameter', header: 'Diameter' },
            { field: 'createdAt', header: 'Created At' },
            { field: 'typeCommunication', header: 'Type of Communication' },
            { field: 'state', header: 'State' },
            { field: 'model', header: 'Model' },
            { field: 'classSupport', header: 'Class Support' },
            { field: 'lastComunication', header: 'Last Communication' },
            { field: 'valveState', header: 'Valve State' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'longitude', header: 'Longitude' },
            { field: 'companyUniqueKey', header: 'Company Unique Key' },
            { field: 'typeProduct', header: 'Type of Product' },
            { field: 'subRed', header: 'Sub Red' },
            { field: 'appSkey', header: 'App Skey' },
            { field: 'appKey', header: 'App Key' },
            { field: 'nwkSkey', header: 'NWK Skey' },
            { field: 'devAddr', header: 'Device Address' },
            { field: 'directionGprs', header: 'GPRS Direction' },
            { field: 'authenticationType', header: 'Authentication Type' },
            { field: 'euiAplication', header: 'EUI Application' },
            { field: 'imei', header: 'IMEI' },
            { field: 'serialNumberGprs', header: 'Serial Number GPRS' },
            { field: 'gatewayUniqueKey', header: 'Gateway Unique Key' },
            { field: 'region', header: 'Region' },
            { field: 'detail', header: 'Detail' },
        ];

        this.getMeters();

        this.eventService.companyChange$.subscribe(() => {
            this.uniqueKeyCompany = localStorage.getItem('selectedCompanyId') || '';
            this.getMeters();
        });
    }

    openNew() {
        this.router.navigate(['/devices/meter/register-meter']);
    }

    deleteSelectedMeters() {
        this.deleteMetersDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteMetersDialog = false;

        const deleteRequests = this.selectedMeters.map(meter =>
            this.meterService.deleteMeterById(meter.uniqueKey).toPromise()
        );

        Promise.all(deleteRequests)
            .then(() => {
                this.meters = this.meters.filter(val => !this.selectedMeters.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Medidores Eliminados', life: 3000 });
                this.selectedMeters = [];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los medidores seleccionados.' });
            });
    }


    hideDialog() {
        this.meterDialog = false;
        this.submitted = false;
    }

    findIndexByUniqueKey(uniqueKey: string): number {
        let index = -1;
        for (let i = 0; i < this.meters.length; i++) {
            if (this.meters[i].uniqueKey === uniqueKey) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getMeters() {
        this.loading = true;

        this.meterService.getMetersByCompany(this.uniqueKeyCompany).subscribe({
            next: (data) => {
                if (!data || data.length === 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sin medidores',
                        detail: 'No se encontraron medidores registrados para esta compañía.',
                        life: 3000
                    });
                    this.meters = [];
                } else {
                    this.meters = data;
                }
                this.loading = false;
            },
            error: (err) => {
                switch (err.status) {
                    case 400:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Solicitud inválida',
                            detail: 'El ID de la compañía es inválido.',
                            life: 3000
                        });
                        break;
                    case 404:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'No encontrados',
                            detail: 'No se encontraron medidores para esta compañía.',
                            life: 3000
                        });
                        this.meters = [];
                        break;
                    case 500:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error del servidor',
                            detail: 'Error interno del servidor al intentar obtener los medidores.',
                            life: 3000
                        });
                        break;
                    default:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error desconocido',
                            detail: 'Ocurrió un error al obtener los medidores. No se pudo establecer comunicación con el servidor.',
                            life: 3000
                        });
                }

                this.loading = false;
            }
        });
    }


    goToDetail(meter: Meter) {
        this.router.navigate([`/devices/meter/detail-meter/${meter.uniqueKey}`]);
    }

    showTable() {
        this.dialogTableVisible = true;
    }

    handleFileSelect(event: any) {
        this.csvFile = event.files[0];
        if (this.csvFile) {
            Papa.parse(this.csvFile, {
                complete: (result) => {
                    const metersData: Meter[] = result.data.map((row: any) => ({
                        uniqueKey: row['Unique Key'],
                        name: row['Name'],
                        devEui: row['Device EUI'],
                        serial: row['Serial'],
                        diameter: row['Diameter'],
                        createdAt: row['Created At'],
                        state: row['State'] === 'true',
                        typeCommunication: row['Type of Communication'],
                        last_reading: parseFloat(row['Last Reading']) || 0,
                        model: row['Model'],
                        classSupport: row['Class Support'],
                        battery_percentage: row['Battery Percentage'],
                        last_comunication: row['Last Communication'] || null,
                        valveState: row['Valve State'],
                        latitude: parseFloat(row['Latitude']) || 0,
                        longitude: parseFloat(row['Longitude']) || 0,
                        companyUniqueKey: row['Company Unique Key'],
                        typeProduct: row['Type of Product'],
                        subRed: row['Sub Red'],
                        appSkey: row['App Skey'],
                        appKey: row['App Key'],
                        nwkSkey: row['NWK Skey'],
                        devAddr: row['Device Address'],
                        directionGprs: row['GPRS Direction'],
                        authenticationType: row['Authentication Type'],
                        eui_aplication: row['EUI Application'],
                        imei: row['IMEI'],
                        serialNumberGprs: row['Number Serial'],
                        gatewayUniqueKey: row['Gateway Unique Key'],
                        region: row['Region'],
                    }));
                    this.importMeters = metersData;
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Datos importados correctamente', life: 3000 });
                },
                header: true,
                skipEmptyLines: true
            });
        }
    }

    saveImportedMeters() {
        this.dialogTableVisible = false;
        this.fileUpload.clear();
        this.meterService.uploadCSV(this.csvFile).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Medidores guardados correctamente',
                    life: 3000
                });
                this.importMeters = response;
                this.getMeters();
                this.csvFile = null;
                this.importMeters = [];
            },
            (error) => {
                console.error(error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un problema al guardar los datos',
                    life: 3000
                });
                this.csvFile = null;
                this.importMeters = [];
            }
        );
    }

    cleanFile() {
        this.fileUpload.clear();
        this.csvFile = null;
        this.importMeters = [];
    }
}
