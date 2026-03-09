import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../api/user.model';
import { map } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private readonly apiUrl = 'http://localhost:8083/m3verificaciones/api/v1/user';

    constructor(private readonly http: HttpClient, private readonly encryptionService: EncryptionService ) { }

    getUsers(role?: string, lastName?: string, sort?: string): Observable<User[]> {
        let url = `${this.apiUrl}`;
        const params: any = {};

        if (role) {
            params.role = role;
        }
        if (lastName) {
            params.lastName = lastName;
        }
        if (sort) {
            params.sort = sort;
        }

        return this.http.get<User[]>(url, { params });
    }

    getUserById(id: string): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<User>(url);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: string, user: User): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<User>(url, user);
    }

    deleteUser(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }

    login(email: string): Observable<{ id: string | null, password: string | null }> {
        console.log('email', email);
        return this.http.post<{ id?: string, password?: string }>(`${this.apiUrl}/login`, { email })
            .pipe(
                map(response => ({
                    id: response.id || null,
                    password: response.password || null
                }))
            );
    }
}
