import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyService } from '../../../../service/company.service';
import { Company } from '../../../../api/company.model';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-edit-company',
    templateUrl: './editcompany.component.html',
    styleUrls: ['./editcompany.component.css'],
    providers: [MessageService]
})
export class EditCompanyComponent implements OnInit {
    company: Company = {} as Company;
    changeCompanyDialog = false;

    constructor(
        private readonly location: Location,
        private readonly companyService: CompanyService,
        private readonly route: ActivatedRoute,
        private readonly messageService: MessageService
    ) { }

    ngOnInit(): void {
        const companyId = this.route.snapshot.paramMap.get('id');
        if (companyId) {
            this.loadCompany(companyId);
        }
    }

    private loadCompany(id: string): void {
        this.companyService.getCompanyById(id).subscribe({
            next: (response) => this.company = response,
            error: (err) => {
                console.error('Error al cargar la compañía:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al cargar los datos de la empresa',
                    life: 3000
                });
            }
        });
    }

    onGoBack(): void {
        this.location.back();
    }

    onSave(): void {
        if (this.isValidCompany()) {
            this.companyService.updateCompany(this.company.uniqueKey, this.company).subscribe({
                next: () => {
                    console.log('Empresa actualizada con éxito');
                    this.location.back();
                },
                error: (err) => {
                    console.error('Error al actualizar la empresa:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ocurrió un error al actualizar la empresa.',
                        life: 3000
                    });
                    this.changeCompanyDialog = false;
                }
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, complete todos los campos.',
                life: 3000
            });
            this.changeCompanyDialog = false;
        }
    }

    private isValidCompany(): boolean {
        return !!(this.company.name && this.company.nickname && this.company.ruc);
    }

    onClear(): void {
        this.company = {} as Company;
        this.messageService.add({
            severity: 'info',
            summary: 'Formulario limpiado',
            detail: 'Los datos de la empresa han sido limpiados.',
            life: 3000
        });
    }
}
