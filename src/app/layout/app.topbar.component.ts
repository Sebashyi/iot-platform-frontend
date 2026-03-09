import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { CompanyService } from '../demo/service/company.service';
import { UserCompanyService } from '../demo/service/user-company.service';
import { EventCommunicationService } from '../demo/service/event-communication.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Company } from '../demo/api/company.model';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    companies: Company[] = [];
    selectedState: any = null;
    userId = localStorage.getItem('userId');

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private readonly companyService: CompanyService,
        private readonly userCompanyService: UserCompanyService,
        private readonly eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.loadCompanies();
        this.eventService.saveUser$.subscribe(() => {
            console.log('Empresas antes de recargar:', this.companies);
            this.loadCompanies();
            console.log('Empresas después de recargar:', this.companies);
        });
        this.ensureSelectedCompanyId();
    }

    ensureSelectedCompanyId() {
        const selectedCompanyId = localStorage.getItem('selectedCompanyId');
        if (!selectedCompanyId) {
            localStorage.removeItem('selectedCompanyId');
        }
    }

    loadUserCompanies(userId: string) {
        this.userCompanyService.getUserCompanies(userId).subscribe({
            next: (userCompanies) => {
                // ✅ Eliminar duplicados usando Set
                let companyIds = [...new Set(userCompanies
                    .map((uc: any) => uc.companyUniqueKey)
                    .filter((id: string) => id?.trim()))];

                if (!companyIds.length) {
                    console.warn('No valid company IDs found for the user.');
                    this.companies = [];
                    return;
                }

                const companyObservables = companyIds.map(companyId =>
                    this.companyService.getCompanyById(companyId).pipe(
                        catchError(err => {
                            console.error(`Error fetching company with ID: ${companyId}`, err);
                            return of(null);
                        })
                    )
                );

                forkJoin(companyObservables).subscribe({
                    next: (companies) => {
                        this.companies = [...companies
                            .filter((company: any) => company)
                            .map((company: any): Company => ({
                                name: company.name,
                                nickname: company.nickname || '',
                                ruc: company.ruc || '',
                                uniqueKey: company.uniqueKey || '',
                                createdAt: company.createdAt || null,
                            }))
                            .sort((a, b) => a.name.localeCompare(b.name))];
                        this.setSelectedCompany();
                    },
                    error: (err) => {
                        console.error('Error loading companies:', err);
                    }
                });
            },
            error: (err) => {
                console.error('Error fetching user companies:', err);
            }
        });
    }

    setSelectedCompany() {
        const selectedCompanyId = localStorage.getItem('selectedCompanyId');

        if (selectedCompanyId) {
            this.selectedState = this.companies.find((item) => item.uniqueKey === selectedCompanyId) || null;
        }

        if (!this.selectedState && this.companies.length > 0) {
            this.selectedState = this.companies[0];
            localStorage.setItem('selectedCompanyId', this.selectedState.uniqueKey);
        }
    }

    onCompanyChange(selectedState: any) {
        localStorage.setItem('selectedCompanyId', selectedState.uniqueKey);
        this.eventService.emitCompanyChange();
        console.log('Company changed:', localStorage.getItem('selectedCompanyId'));
    }

    loadCompanies() {
        if (this.userId) {
            this.loadUserCompanies(this.userId);
            console.log('Companies loaded for user:', this.userId);
        } else {
            console.log('UserId is not found in localStorage.');
        }
    }
}
