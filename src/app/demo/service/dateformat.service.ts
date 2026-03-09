import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DateFormatService {
    private readonly datePipe: DatePipe;

    constructor(@Inject(LOCALE_ID) private readonly locale: string) {
        this.datePipe = new DatePipe(locale);
    }

    formatDate(dateInput: Date | string | number[], format: string = 'dd-MM-yyyy HH:mm'): string {
        try {
            let date: Date;

            if (Array.isArray(dateInput)) {
                if (dateInput.length === 7) {
                    date = new Date(
                        dateInput[0],
                        dateInput[1] - 1,
                        dateInput[2],
                        dateInput[3],
                        dateInput[4],
                        dateInput[5],
                        dateInput[6] / 1000000
                    );
                } else {
                    console.warn('Formato de array no soportado para fecha:', dateInput);
                    return 'Fecha inválida';
                }
            } else if (typeof dateInput === 'string') {
                date = new Date(dateInput);
            } else if (dateInput instanceof Date) {
                date = dateInput;
            } else {
                console.warn('Tipo de fecha no soportado:', dateInput);
                return 'Fecha inválida';
            }

            if (isNaN(date.getTime())) {
                console.warn('Fecha inválida después de conversión:', dateInput);
                return 'Fecha inválida';
            }

            return this.datePipe.transform(date, format) || 'Fecha inválida';
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Fecha inválida';
        }
    }
}