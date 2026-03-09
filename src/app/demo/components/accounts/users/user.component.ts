import { Component, OnInit } from '@angular/core';
import { User } from '../../../api/user.model';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { UserCompanyService } from '../../../service/user-company.service';
import { EventCommunicationService } from '../../../service/event-communication.service';

@Component({
    templateUrl: './user.component.html',
    providers: [MessageService]
})
export class UserComponent implements OnInit {

    userDialog: boolean = false;
    deleteUsersDialog: boolean = false;
    users: User[] = [];
    user: User = {} as User;
    selectedUsers: User[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    roles: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private readonly userService: UserService,
        private readonly userCompanyService: UserCompanyService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly eventService: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'uniqueKey', header: 'Code' },
            { field: 'firstName', header: 'First Name' },
            { field: 'last_name', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' },
            { field: 'phoneNumber', header: 'Phone Number' }
        ];
        this.loadUsersByCompany();
        this.eventService.companyChange$.subscribe(() => {
            this.loadUsersByCompany();
            console.log(this.users);
        });
    }

    loadUsersByCompany() {
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!companyId) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ID de la compañía en localStorage', life: 3000 });
            this.users = [];
            return;
        }
        this.userCompanyService.getUserByCompanyById(companyId).subscribe({
            next: (userCompanyRelations) => {
                // ✅ Evitar duplicados
                const userIds = [...new Set(userCompanyRelations.map(relation => relation.userUniqueKey))];

                if (userIds.length === 0) {
                    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay usuarios registrados para esta compañía', life: 3000 });
                    this.users = [];
                    return;
                }
                this.fetchUsersDetails(userIds);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la relación de usuarios y compañías', life: 3000 });
            }
        });
    }


    fetchUsersDetails(userIds: string[]) {
        const userDetailsRequests = userIds.map(userId => this.userService.getUserById(userId).toPromise());
        Promise.all(userDetailsRequests)
            .then(users => {
                this.users = users as User[];
                console.log(this.users);
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar todos los detalles de los usuarios', life: 3000 });
                this.users = [];
            });
    }

    openNew() {
        this.router.navigate(['/accounts/user/register-user']);
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;

        const deleteRequests = this.selectedUsers.map(user =>
            this.userCompanyService.deleteByUserId(user.uniqueKey).toPromise()
        );

        Promise.all(deleteRequests)
            .then(() => {
                this.users = this.users.filter(val => !this.selectedUsers.includes(val));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuarios Eliminados', life: 3000 });
                this.selectedUsers = [];
            })
            .catch(() => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar todos los usuarios seleccionados.' });
            });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    findIndexByUniqueKey(uniqueKey: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].uniqueKey === uniqueKey) {
                index = i;
                break;
            }
        }
        return index;
    }

    onGlobalFilter(table: any, event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        if (filterValue.includes(' ')) {
            const filteredUsers = this.users.filter(user => {
                const fullName = `${user.firstName} ${user.secondName}`.toLowerCase();
                const fullLastName = `${user.firstLastName} ${user.secondLastName}`.toLowerCase();
                return fullName.includes(filterValue.toLowerCase()) ||
                    fullLastName.includes(filterValue.toLowerCase()) ||
                    user.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.secondName.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.firstLastName.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.secondLastName.toLowerCase().includes(filterValue.toLowerCase()) ||
                    `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`.toLowerCase().includes(filterValue.toLowerCase());
            });
            table.value = filteredUsers;
        } else {
            table.filterGlobal(filterValue, 'contains');
        }
    }

    openEdit(user: User) {
        this.router.navigate([`/accounts/user/edit-user/${user.uniqueKey}`]);
    }
}
