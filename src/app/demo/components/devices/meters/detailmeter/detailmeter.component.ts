import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../../service/location.service';
import { Location, DatePipe } from '@angular/common';
import { Company } from '../../../../api/company.model'
import { Meter } from '../../../../api/meter.model';
import { CompanyService } from '../../../../service/company.service';
import { MeterService } from '../../../../service/meter.service';
import { Gateway } from '../../../../api/gateway.model';
import { GatewayService } from '../../../../service/gateway.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ChartData, ChartOptions } from 'chart.js';
import { MessagesService } from '../../../../service/messages.service';
import { MessageDecoded } from '../../../../api/message-decoded.model';
import { ConsumptionService } from '../../../../service/consumption.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { DateFormatService } from '../../../../service/dateformat.service';
import { LorawanDownlinksService } from '../../../../service/lorawan-downlinks.service';
import { ModelService } from '../../../../service/model.service';

@Component({
    selector: 'app-detail-meter',
    templateUrl: './detailmeter.component.html',
    styleUrls: ['./detailmeter.component.css'],
    providers: [MessageService, DatePipe]
})
export class DetailMeterComponent implements OnInit {

    selectedState: any = null;
    selectedCompany: any = null;
    selectedRegion: any = null;
    selectedTypeProduct: any = null;
    selectedSubRed: any = null;
    selectedGateway: any = null;
    valClassSupport: string = '';
    selectedComunication: string = ''; 
    typeAutentification: string = '';
    companies: Company[] = [];
    gateways: Gateway[] = [];
    lat: number = -0.345638;
    lng: number = -78.447889;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    meters: Meter[] = [];
    changeMeterDialog: boolean = false;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    data: any;
    optionsCurve: any;

    meter: Meter = {
        uniqueKey: undefined,
        name: '',
        devEui: '',
        serial: '',
        diameter: '',
        createdAt: undefined,
        typeCommunication: '',
        state: false,
        model: '',
        classSupport: '',
        lastCommunication: null,
        valveState: '',
        latitude: this.lat,
        longitude: this.lng,
        companyUniqueKey: '',
        typeProduct: '',
        subRed: '',
        appSkey: '',
        appKey: '',
        nwkSkey: '',
        devAddr: '',
        authenticationType: '',
        euiAplication: '',
        directionGprs: '',
        imei: '',
        serialNumberGprs: '',
        gatewayUniqueKey: '',
        region: '',
        detail: ''
    };
    dropdownItemsState = [
        { name: 'Activo', code: 'true' },
        { name: 'Inactivo', code: 'false' },
    ];
    dropdownItemsRegion = [
        { name: 'CN470', code: 'CN470' },
        { name: 'CN470PREQUEL', code: 'CN470PREQUEL' },
        { name: 'CN470PHOENIX', code: 'CN470PHOENIX' },
        { name: 'AS923MYS', code: 'AS923MYS' },
        { name: 'EU868', code: 'EU868' },
        { name: 'AS923', code: 'AS923' },
        { name: 'US915', code: 'US915' },
        { name: 'AU915', code: 'AU915' },
        { name: 'EU433', code: 'EU433' },
        { name: 'IN865', code: 'IN865' },
        { name: 'CN470ALID', code: 'CN470ALID' },
        { name: 'CN470ALIS', code: 'CN470ALIS' },
        { name: 'AS923IND', code: 'AS923IND' },
        { name: 'ID920', code: 'ID920' },
        { name: 'KR920', code: 'KR920' },
        { name: 'RU864', code: 'RU864' },
    ];
    dropdownItemsProductType = [
        { name: 'rhf3mr01', code: 'rhf3mr01' },
        { name: 'rhf3m485', code: 'rhf3m485' },
        { name: 'lorawan', code: 'lorawan' },
    ];
    dropdownItemsTypeGateway = [
        { name: 'Wi-Fi', code: 'WIFI' },
        { name: 'Ethernet', code: 'ETH' },
        { name: 'Bluetooth', code: 'BLU' },
        { name: 'Zigbee', code: 'ZIG' }
    ];
    dropdownItemsSubRed: { name: string; code: string }[] = [];
    activeTabIndex: number = 0;

