import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface GeoNamesResponse {
    geonames: GeoNames[];
}

interface GeoNames {
    countryName?: string;
    countryCode?: string;
    geonameId: string;
    name: string;
    lat: number;
    lng: number;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private readonly geoNamesUrl = 'http://api.geonames.org';
    private readonly username = 'shadowmoon'; 

    constructor(private readonly http: HttpClient) { }

    getCountries(): Observable<GeoNames[]> {
        const params = new HttpParams().set('username', this.username);
        return this.http.get<GeoNamesResponse>(`${this.geoNamesUrl}/countryInfoJSON`, { params })
            .pipe(
                map(response => response.geonames)
            );
    }

    getProvinces(countryCode: string): Observable<GeoNames[]> {
        const params = new HttpParams().set('username', this.username);
        return this.http.get<GeoNamesResponse>(`${this.geoNamesUrl}/childrenJSON`, {
            params: params.set('geonameId', countryCode)
        })
            .pipe(
                map(response => response.geonames)
            );
    }

    getCities(provinceCode: string): Observable<GeoNames[]> {
        const params = new HttpParams().set('username', this.username);
        return this.http.get<GeoNamesResponse>(`${this.geoNamesUrl}/childrenJSON`, {
            params: params.set('geonameId', provinceCode)
        })
            .pipe(
                map(response => response.geonames) 
            );
    }
}
