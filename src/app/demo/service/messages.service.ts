import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../api/message.model';
import { MessageDecoded, MessageDecodedAlert } from '../api/message-decoded.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private readonly apiUrl = `${environment.apiMessages}`;

    constructor(private readonly http: HttpClient) { }

    getMessageById(id: string): Observable<Message> {
        return this.http.get<Message>(`${this.apiUrl}/messages/${id}`);
    }
    getAllMessages(
        sort?: string
    ): Observable<Message[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<Message[]>(`${this.apiUrl}/messages/desc`, { params });
    }

    getAllMessagesMeter(devEui: string): Observable<MessageDecoded[]> {
        return this.http.get<MessageDecoded[]>(`${this.apiUrl}/message-meter/dev-eui/${devEui}`);
    }

    getMessageDecodedBove(devEui: string): Observable<MessageDecoded[]> {
        return this.http.get<MessageDecoded[]>(`${this.apiUrl}/message-meter-bove/dev-eui/${devEui}`);
    }

    getAllMessagesDecodedBove(
        sort?: string
    ): Observable<MessageDecoded[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<MessageDecoded[]>(`${this.apiUrl}/message-meter-bove`, { params });
    }

    getAllMessagesDecodedBoveById(id: string): Observable<MessageDecoded> {
        return this.http.get<MessageDecoded>(`${this.apiUrl}/message-meter-bove/${id}`);
    }

    getMessageDecodedYounio(devEui: string): Observable<MessageDecoded[]> {
        return this.http.get<MessageDecoded[]>(`${this.apiUrl}/message-meter-younio/dev-eui/${devEui}`);
    }

    getAllMessagesDecodedYounio(
        sort?: string
    ): Observable<MessageDecoded[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<MessageDecoded[]>(`${this.apiUrl}/message-meter-younio`, { params });
    }

    getAllMessagesDecodedYounioById(id: string): Observable<MessageDecoded> {
        return this.http.get<MessageDecoded>(`${this.apiUrl}/message-meter-younio/${id}`);
    }


    getAllMessagesDecoded(
        sort?: string
    ): Observable<MessageDecoded[]> {
        let params = new HttpParams();
        if (sort) {
            params = params.set('sort', sort);
        }
        return this.http.get<MessageDecoded[]>(`${this.apiUrl}/messages-full-join/latest`, { params });
    }

    getMessagesBySerials(serials: string[]): Observable<Message[]> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<Message[]>(`${this.apiUrl}/messages/by-serials`, serials, { headers });
    }

    getAlertMessagesByCompany(companyUniqueKey: string): Observable<MessageDecodedAlert[]> {
        return this.http.get<MessageDecodedAlert[]>(
            `${this.apiUrl}/messages-full-join/alerts/${companyUniqueKey}`
        );
    }
}