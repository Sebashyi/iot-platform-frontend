import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataSharingService {
    private readonly dataSource = new BehaviorSubject<any>(null);
    currentData = this.dataSource.asObservable();

    constructor() { }

    changeData(data: any) {
        this.dataSource.next(data);
    }
}