    private readonly regionSubredMap: { [key: string]: { name: string; code: string }[] } = {
        'CN470': [
            { name: 'CH_00-07', code: 'CH_00-07' },
            { name: 'CH_08-15', code: 'CH_08-15' },
            { name: 'CH_16-23', code: 'CH_16-23' },
            { name: 'CH_24-31', code: 'CH_24-31' },
            { name: 'CH_32-39', code: 'CH_32-39' },
            { name: 'CH_40-47', code: 'CH_40-47' },
            { name: 'CH_48-55', code: 'CH_48-55' },
            { name: 'CH_56-63', code: 'CH_56-63' },
        ],
        'CN470PREQUEL': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'CN470PHOENIX': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'CN470ALID': [{ name: 'CH_08-15', code: 'CH_08-15' }],
        'CN470ALIS': [{ name: 'CH_08-15', code: 'CH_08-15' }],
        'AS923': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'AS923MYS': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'AS923IND': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'EU868': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'EU433': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'US915': [{ name: 'CH_00-07_64', code: 'CH_00-07_64' }],
        'AU915': [
            { name: 'CH_00-07_64', code: 'CH_00-07_64' },
            { name: 'CH_08-15_65', code: 'CH_08-15_65' },
        ],
        'IN865': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'KR920': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'RU864': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'ID920': [{ name: 'CH_00-07', code: 'CH_00-07' }],
    };
    labelsX: any;
    dataY: any[] = [];
    cities1: any[] = [];
    cities2: any[] = [];
    city1: any = null;
    city2: any = null;
    selectedCountry: any = null;
    selectedProvince: any = null;
    selectedCity: any = null;
    countries: any[] = [];
    provinces: any[] = [];
    cities: any[] = [];
    stateValve: number = 0;
    zoom = 18;
    center = { lat: this.lat, lng: this.lng };
    mapOptions: google.maps.MapOptions = {
        scrollwheel: true,
        gestureHandling: 'auto',
        zoomControl: true,
    };
    consumptions: any[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    interval: any = { label: 'Horas', value: 'hours' };
    compareEndDate: Date | null = null;
    chartData: ChartData;
    chartOptions: ChartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Tiempo'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Consumo (m³)'
                },
                beginAtZero: true
            }
        }
    };
    filteredData: any[] = [];

    intervalOptions = [
        { label: 'Horas', value: 'hours' },
        { label: 'Días', value: 'days' },
        { label: 'Meses', value: 'months' },
        { label: 'Años', value: 'years' }
    ];

    messages: MessageDecoded[] = [];
    cols: any[] = [];
    loading: boolean = true;

    visible: boolean = false;
    private allowedValues = [0, 10, 25, 50, 75, 100];

    constructor(
        private readonly locationService: LocationService,
        private readonly location: Location,
        private readonly companyService: CompanyService,
        private readonly meterService: MeterService,
        private readonly gatewayService: GatewayService,
        private readonly route: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly messagesService: MessagesService,
        private readonly datePipe: DatePipe,
        private readonly consumptionService: ConsumptionService,
        private readonly dateFormatService: DateFormatService,
        private readonly lorawanDownlinksService: LorawanDownlinksService,
        private readonly modelService: ModelService,
    ) { }

    ngOnInit(): void {
        this.locationService.getCountries().subscribe(data => {
            this.countries = data;
        });

        const meterId = this.route.snapshot.paramMap.get('id');
        if (meterId) {
            this.companyService.getCompanies().subscribe(companies => {
                this.companies = companies;
                this.loadSelectedMeter(meterId).then(() => {
                    this.getConsumptionForHours().then(() => {
                        this.chartData = {
                            labels: this.labelsX,
                            datasets: [{ label: 'Consumo', data: this.dataY, fill: false, borderColor: '#42A5F5', tension: 0.1 }]
                        };
                    });
                });
            });
            this.meterService.getMetersByCompany(this.companyKey).subscribe(data => {
                this.meters = data;
            });
        } else {
            this.getConsumptionForHours().then(() => {
                this.chartData = {
                    labels: this.labelsX,
                    datasets: [{ label: 'Consumo', data: this.dataY, fill: false, borderColor: '#42A5F5', tension: 0.1 }]
                };
            });
        }
    }

    onGoBack(): void {
        this.location.back();
    }

    onRegionChange(): void {
        this.selectedSubRed = null;
        this.dropdownItemsSubRed = this.selectedRegion
            ? (this.regionSubredMap[this.selectedRegion.code] ?? [])
            : [];
    }

    loadCompaniesMeters(): void {
        const meterId = this.route.snapshot.paramMap.get('id');

        this.companyService.getCompanies().subscribe({
            next: data => {
                this.companies = data;
                if (meterId) {
                    this.loadSelectedMeter(meterId).then(() => {
                        this.getConsumptionForHours().then(() => {
                            this.chartData = {
                                labels: this.labelsX,
                                datasets: [{ label: 'Consumo', data: this.dataY, fill: false, borderColor: '#42A5F5', tension: 0.1 }]
                            };
                        });
                    });
                } else {
                    this.getConsumptionForHours().then(() => {
                        this.chartData = {
                            labels: this.labelsX,
                            datasets: [{ label: 'Consumo', data: this.dataY, fill: false, borderColor: '#42A5F5', tension: 0.1 }]
                        };
                    });
                }
            },
            error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las empresas.', life: 3000 });
            }
        });

        this.meterService.getMetersByCompany(this.companyKey).subscribe({
            next: data => { this.meters = data; },
            error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los medidores.', life: 3000 });
            }
        });
    }

    loadGatewaysByCompany(companyKey: string): void {
        this.gatewayService.getGatewaysByCompany(companyKey).subscribe(data => {
            this.gateways = data;
            this.selectedGateway = this.gateways.find(item => item.uniqueKey === this.meter.gatewayUniqueKey);
        });
    }

    async loadSelectedMeter(meterId: string): Promise<void> {
        try {
            const data: Meter = await lastValueFrom(this.meterService.getMeterById(meterId));

            this.meter = data;

            if (this.meter.lastCommunication) {
                this.meter.lastCommunication = this.dateFormatService.formatDate(this.meter.lastCommunication) as any;
            }

            this.lat = this.meter.latitude;
            this.lng = this.meter.longitude;
            this.center = { lat: this.lat, lng: this.lng };

            this.stateValve = Number(this.meter.valveState);

            this.selectedCompany = this.companies.find(item => item.uniqueKey === this.meter.companyUniqueKey);
            this.selectedState = this.dropdownItemsState.find(item => item.code === this.meter.state.toString());
            this.selectedComunication = this.meter.typeCommunication;
            this.selectedRegion = this.dropdownItemsRegion.find(item => item.name === this.meter.region);
            this.dropdownItemsSubRed = this.selectedRegion
                ? (this.regionSubredMap[this.selectedRegion.code] ?? [])
                : [];
            this.selectedTypeProduct = this.dropdownItemsProductType.find(item => item.name === this.meter.typeProduct);
            this.selectedSubRed = this.dropdownItemsSubRed.find(item => item.name === this.meter.subRed);
            this.selectedGateway = this.gateways.find(item => item.uniqueKey === this.meter.gatewayUniqueKey);

            this.valClassSupport = this.meter.classSupport;
            this.typeAutentification = this.meter.authenticationType;

            await this.getMessagesForMeter();

        } catch (error) {
            console.error('Error al cargar medidor:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cargar el medidor.',
                life: 3000
            });
            throw error;
        }
    }

    openEdit(meter: Meter) {
        this.router.navigate([`/devices/meter/edit-meter/${meter.uniqueKey}`]);
    }

    updateChart(): void {
        if (!this.startDate || !this.endDate) {
            const now = new Date();
            this.startDate = new Date(now.setHours(now.getHours() - 24));
            this.endDate = new Date();
        }
        if (this.endDate) {
            this.compareEndDate = new Date(this.endDate);
            this.compareEndDate.setDate(this.compareEndDate.getDate() + 1);
        }
        this.chartData = {
            labels: this.labelsX,
            datasets: [{
                label: 'Consumo',
                data: [],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.1
            }]
        };
        if (!this.startDate || !this.endDate) {
            return;
        }
        console.log(this.interval.value);
        if (this.interval.value === 'hours') {
            this.getConsumptionForHours();
        } else if (this.interval.value === 'days') {
            this.getConsumptionForDays();
        } else if (this.interval.value === 'months') {
            this.getConsumptionForMonths();
        } else if (this.interval.value === 'years') {
            this.getConsumptionForYears();
        }
    }

    async getConsumptionForHours(): Promise<void> {
        await this.loadConsumptionByHour();

        if (!this.startDate || !this.endDate) {
            const now = new Date();
            this.startDate = new Date(now.setHours(now.getHours() - 24, 0, 0, 0));
            this.endDate = new Date();
        }

        this.endDate.setHours(this.endDate.getHours() + 1);

        const currentHour = new Date().getHours();
        this.endDate.setHours(currentHour, 0, 0, 0);

        this.filteredData = this.consumptions.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= this.startDate && itemDate <= this.endDate;
        });

        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const labels = this.generateUniqueHourlyLabels();
        this.labelsX = labels;

        this.dataY = labels.map(hour => {
            const hourIndex = parseInt(hour.split(":")[0]);

            return this.filteredData.find(item => {
                const itemDate = new Date(item.date);
                return itemDate.getHours() === hourIndex;
            })?.consumption || 0;
        });

        this.chartData = {
            labels: labels,
            datasets: [{
                label: 'Consumo por hora',
                data: this.dataY,
                borderColor: '#42A5F5',
                tension: 0.1
            }]
        };
    }

    async getConsumptionForDays(): Promise<void> {
        await this.loadConsumptionByDay();
        if (!this.startDate || !this.endDate) {
            const now = new Date();
            this.startDate = new Date(now.setDate(now.getDate() - 7));
            this.endDate = new Date();
        }
        this.filteredData = this.consumptions.filter(item => {
            const itemDate = new Date(item.date);
            this.startDate.setHours(0, 0, 0, 0);
            this.endDate.setHours(0, 0, 0, 0);
            return itemDate >= this.startDate && itemDate < this.compareEndDate;
        });

        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const dailyConsumption: { [key: string]: number } = {};
        this.filteredData.forEach(item => {
            const itemDate = new Date(item.date);
            const dateKey = `${itemDate.getDate()}-${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
            if (!dailyConsumption[dateKey]) {
                dailyConsumption[dateKey] = 0;
            }
            dailyConsumption[dateKey] = item.consumption;
        });

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
                data: labels.map(dateKey => dailyConsumption[dateKey] || 0),
                borderColor: '#42A5F5',
            }]
        };
    }

    async getConsumptionForMonths(): Promise<void> {
        await this.loadConsumptionByMonth();

        const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

        let labels: string[] = [];

        if (!this.startDate || !this.endDate) {
            const now = new Date();
            now.setDate(1);
            now.setHours(0, 0, 0, 0);

            labels = [];
            for (let i = 11; i >= 0; i--) {
                const past = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const label = `${monthNames[past.getMonth()]} ${past.getFullYear()}`;
                labels.push(label);
            }

            this.startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else {
            const start = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 1);
            const end = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), 1);

            const current = new Date(start);
            labels = [];

            while (current <= end) {
                const label = `${monthNames[current.getMonth()]} ${current.getFullYear()}`;
                labels.push(label);
                current.setMonth(current.getMonth() + 1);
            }
        }

        this.filteredData = this.consumptions.filter(item => {
            const itemDate = new Date(item.date);

            const itemMonth = itemDate.getMonth();
            const itemYear = itemDate.getFullYear();

            const startMonth = this.startDate.getMonth();
            const startYear = this.startDate.getFullYear();

            const endMonth = this.endDate.getMonth();
            const endYear = this.endDate.getFullYear();

            const itemIndex = itemYear * 12 + itemMonth;
            const startIndex = startYear * 12 + startMonth;
            const endIndex = endYear * 12 + endMonth;

            return itemIndex >= startIndex && itemIndex <= endIndex;
        });

        const monthlyConsumption: { [key: string]: number } = {};

        this.filteredData.forEach(item => {
            const date = new Date(item.date);
            const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (!monthlyConsumption[label]) {
                monthlyConsumption[label] = 0;
            }
            monthlyConsumption[label] = item.consumption;
        });

        this.chartData = {
            labels: labels,
            datasets: [{
                label: 'Consumo mensual',
                data: labels.map(label => monthlyConsumption[label] || 0),
                borderColor: '#42A5F5',
            }]
        };
    }

    async getConsumptionForYears(): Promise<void> {
        await this.loadConsumptionByYear();

        if (!this.startDate || !this.endDate) {
            const now = new Date();
            this.startDate = new Date(now.getFullYear() - 4, 0, 1);
            this.endDate = new Date(now.getFullYear(), 11, 31);
        }

        const startYear = this.startDate.getFullYear();
        const endYear = this.endDate.getFullYear();

        const filteredData = this.consumptions.filter(item => {
            const itemYear = new Date(item.date).getFullYear();
            return itemYear >= startYear && itemYear <= endYear;
        });

        console.log(filteredData);

        const yearlyConsumption: { [year: string]: number } = {};

        filteredData.forEach(item => {
            const year = new Date(item.date).getFullYear().toString();

            if (!yearlyConsumption[year]) {
                yearlyConsumption[year] = 0;
            }

            yearlyConsumption[year] = item.consumption;
        });

        const labels = Object.keys(yearlyConsumption).sort((a, b) => +a - +b);
        this.chartData = {
            labels: labels,
            datasets: [{
                label: 'Consumo anual',
                data: labels.map(label => yearlyConsumption[label] || 0),
                borderColor: '#42A5F5',
            }]
        };
    }

    exportToCSV(): void {
        let csvContent = "data:text/csv;charset=utf-8,";
        const filteredData = this.consumptions.filter(item => {
            const itemDate = item.date;
            return itemDate >= this.startDate && itemDate < this.compareEndDate;
        });

        if (this.interval.value === 'days') {
            if (this.startDate.toDateString() === this.endDate.toDateString()) {
                csvContent += "Hora,Consumo\n";
                for (let i = 0; i < filteredData.length; i++) {
                    const hour = filteredData[i].date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    const consumption = filteredData[i].consumption;
                    csvContent += `"${hour}","${consumption}"\n`;
                }
            } else {
                csvContent += "Fecha,Consumo\n";
                const dailyConsumption: { [key: string]: number } = {};
                filteredData.forEach(item => {
                    const dateStr = item.date.toLocaleDateString();
                    if (!dailyConsumption[dateStr]) {
                        dailyConsumption[dateStr] = 0;
                    }
                    dailyConsumption[dateStr] += item.consumption;
                });
                Object.keys(dailyConsumption).forEach(date => {
                    const consumption = dailyConsumption[date];
                    csvContent += `${date},${consumption}\n`;
                });
            }
        } else if (this.interval.value === 'months') {
            csvContent += "Mes,Consumo\n";
            const monthlyData = this.chartData.datasets[0].data;
            for (let i = 0; i < monthlyData.length; i++) {
                const month = this.chartData.labels[i];
                const consumption = monthlyData[i];
                csvContent += `"${month}","${consumption}"\n`;
            }
        } else if (this.interval.value === 'years') {
            csvContent += "Anio,Consumo\n";
            const yearlyData = this.chartData.datasets[0].data;
            for (let i = 0; i < yearlyData.length; i++) {
                const year = this.chartData.labels[i];
                const consumption = yearlyData[i];
                csvContent += `"${year}","${consumption}"\n`;
            }
        }
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'consumo.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    getMessagesForMeter(): void {
        this.modelService.getBrandByModelName(this.meter.model).subscribe({
            next: brandData => {
                if (brandData === 'Bove') {
                    this.messagesService.getMessageDecodedBove(this.meter.devEui).subscribe({
                        next: data => {
                            this.messages = data
                                .filter(messageDecoded => messageDecoded.typeMessage === 'Uplink' || messageDecoded.typeMessage === 'Downlink')
                                .map(messageDecoded => {
                                    if (messageDecoded.createdAt) {
                                        messageDecoded.createdAt = this.dateFormatService.formatDate(messageDecoded.createdAt) as any;
                                    }
                                    return messageDecoded;
                                });
                            this.loading = false;
                        },
                        error: error => {
                            if (error?.status === 404 || error?.error?.status === 404 || error?.message?.includes('404')) {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Sin mensajes',
                                    detail: 'No existen mensajes de Bove para este medidor.',
                                    life: 3000
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'No se pudo cargar los mensajes de Bove.',
                                    life: 3000
                                });
                            }
                            this.loading = false;
                        }
                    });
                } else if (brandData === 'Younio') {
                    this.messagesService.getMessageDecodedYounio(this.meter.devEui).subscribe({
                        next: data => {
                            this.messages = data
                                .filter(messageDecoded => messageDecoded.typeMessage === 'Uplink' || messageDecoded.typeMessage === 'Downlink')
                                .map(messageDecoded => {
                                    if (messageDecoded.createdAt) {
                                        messageDecoded.createdAt = this.dateFormatService.formatDate(messageDecoded.createdAt) as any;
                                    }
                                    return messageDecoded;
                                });
                            this.loading = false;
                        },
                        error: error => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo cargar los mensajes de Younio.',
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

    openDetailMessage(message: MessageDecoded) {
        this.router.navigate([`/devices/meter/detail-message/${message.uniqueKey}`], { queryParams: { model: this.meter.model } });
    }

    async loadConsumptionByHour(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getConsumptionByHour(this.meter.devEui)
            );

            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.hourlyConsumption
            }));
        } catch (error) {
            if (this.isNotFoundError?.(error)) {
                this.consumptions = [];
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Sin datos',
                    detail: 'No existen consumos por hora para este medidor.',
                    life: 3000
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar los consumos por hora.',
                    life: 3000
                });
            }
        }
    }

    async loadConsumptionByDay(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getConsumptionByDay(this.meter.devEui)
            );

            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.dailyConsumption
            }));

        } catch (error) {
            if (this.isNotFoundError?.(error)) {
                this.consumptions = [];
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Sin datos',
                    detail: 'No existen consumos por día para este medidor.',
                    life: 3000
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar los consumos por día.',
                    life: 3000
                });
            }
        }
    }

    async loadConsumptionByMonth(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getConsumptionByMonth(this.meter.devEui)
            );
            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.monthlyConsumption
            }));

        } catch (error) {
            if (this.isNotFoundError?.(error)) {
                this.consumptions = [];
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Sin datos',
                    detail: 'No existen consumos por mes para este medidor.',
                    life: 3000
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar los consumos por mes.',
                    life: 3000
                });
            }
        }
    }

    async loadConsumptionByYear(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getConsumptionByYear(this.meter.devEui)
            );
            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.yearlyConsumption
            }));

        } catch (error) {
            if (this.isNotFoundError?.(error)) {
                this.consumptions = [];
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Sin datos',
                    detail: 'No existen consumos por año para este medidor.',
                    life: 3000
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar los consumos por año.',
                    life: 3000
                });
            }
        }
    }

    generateUniqueHourlyLabels(): string[] {
        const labels: string[] = [];
        const seen = new Set<string>();

        for (const i of Array.from({ length: 24 }, (_, index) => index)) {
            const hourLabel = i.toString().padStart(2, '0') + ":00";
            if (!seen.has(hourLabel)) {
                labels.push(hourLabel);
                seen.add(hourLabel);
            }
        }

        return labels;
    }

    private isNotFoundError(error: any): boolean {
        return error.status === 404 ||
            (error.error && error.error.status === 404) ||
            error.message?.includes('404');
    }

    sendDownlinkMessage(messageType: string): void {
        this.modelService.getBrandByModelName(this.meter.model).subscribe({
            next: brand => {
                const brandName = (brand || '').toLowerCase();

                let downlinkType = messageType;

                if (messageType === 'valve') {
                    const valvePercentage = this.stateValve;
                    if (valvePercentage === 0) {
                        downlinkType = 'valve_close';
                    } else if (valvePercentage === 100) {
                        downlinkType = 'valve_open';
                    } else {
                        downlinkType = `valve_open_${valvePercentage}`;
                    }
                }

                this.lorawanDownlinksService.sendDownlink(brandName, downlinkType, this.meter.devEui).subscribe({
                    next: (response) => {
                        // Verificar si la respuesta contiene información de éxito
                        if (response && response.status === 'success') {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: response.message || 'Mensaje Downlink enviado correctamente.',
                                life: 3000
                            });
                        } else {
                            // Respuesta con formato válido pero con error
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: response.message || 'Error al enviar el mensaje Downlink.',
                                life: 3000
                            });
                        }
                        this.visible = false;
                    },
                    error: error => {
                        console.error('Error al enviar mensaje Downlink:', error);

                        // Intentar extraer el mensaje de error de la respuesta
                        let errorDetail = 'No se pudo enviar el mensaje Downlink.';

                        if (error.error && error.error.message) {
                            // Si el backend devuelve un objeto de error con mensaje
                            errorDetail = error.error.message;
                        } else if (typeof error.error === 'string') {
                            // Si el error es un string
                            try {
                                const errorObj = JSON.parse(error.error);
                                if (errorObj.message) {
                                    errorDetail = errorObj.message;
                                }
                            } catch (e) {
                                // Si no es un JSON válido, usar el string como está
                                if (error.error) {
                                    errorDetail = error.error;
                                }
                            }
                        } else if (error.message) {
                            // Usar el mensaje de error estándar
                            errorDetail = error.message;
                        } else if (error.status === 408) {
                            // Error específico para timeout
                            errorDetail = 'Tiempo de espera agotado al enviar el mensaje.';
                        }

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errorDetail,
                            life: 5000
                        });
                        this.visible = false;
                    }
                });
            },
            error: error => {
                console.error('Error fetching brand by model name:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener la marca del modelo.',
                    life: 3000
                });
                this.visible = false;
            }
        });
    }

    adjustSliderValue(event: any): void {
        const value = event.value;
        const closest = this.allowedValues.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
        this.stateValve = closest;
    }
}
