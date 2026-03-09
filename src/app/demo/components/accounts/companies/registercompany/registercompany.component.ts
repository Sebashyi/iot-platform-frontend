import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CompanyService } from '../../../../service/company.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-register-company',
    templateUrl: './registercompany.component.html',
    styleUrls: ['./registercompany.component.css'],
    providers: [MessageService]
})
export class RegisterCompanyComponent {

    createCompanyDialog: boolean = false;
    
    company = {
        name: '',
        nickname: '',
        ruc: ''
    };

    constructor(
        private readonly location: Location,
        private readonly companyService: CompanyService,
        private readonly messageService: MessageService,
    ) { }

    onGoBack(): void {
        this.location.back();
    }

    onSave(): void {
        if (this.company.name && this.company.nickname && this.company.ruc) {
            this.companyService.createCompany(this.company).subscribe({
                next: (response) => {
                    console.log('Empresa registrada con éxito:', response);
                    this.location.back();
                    const message = {
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'Compañía Registrada',
                        life: 3000
                    };
                    localStorage.setItem('message', JSON.stringify(message));
                },
                error: (err) => {
                    console.error('Error al registrar la empresa:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la empresa.' });
                    this.createCompanyDialog = false;
                }
            });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.' });
            this.createCompanyDialog = false;
        }
    }

    onClear(): void {
        this.company = { name: '', nickname: '', ruc: '' };
    }
}
