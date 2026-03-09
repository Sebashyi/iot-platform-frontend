import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                ]
            },
            {
                label: 'Dispositivos',
                items: [
                    { label: 'Medidores', icon: 'pi pi-fw pi-bolt', routerLink: ['/devices/meter'] },
                    { label: 'Gateways', icon: 'pi pi-fw pi-mobile', routerLink: ['/devices/gateway'] },
                ]
            },
            {
                label: 'Cuentas',
                items: [
                    { label: 'Empresas', icon: 'pi pi-fw pi-building', routerLink: ['/accounts/company'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/accounts/user'] },
                ]
            },
            {
                label: 'Análisis',
                items: [
                    { label: 'Consumo', icon: 'pi pi-fw pi-chart-line', routerLink: ['/analytics/consumption'] },
                    { label: 'Mensajes de comunicación', icon: 'pi pi-fw pi-comments', routerLink: ['/analytics/sendMessages'] },

                ]
            },
        ];
    }
    clearLocalStorageAndLogout() {
        window.location.href = '/auth/login';
    }
}
