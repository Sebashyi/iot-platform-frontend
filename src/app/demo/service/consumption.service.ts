import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConsumptionService {
    private readonly baseUrl = `${environment.apiConsumption}`;

    constructor(private readonly http: HttpClient) { }

    getConsumptionByHour(devEui: string): Observable<any[]> {
        const url = `${this.baseUrl}/consumption-hour/by-devEui?devEui=${devEui}`;
        return this.http.get<any[]>(url);
    }

    getConsumptionByDay(devEui: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-day/by-devEui?devEui=${devEui}`);
    }

    getConsumptionByMonth(devEui: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-month/by-devEui?devEui=${devEui}`);
    }

    getConsumptionByYear(devEui: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-year/by-devEui?devEui=${devEui}`);
    }

    getAllConsumptionByHour(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-hour`);
    }

    getAllConsumptionByDay(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-day`);
    }

    getAllConsumptionByMonth(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-month`);
    }

    getAllConsumptionByYear(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-year`);
    }

    exportConsumptionsDayToExcel(selectedFields: string[]): Observable<Blob> {
        const url = `${this.baseUrl}/consumption-day/export-excel`;
        const body = { selectedFields };
        return this.http.post(url, body, { responseType: 'blob' });
    }

    exportConsumptionsHourToExcel(selectedFields: string[]): Observable<Blob> {
        const url = `${this.baseUrl}/consumption-hour/export-excel`;
        const body = { selectedFields };
        return this.http.post(url, body, { responseType: 'blob' });
    }

    exportConsumptionsMonthToExcel(selectedFields: string[]): Observable<Blob> {
        const url = `${this.baseUrl}/consumption-month/export-excel`;
        const body = { selectedFields };
        return this.http.post(url, body, { responseType: 'blob' });
    }

    exportConsumptionsYearToExcel(selectedFields: string[]): Observable<Blob> {
        const url = `${this.baseUrl}/consumption-year/export-excel`;
        const body = { selectedFields };
        return this.http.post(url, body, { responseType: 'blob' });
    }

    getConsumptionByDayByCompany(companyUniqueKey: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-day/by-company/${companyUniqueKey}`);
    }

    getConsumptionByHourByCompany(companyUniqueKey: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-hour/by-company/${companyUniqueKey}`);
    }

    getConsumptionByMonthByCompany(companyUniqueKey: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-month/by-company/${companyUniqueKey}`);
    }

    getConsumptionByYearByCompany(companyUniqueKey: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/consumption-year/by-company/${companyUniqueKey}`);
    }
}