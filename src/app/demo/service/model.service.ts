import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ModelService {
    private readonly apiUrl = `${environment.apiMeter}/model`;

    constructor(private readonly http: HttpClient) {}

    getBrandByModelName(modelName: string): Observable<string> {
        const params = new HttpParams().set('modelName', modelName);
        return this.http.get(`${this.apiUrl}/brand-by-model`, { params, responseType: 'text' }).pipe(
            map((response: string) => {
                try {
                    return JSON.parse(response) as string;
                } catch {
                    return response;
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching brand by model name:', error);
                return throwError(() => new Error('Failed to fetch brand by model name.'));
            })
        );
    }
}