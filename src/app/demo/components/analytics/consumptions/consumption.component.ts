import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ChartData, ChartOptions } from 'chart.js';
import { Consumption } from '../../../api/consumption.model'
import { BrandService } from '../../../service/brand.service';
import { Brand } from '../../../api/brand.model';
import { Model } from '../../../api/model.model';
import { ConsumptionService } from '../../../service/consumption.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-consumption',
    templateUrl: './consumption.component.html',
    styleUrls: ['./consumption.component.css'],
    providers: [MessageService, DatePipe]
})
export class ConsumptionComponent implements OnInit {

    selectedBrand: any = null;
    selectedModel: any = null;
    selectedDiameter: any = null;
    index: number = 0;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    changeMeterDialog: boolean = false;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    data: any;
    optionsCurve: any;
    consumptions: any[] = [];
    dropdownItemsDiameter = [
        { name: '15', code: '15' },
        { name: '20', code: '20' },
        { name: '25', code: '25' },
        { name: '40', code: '40' },
        { name: '50', code: '50' },
        { name: 'DN50', code: 'DN50' },
        { name: 'DN65', code: 'DN65' },
        { name: 'DN80', code: 'DN80' },
        { name: 'DN100', code: 'DN100' },
        { name: 'DN125', code: 'DN125' },
        { name: 'DN150', code: 'DN150' },
        { name: 'DN200', code: 'DN200' },
        { name: 'DN250', code: 'DN250' },
        { name: 'DN300', code: 'DN300' },
        { name: 'DN400', code: 'DN400' }
    ];
    labelsX: string[] = [];
    dataY: any[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    interval: any = { label: 'Días', value: 'days' };
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
        { label: 'Días', value: 'days' },
        { label: 'Meses', value: 'months' },
        { label: 'Años', value: 'years' }
    ];
    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    consumption: Consumption = null;

    dropdownBrandMeter: Brand[] = [];
    dropdownModelMeter: Model[] = [];

    stateOptions: any[] = [{ label: 'Horas', value: 'hours' }, { label: 'Días', value: 'days' }, { label: 'Meses', value: 'months' }, { label: 'Años', value: 'years' }];

    value: string = 'hours';

    visible: boolean = false;

    optionsExport: string[] = [];

    constructor(
        private readonly location: Location,
        private readonly route: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly brandService: BrandService,
        private readonly consumptionService: ConsumptionService,
        private readonly datePipe: DatePipe,
    ) { }

    ngOnInit(): void {
        this.brandService.getAllBrands().subscribe(data => {
            this.dropdownBrandMeter = data;
        });
        this.initializeConsumptionData();
    }

    private async initializeConsumptionData(): Promise<void> {
        await this.getConsumptionForHours();
        this.chartData = {
            labels: this.labelsX,
            datasets: [{
                label: 'Consumo',
                data: this.dataY,
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.1
            }]
        };
    }

    onGoBack(): void {
        this.location.back();
    }

    updateChart(): void {
        if (this.endDate) {
            this.compareEndDate = new Date(this.endDate);
            this.compareEndDate.setDate(this.compareEndDate.getDate() + 1);
        }
        if (!this.startDate || !this.endDate) {
            return;
        }
        if (this.value === 'hours') {
            this.getConsumptionForHours();
        } else if (this.value === 'days') {
            this.getConsumptionForDays();
        } else if (this.value === 'months') {
            this.getConsumptionForMonths();
        } else if (this.value === 'years') {
            this.getConsumptionForYears();
        }
    }

