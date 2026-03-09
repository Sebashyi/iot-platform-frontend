import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCompany } from '../api/user-company.model';

@Injectable({
    providedIn: 'root'
})
export class UserCompanyService {
    private readonly apiUrl = 'http://localhost:8084/m3verificaciones/api/v1/user-company';

    constructor(private readonly http: HttpClient) { }
    saveUserCompanyRelation(userCompany: UserCompany): Observable<any> {
        return this.http.post<UserCompany>(this.apiUrl, userCompany);
    }

    getUserCompanies(userId: string): Observable<UserCompany[]> {
        const url = `${this.apiUrl}/user/${userId}`;
        console.log(url);
        console.log(this.http.get<UserCompany[]>(url));
        return this.http.get<UserCompany[]>(url);
    }

    deleteUserCompanyRelation(userCompanyId: string): Observable<void> {
        const url = `${this.apiUrl}/${userCompanyId}`;
        return this.http.delete<void>(url);
    }

    getUserByCompanyById(companyId: string): Observable<UserCompany[]> {
        const url = `${this.apiUrl}/company/${companyId}`;
        console.log(url);
        console.log(this.http.get<UserCompany[]>(url));
        return this.http.get<UserCompany[]>(url);
    }

    deleteByUserId(userId: string): Observable<void> {
        const url = `${this.apiUrl}/user/${userId}`;
        return this.http.delete<void>(url);
    }

    deleteByCompanyId(userId: string): Observable<void> {
        const url = `${this.apiUrl}/company/${userId}`;
        return this.http.delete<void>(url);
    }
}
