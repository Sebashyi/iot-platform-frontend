import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../../../service/company.service';
import { Company } from '../../../api/company.model';
import { Router } from '@angular/router';
import { UserCompanyService } from '../../../service/user-company.service';
import { EventCommunicationService } from '../../../service/event-communication.service';
import { MeterService } from '../../../service/meter.service';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    providers: [MessageService]
})
export class CompanyComponent implements OnInit {

    companyDialog: boolean = false;
    deleteCompaniesDialog: boolean = false;
    companies: Company[] = [];
    company: Company = {} as Company;
    selectedCompanies: Company[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private companyService: CompanyService,
        private messageService: MessageService,
        private router: Router,
        private userCompanyService: UserCompanyService,
        private eventService: EventCommunicationService,
        private meterService: MeterService
    ) { }

    ngOnInit() {
        this.loadCompaniesByUser();
    }

    loadCompaniesByUser(): void {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ID de usuario en localStorage', life: 3000 });
            this.companies = [];
            return;
        }

        this.userCompanyService.getUserCompanies(userId).subscribe({
            next: (userCompanyRelations) => {
                const companiesIds = [...new Set(userCompanyRelations.map(relation => relation.companyUniqueKey))];

                if (companiesIds.length === 0) {
                    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay empresas registradas para este usuario', life: 3000 });
                    this.companies = [];
                    return;
                }

                this.fetchCompaniesDetails(companiesIds);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la relación de usuario y compañías', life: 3000 });
            }
        });
    }


    fetchCompaniesDetails(companiesIds: string[]) {
        const companyDetailsRequests = companiesIds.map(companyId => this.companyService.getCompanyById(companyId).toPromise());

        Promise.all(companyDetailsRequests)
            .then(companies => {
                this.companies = companies as Company[];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar todos los detalles de los usuarios', life: 3000 });
                this.companies = [];
            });
    }

    openNew() {
        this.router.navigate(['/accounts/company/register-company']);
    }

    deleteCompany(id: string) {
        this.companyService.deleteCompany(id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Empresa Eliminada', life: 3000 });
                this.removeCompanyFromList(id);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar los elementos.' });
            }
        });
    }

    deleteUserCompany(id: string) {
        this.userCompanyService.deleteByCompanyId(id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Relación Eliminada', life: 3000 });
                this.removeCompanyFromList(id);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar las relaciones.' });
            }
        });
    }

    confirmDeleteSelected() {
        this.deleteCompaniesDialog = false;
        this.selectedCompanies.forEach(company => {
            this.deleteCompany(company.uniqueKey);
            this.deleteUserCompany(company.uniqueKey);
            this.meterService.deleteMeterByCompanyID(company.uniqueKey);
            this.eventService.emitSaveUser();
        });
        this.selectedCompanies = [];
    }

    hideDialog() {
        this.companyDialog = false;
        this.submitted = false;
    }

    findIndexById(uniqueKey: string): number {
        let index = -1;
        for (let i = 0; i < this.companies.length; i++) {
            if (this.companies[i].uniqueKey === uniqueKey) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    removeCompanyFromList(id: string) {
        this.companies = this.companies.filter(company => company.uniqueKey !== id);
    }

    deleteSelectedCompanies() {
        this.deleteCompaniesDialog = true;
    }

    openEdit(company: Company) {
        this.router.navigate([`/accounts/company/edit-company/${company.uniqueKey}`]);
    }
}