    async getConsumptionForHours(): Promise<void> {
        await this.loadConsumptionByHour();
        
        if (!this.startDate || !this.endDate) {
            const now = new Date();
            this.startDate = new Date(now.setHours(now.getHours() - 24));
            this.endDate = new Date();
        }

        this.endDate.setHours(this.endDate.getHours() + 1);

        const currentHour = new Date().getHours();

        this.startDate.setHours(currentHour, 0, 0, 0);

        this.filteredData = this.consumptions.filter(item => {
            const itemDate = new Date(item.date);

            const isInDateRange = itemDate >= this.startDate && itemDate <= this.endDate;

            const matchesModel = !this.selectedModel?.name || item.model === this.selectedModel.name;
            const matchesDiameter = !this.selectedDiameter?.name || item.diameter === this.selectedDiameter.code;
            console.log("endatedate: ",this.endDate, '|',"stardate: ", this.startDate,'|',"itemdate: ", itemDate);
            return isInDateRange && matchesModel && matchesDiameter;
        });

        this.consumptions = this.filteredData;

        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const labels = this.generateUniqueHourlyLabels();
        this.labelsX = labels;

        this.dataY = labels.map(hour => {
            const hourIndex = parseInt(hour.split(":")[0]);
            return this.filteredData
                .filter(item => new Date(item.date).getHours() === hourIndex)
                .reduce((sum, item) => sum + item.consumption, 0);
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

            const isInDateRange = itemDate >= this.startDate && itemDate <= this.endDate;

            const matchesModel = !this.selectedModel?.name || item.model === this.selectedModel.name;
            const matchesDiameter = !this.selectedDiameter?.name || item.diameter === this.selectedDiameter.code;
            return isInDateRange && matchesModel && matchesDiameter;
        });

        this.consumptions = this.filteredData;

        this.filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const dailyConsumption: { [key: string]: number } = {};
        this.filteredData.forEach(item => {
            const itemDate = new Date(item.date);
            const dateKey = `${itemDate.getDate()}-${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
            if (!dailyConsumption[dateKey]) {
                dailyConsumption[dateKey] = 0;
            }
            dailyConsumption[dateKey] += item.consumption;
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
            
            const isInMonthRange = itemIndex >= startIndex && itemIndex <= endIndex;
            
            const matchesModel = !this.selectedModel?.name || item.model === this.selectedModel.name;
            const matchesDiameter = !this.selectedDiameter?.name || item.diameter === this.selectedDiameter.code;
            
            return isInMonthRange && matchesModel && matchesDiameter;
        });

        this.consumptions = this.filteredData;

        const monthlyConsumption: { [key: string]: number } = {};

        this.filteredData.forEach(item => {
            const date = new Date(item.date);
            const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (!monthlyConsumption[label]) {
                monthlyConsumption[label] = 0;
            }
            monthlyConsumption[label] += item.consumption;
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

        this.filteredData = this.consumptions.filter(item => {
            const itemDate = new Date(item.date);
            const itemYear = itemDate.getFullYear();
            
            const isInYearRange = itemYear >= startYear && itemYear <= endYear;
            
            const matchesModel = !this.selectedModel?.name || item.model === this.selectedModel.name;
            const matchesDiameter = !this.selectedDiameter?.name || item.diameter === this.selectedDiameter.code;
            
            return isInYearRange && matchesModel && matchesDiameter;
        });

        this.consumptions = this.filteredData;

        const yearlyConsumption: { [year: string]: number } = {};

        this.filteredData.forEach(item => {
            const year = new Date(item.date).getFullYear().toString();

            if (!yearlyConsumption[year]) {
                yearlyConsumption[year] = 0;
            }

            yearlyConsumption[year] += item.consumption;
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
        if (this.value === 'hours') {
            this.consumptionService.exportConsumptionsHourToExcel(this.optionsExport).subscribe({
                next: (response) => {
                    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'consumption-data.xlsx';
                    link.click();
                    window.URL.revokeObjectURL(url);
                    this.messageService.add({ severity: 'success', summary: 'Exportación exitosa', detail: 'El archivo se ha exportado correctamente.', life: 3000 });
                    this.optionsExport = [];
                    this.visible = false;
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo exportar el archivo.', life: 3000 });
                }
            });
        } else if (this.value === 'days') {
            this.consumptionService.exportConsumptionsDayToExcel(this.optionsExport).subscribe({
                next: (response) => {
                    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'consumption-data.xlsx';
                    link.click();
                    window.URL.revokeObjectURL(url);
                    this.messageService.add({ severity: 'success', summary: 'Exportación exitosa', detail: 'El archivo se ha exportado correctamente.', life: 3000 });
                    this.optionsExport = [];
                    this.visible = false;
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo exportar el archivo.', life: 3000 });
                }
            });
        } else if (this.value === 'months') {
            this.consumptionService.exportConsumptionsMonthToExcel(this.optionsExport).subscribe({
                next: (response) => {
                    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'consumption-data.xlsx';
                    link.click();
                    window.URL.revokeObjectURL(url);
                    this.messageService.add({ severity: 'success', summary: 'Exportación exitosa', detail: 'El archivo se ha exportado correctamente.', life: 3000 });
                    this.optionsExport = [];
                    this.visible = false;
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo exportar el archivo.', life: 3000 });
                }
            });
        } else if (this.value === 'years') {
            this.consumptionService.exportConsumptionsYearToExcel(this.optionsExport).subscribe({
                next: (response) => {
                    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'consumption-data.xlsx';
                    link.click();
                    window.URL.revokeObjectURL(url);
                    this.messageService.add({ severity: 'success', summary: 'Exportación exitosa', detail: 'El archivo se ha exportado correctamente.', life: 3000 });
                    this.optionsExport = [];
                    this.visible = false;
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo exportar el archivo.', life: 3000 });
                }
            });
        }
    }

    cleanFilters(): void {
        this.selectedBrand = null;
        this.selectedModel = null;
        this.selectedDiameter = null;
        this.startDate = null;
        this.endDate = null;
        this.compareEndDate = null;
    }

    loadModelsByBrand(): void {
        if (this.selectedBrand && this.selectedBrand.uniqueKey) {
            this.dropdownBrandMeter.forEach(brand => {
                if (brand.uniqueKey === this.selectedBrand.uniqueKey) {
                    this.dropdownModelMeter = brand.models;
                }
            });
        } else {
            this.dropdownModelMeter = [];
            console.warn('selectedBrand es null o no tiene un uniqueKey válido.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Modelo no válido.' });
        }
    }

    async loadConsumptionByHour(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getAllConsumptionByHour()
            );

            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.hourlyConsumption,
                model: item.model,
                diameter: item.diameter,
                serial: item.serial
            }));

        } catch (error) {
            if (this.isNotFoundError(error)) {
                this.consumptions = [];
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
                this.consumptionService.getAllConsumptionByDay()
            );

            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.dailyConsumption,
                model: item.model,
                diameter: item.diameter,
                serial: item.serial
            }));

        } catch (error) {
            if (this.isNotFoundError(error)) {
                this.consumptions = [];
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
                this.consumptionService.getAllConsumptionByMonth()
            );
            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.monthlyConsumption,
                model: item.model,
                diameter: item.diameter,
                serial: item.serial
            }));

        } catch (error) {
            if (this.isNotFoundError(error)) {
                this.consumptions = [];
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar los consumos por por meses.',
                    life: 3000
                });
            }
        }
    }

    async loadConsumptionByYear(): Promise<void> {
        try {
            const data = await firstValueFrom(
                this.consumptionService.getAllConsumptionByYear()
            );
            this.consumptions = data.map(item => ({
                date: new Date(item.dateConsumption),
                consumption: item.yearlyConsumption,
                model: item.model,
                diameter: item.diameter,
                serial: item.serial
            }));

        } catch (error) {
            if (this.isNotFoundError(error)) {
                this.consumptions = [];
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar los consumos por por años.',
                    life: 3000
                });
            }
        }
    }

    generateUniqueHourlyLabels(): string[] {
        const labels: string[] = [];
        const seen = new Set<string>();

        for (let i = 0; i < 24; i++) {
            const hourLabel = i.toString().padStart(2, '0') + ":00";
            if (!seen.has(hourLabel)) {
                labels.push(hourLabel);
                seen.add(hourLabel);
            }
        }

        return labels;
    }

    formatDate(dateConsumption: Date): string {
        let date = new Date(dateConsumption);

        if (Array.isArray(dateConsumption) && dateConsumption.length === 7) {
            date = new Date(
                dateConsumption[0],
                dateConsumption[1] - 1,
                dateConsumption[2],
                dateConsumption[3],
                dateConsumption[4],
                dateConsumption[5],
                dateConsumption[6] / 1000000
            );
        } else if (typeof dateConsumption === 'string') {
            date = new Date(dateConsumption);
        }

        return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    }

    showDialog() {
        this.visible = true;
    }

    private isNotFoundError(error: any): boolean {
        return error.status === 404 ||
            (error.error && error.error.status === 404) ||
            error.message?.includes('404');
    }
}
