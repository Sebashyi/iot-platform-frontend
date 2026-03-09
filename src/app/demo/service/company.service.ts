import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../api/company.model';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    private readonly baseUrl: string = 'http://localhost:8081/m3verificaciones/api/v1/company';

    constructor(private readonly http: HttpClient) { }

    getCompanies(name?: string, uniqueKey?: string, sort?: string): Observable<Company[]> {
        let params = new HttpParams();
        if (name) {
            params = params.set('name', name);
        }
        if (uniqueKey) {
            params = params.set('uniqueKey', uniqueKey);
        }
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<Company[]>(this.baseUrl, { params });
    }

    getCompanyById(id: string): Observable<Company> {
        return this.http.get<Company>(`${this.baseUrl}/${id}`);
    }

    createCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(this.baseUrl, company);
    }

    updateCompany(id: string, company: Company): Observable<Company> {
        return this.http.put<Company>(`${this.baseUrl}/${id}`, company);
    }

    deleteCompany(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
