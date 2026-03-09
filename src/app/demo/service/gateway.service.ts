import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Gateway } from '../api/gateway.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GatewayService {

    private readonly apiUrl = `${environment.apiGateway}/gateway`;

    constructor(private readonly http: HttpClient) { }

    getGatewaysByCompany(uniqueKeyCompany: string): Observable<Gateway[]> {
        return this.http.get<Gateway[]>(`${this.apiUrl}/by-company?idCompany=${uniqueKeyCompany}`);
    }

    deleteGateway(gatewayId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${gatewayId}`);
    }

    saveGateway(gateway: Gateway): Observable<Gateway> {
        return this.http.post<Gateway>(this.apiUrl, gateway);
    }

    updateGateway(gateway: Gateway): Observable<Gateway> {
        return this.http.put<Gateway>(`${this.apiUrl}/${gateway.uniqueKey}`, gateway);
    }

    getGatewayById(gatewayId: string): Observable<Gateway> {
        return this.http.get<Gateway>(`${this.apiUrl}/${gatewayId}`);
    }

    getGatewayStatusCount(companyUniqueKey: string): Observable<any> {
        if (!companyUniqueKey) {
            return throwError(() => new Error('Company Unique Key is not provided'));
        }
        const params = new HttpParams().set('uniqueKeyCompany', companyUniqueKey);
        return this.http.get<any>(`${this.apiUrl}/status/count`, { params });
    }
}