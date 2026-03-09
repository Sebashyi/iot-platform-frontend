import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Meter } from '../api/meter.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MeterService {
    private readonly apiUrl = 'http://localhost:8082/m3verificaciones/api/v1/meter';

    constructor(private readonly http: HttpClient) { }

    getMeterById(id: string): Observable<Meter> {
        return this.http.get<Meter>(`${this.apiUrl}/${id}`);
    }

    saveMeter(meter: Meter): Observable<Meter> {
        return this.http.post<Meter>(this.apiUrl, meter);
    }

    deleteMeterById(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateMeter(id: string, meter: Meter): Observable<Meter> {
        return this.http.put<Meter>(`${this.apiUrl}/${id}`, meter);
    }

    getAllMeters(
        model?: string,
        diameter?: number,
        typeCommunication?: string,
        sort?: string
    ): Observable<Meter[]> {
        let params = new HttpParams();
        if (model) {
            params = params.set('model', model);
        }
        if (diameter) {
            params = params.set('diameter', diameter.toString());
        }
        if (typeCommunication) {
            params = params.set('typeCommunication', typeCommunication);
        }
        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.get<Meter[]>(this.apiUrl, { params });
    }

    getMetersByCompany(uniqueKeyCompany: string): Observable<Meter[]> {
        return this.http.get<Meter[]>(`${this.apiUrl}/by-company?companyUniqueKey=${uniqueKeyCompany}`);
    }

    deleteMeterByCompanyID(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/company/${id}`);
    }

    uploadCSV(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post(`${this.apiUrl}/upload`, formData, {
            headers: new HttpHeaders(),
            observe: 'response',
            responseType: 'text'
        }).pipe(
            map(response => {
                if (response.status === 200 || response.status === 201) {
                    return response.body;
                } else {
                    throw new Error('Error en el servidor');
                }
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    getMeterStatusCount(companyUniqueKey: string): Observable<any> {
        if (!companyUniqueKey) {
            return throwError('Company Unique Key is not provided');
        }
        const params = new HttpParams().set('companyUniqueKey', companyUniqueKey);

        return this.http.get<any>(`${this.apiUrl}/status/count`, { params });
    }

    getMetersLocations(companyUniqueKey: string): Observable<any> {
        if (!companyUniqueKey) {
            return throwError('Company Unique Key is not provided');
        }
        const params = new HttpParams().set('companyUniqueKey', companyUniqueKey);

        return this.http.get<any>(`${this.apiUrl}/coordinates`, { params });
    }

    getMeterDetailsByDevEui(devEui: string): Observable<Meter> {
        const params = new HttpParams().set('devEui', devEui);
        return this.http.get<Meter>(`${this.apiUrl}/details`, { params });
    }

    getMeterSerialsByCompany(companyUniqueKey: string): Observable<string[]> {
        if (!companyUniqueKey) {
            return throwError(() => new Error('Company Unique Key is not provided'));
        }

        const params = new HttpParams().set('companyUniqueKey', companyUniqueKey);

        return this.http.get<string[]>(`${this.apiUrl}/serials`, { params }).pipe(
            catchError(error => throwError(() => error)) // 🔁 Propagar el error tal como viene
        );
    }

}
