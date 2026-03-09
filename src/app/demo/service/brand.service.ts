import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../api/brand.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private readonly apiUrl = `${environment.apiMeter}/brand`;

    constructor(private readonly http: HttpClient) { }

    getBrandById(id: string): Observable<Brand> {
        return this.http.get<Brand>(`${this.apiUrl}/${id}`);
    }
    getAllBrands(
        sort?: string
    ): Observable<Brand[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<Brand[]>(this.apiUrl, { params });
    }
}
