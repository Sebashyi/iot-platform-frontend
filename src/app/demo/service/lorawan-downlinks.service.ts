import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaz para la respuesta del endpoint
export interface DownlinkResponse {
    commandId?: string;
    status: string;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class LorawanDownlinksService {
    private readonly apiUrl = `${environment.apiLora}/sendDownlink`;

    constructor(private readonly http: HttpClient) {}

    sendDownlink(brand: string, typeMessage: string, eui: string): Observable<DownlinkResponse> {
        const params = new URLSearchParams();
        params.append('brand', brand);
        params.append('typeMessage', typeMessage);
        params.append('eui', eui);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        
        // Mantener responseType: 'text' y convertir manualmente a JSON
        return this.http.post(this.apiUrl, params.toString(), { 
            headers, 
            responseType: 'text'
        }).pipe(
            map(response => {
                try {
                    // Intentar parsear la respuesta como JSON
                    return JSON.parse(response) as DownlinkResponse;
                } catch (e) {
                    // Si no es JSON válido, crear un objeto de respuesta básico
                    return {
                        status: 'unknown',
                        message: response || 'Respuesta desconocida'
                    } as DownlinkResponse;
                }
            })
        );
    }
}