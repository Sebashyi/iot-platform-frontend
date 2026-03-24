import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription, debounceTime, firstValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MeterService } from '../../service/meter.service';
import 'chartjs-plugin-datalabels';
import { GatewayService } from '../../service/gateway.service';
import { EventCommunicationService } from '../../service/event-communication.service';
import { Router } from '@angular/router';
import { MessagesService } from '../../service/messages.service';
import { DatePipe } from '@angular/common';
import { ConsumptionService } from '../../service/consumption.service';
import { DateFormatService } from '../../service/dateformat.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [MessageService, DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {

    Math = Math;

    messages: any[] = [];
    items!: MenuItem[];
    companyUniqueKey = localStorage.getItem('selectedCompanyId');
    metersData: any = [];
    metersOptions: any;
    markerPositions: google.maps.LatLngLiteral[] = [];
    markerOptions: google.maps.MarkerOptions[] = [];
    metersLocations: any = [];
    totalMeters: number;
    gatewaysData: any = [];
    gatewaysOptions: any;
    totalGateways: number;
    barOptions: any;
    lat: number = -0.345638;
    lng: number = -78.447889;
    zoom = 10;
    center = { lat: this.lat, lng: this.lng };
    mapOptions: google.maps.MapOptions = {
        scrollwheel: true,
        gestureHandling: 'auto',
        zoomControl: true,
    };
    barData: any;
    lineData: any;
    lineOptions: any;
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    averageConsumptions: any[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    filteredData: any[] = [];

    averageConsumption: number = 0;
    differenceFromLastPeriod: number = 0;

    constructor(private readonly layoutService: LayoutService, private readonly meterService: MeterService, private readonly gatewayService: GatewayService, private readonly eventService: EventCommunicationService, private readonly router: Router, private readonly messageService: MessageService, private readonly messagesService: MessagesService, private readonly datePipe: DatePipe, private readonly consumptionService: ConsumptionService, private readonly dateFormatService: DateFormatService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
                this.getLocationsMeters();
            });
    }

    ngOnInit() {
        this.initChart();
        this.initCharts();
        this.getLocationsMeters();
        this.eventService.companyChange$.subscribe(() => {
            this.reloadComponent();
        });
        this.getMessages();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

        this.meterService.getMeterStatusCount(this.companyUniqueKey).subscribe({
            next: (data) => {
                this.totalMeters = data.total_meters;
                this.metersData = {
                    labels: ['Activos: ' + data.active, 'Inactivos: ' + data.inactive],
                    datasets: [
                        {
                            data: [data.active, data.inactive],
                            backgroundColor: [
                                'rgba(59, 162, 245, 0.8)',
                                'rgba(0, 91, 168, 0.8)',
                            ],
                            hoverBackgroundColor: [
                                'rgba(34, 140, 245, 1)',
                                'rgba(29, 113, 184, 1)'
                            ]
                        }
                    ]
                };
                this.metersOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                color: 'black',

                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'center',
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            formatter: (value: number) => {
                                return value;
                            }
                        }
                    }
                };
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar datos de medidores.' });
            }
        });

        this.gatewayService.getGatewayStatusCount(this.companyUniqueKey).subscribe({
            next: (data) => {
                this.totalGateways = data.total_gateways;
                this.gatewaysData = {
                    labels: ['Activos: ' + data.active, 'Inactivos: ' + data.inactive],
                    datasets: [
                        {
                            data: [data.active, data.inactive],
                            backgroundColor: [
                                'rgba(59, 162, 245, 0.8)',
                                'rgba(0, 91, 168, 0.8)',
                            ],
                            hoverBackgroundColor: [
                                'rgba(34, 140, 245, 1)',
                                'rgba(29, 113, 184, 1)'
                            ]
                        }
                    ]
                };
                this.gatewaysOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                color: 'black',

                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'center',
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            formatter: (value: number) => {
                                return value;
                            }
                        }
                    }
                };
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar datos de gateways.' });
            }
        });

        this.lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    tension: .4
                }
            ]
        };

        this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                }
            ]
        };

        this.getConsumptionForDays();

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getLocationsMeters() {
        this.meterService.getMetersLocations(this.companyUniqueKey).subscribe({
            next: (data) => {
                console.log('Meters locations', data);
                this.metersLocations = data;
                this.addMarkersToMap();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las locaciones de los medidores.' });
            }
        });
    }

    addMarkersToMap(): void {
        this.markerPositions = this.metersLocations.map((location) => ({
            position: { lat: location.latitude, lng: location.longitude },
            title: location.name
        }));
    }

    reloadPage() {
        window.location.reload()
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }

    getMessages() {
        const alarmFields = [
            { key: 'lowBatteryAlarm', label: 'Batería baja' },
            { key: 'emptyPipeAlarm', label: 'Tubería vacía' },
            { key: 'reverseFlowAlarm', label: 'Flujo inverso' },
            { key: 'overRangeAlarm', label: 'Fuera de rango' },
            { key: 'overTempratureAlarm', label: 'Sobre temperatura' },
            { key: 'eepromError', label: 'Error EEPROM' },
            { key: 'leakageAlarm', label: 'Fuga' },
            { key: 'burstAlarm', label: 'Ruptura' },
            { key: 'tamperAlarm', label: 'Manipulación' },
            { key: 'freezingAlarm', label: 'Congelamiento' },
        ];

        this.messagesService.getAlertMessagesByCompany(this.companyUniqueKey).subscribe({
            next: (data) => {
                this.messages = data.map(msg => ({
                    uniqueKey: msg.uniqueKey,
                    createdAt: msg.createdAt ? this.dateFormatService.formatDate(msg.createdAt) : '',
                    serial: msg.serial,
                    alerts: alarmFields
                        .filter(alarm => (msg as any)[alarm.key] === true)
                        .map(alarm => alarm.label)
                }));
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo establecer conexión con el servidor', life: 3000 });
            }
        });
    }

    trackByFn(index: number, item: any) {
        return item.uniqueKey;
    }

    async getConsumptionForDays(): Promise<void> {
        const now = new Date();
        this.endDate = new Date(now);
        this.startDate = new Date(now.setDate(now.getDate() - 7));

        this.startDate.setHours(0, 0, 0, 0);
        this.endDate.setHours(23, 59, 59, 999);

        await this.loadConsumptionByDay();

        this.filteredData = this.averageConsumptions.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= this.startDate && itemDate <= this.endDate;
        });

        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const dailyConsumption: { [key: string]: number } = {};
        const currentDate = new Date(this.startDate);

        while (currentDate <= this.endDate) {
            const dateKey = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
            dailyConsumption[dateKey] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        this.filteredData.forEach(item => {
            const itemDate = new Date(item.date);
            const dateKey = `${itemDate.getDate()}-${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
            dailyConsumption[dateKey] += item.consumption;
        });

        this.calculateAverageConsumption(dailyConsumption);

        const labels = Object.keys(dailyConsumption)
            .sort((a, b) => {
                const [da, ma, ya] = a.split('-');
                const [db, mb, yb] = b.split('-');
                return new Date(+ya, +ma - 1, +da).getTime() - new Date(+yb, +mb - 1, +db).getTime();
            });

        this.chartData = {
            labels: labels.map(k => {
                const [d, m, y] = k.split('-');
                const date = new Date(+y, +m - 1, +d);
                const dow = date.toLocaleString('default', { weekday: 'short' });
                return `${d} ${dow}`;
            }),
            datasets: [{
                label: 'Consumo diario',
                data: labels.map(dateKey => {
                    return dailyConsumption[dateKey] ?? 0;
                }),
                borderColor: '#42A5F5',
                fill: false,
                tension: 0.1
            }]
        };
    }

    async loadConsumptionByDay(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getAllConsumptionByDay()
            );

            this.averageConsumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.dailyConsumption,
                devEui: item.devEui,
            }));

        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los consumos por día.', life: 3000 });
        }
    }

    calculateAverageConsumption(dailyConsumption: { [key: string]: number }): void {
        const today = new Date();
        const todayKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        const todayConsumption = dailyConsumption[todayKey] || 0;

        const uniqueDevEuis = new Set(
            this.filteredData
                .filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getDate() === today.getDate() &&
                        itemDate.getMonth() === today.getMonth() &&
                        itemDate.getFullYear() === today.getFullYear();
                })
                .map(item => item.devEui)
        );

        const numberOfMeters = uniqueDevEuis.size;

        this.averageConsumption = numberOfMeters > 0 ? todayConsumption / numberOfMeters : 0;

        this.averageConsumption = parseFloat(this.averageConsumption.toFixed(3));

        this.differenceFromLastPeriod = todayConsumption;
    }
}
