import { Component } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../service/encryption.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    email: string = '';
    password: string = '';

    constructor(
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly encryptionService: EncryptionService,
        private readonly messageService: MessageService,
    ) { }

    login() {
        this.userService.login(this.email).subscribe({
            next: response => {
                if (response.id && response.password) {
                    const decryptedPassword = this.encryptionService.decrypt(response.password);
                    if (decryptedPassword === this.password) {
                        localStorage.setItem('userId', response.id);
                        console.log(`User ID stored in local storage: ${response.id}`);
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas', life: 3000 });
                        alert('Credenciales incorrectas');
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario no encontrado', life: 3000 });
                }
            },
            error: error => {
                if (error.status === 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se establecer coneccion con el servidor', life: 3000 });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado', life: 3000 });
                }
            }
        });
    }
}
