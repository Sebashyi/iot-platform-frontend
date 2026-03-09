import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocationService } from '../../../../service/location.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Company } from '../../../../api/company.model'
import { Gateway } from '../../../../api/gateway.model';
import { CompanyService } from '../../../../service/company.service';
import { GatewayService } from '../../../../service/gateway.service';

@Component({
    selector: 'app-register-gateway',
    templateUrl: './registergateway.component.html',
    styleUrls: ['./registergateway.component.css'],
    providers: [MessageService]
})
export class RegisterGatewayComponent implements OnInit, AfterViewInit {

    selectedState: any = null;
    selectedRegion: any = null;
    selectedSubRed: any = null;
    selectedCompany: any = null;
    selectedGatewayType: any = null;
    valClass: boolean = false;
    valPKTFWD: boolean = false;
    valCheck: string[] = [];
    typeAutentification: string[] = [];
    companies: Company[] = [];
    lat: number = -0.345638;
    lng: number = -78.447889;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    selectedGateway: any = null;
    gateways: Gateway[] = [];
    createGatewayDialog: boolean = false;
    gateway: Gateway = {
        name: "",
        type: "",
        comunication: "",
        macDirection: "",
        region: "",
        subRed: "",
        state: false,
        classB: false,
        pktfwd: false,
        latitude: this.lat,
        longitude: this.lng,
        mqtt: false,
        companyUniqueKey: "",
        gwEui: "",
    };
    dropdownItemsState = [
        { name: 'Activo', code: 'true' },
        { name: 'Inactivo', code: 'false' },
    ];

    dropdownItemsRegion = [
        { name: 'CN470', code: 'CN470' },
        { name: 'CN470PREQUEL', code: 'CN470PREQUEL' },
        { name: 'CN470PHOENIX', code: 'CN470PHOENIX' },
        { name: 'AS923MYS', code: 'AS923MYS' },
        { name: 'EU868', code: 'EU868' },
        { name: 'AS923', code: 'AS923' },
        { name: 'US915', code: 'US915' },
        { name: 'AU915', code: 'AU915' },
        { name: 'EU433', code: 'EU433' },
        { name: 'IN865', code: 'IN865' },
        { name: 'CN470ALID', code: 'CN470ALID' },
        { name: 'CN470ALIS', code: 'CN470ALIS' },
        { name: 'AS923IND', code: 'AS923IND' },
        { name: 'ID920', code: 'ID920' },
        { name: 'KR920', code: 'KR920' },
    ];

    dropdownItemsSubred = [
        { name: 'CH_00-07', code: 'CH_00-07' },
        { name: 'CH_08-15', code: 'CH_08-15' },
        { name: 'CH_16-23', code: 'CH_16-23' },
        { name: 'CH_24-31', code: 'CH_24-31' },
        { name: 'CH_32-39', code: 'CH_32-39' },
        { name: 'CH_40-47', code: 'CH_40-47' },
        { name: 'CH_48-55', code: 'CH_48-55' },
        { name: 'CH_56-63', code: 'CH_56-63' },
        { name: 'CH_64-71', code: 'CH_64-71' },
        { name: 'CH_72-79', code: 'CH_72-79' },
        { name: 'CH_80-87', code: 'CH_80-87' },
        { name: 'CH_88-95', code: 'CH_88-95' },
        { name: 'CH_00-07_64', code: 'CH_00-07_64' },
    ];

    dropdownItemsTypeGateway = [
        { name: 'Walrus-OD', code: 'Walrus-OD' },
        { name: 'Walrus-ID', code: 'Walrus-ID' },
        { name: 'Walrus-IDB', code: 'Walrus-IDB' },
    ];

    cities1: any[] = [];
    cities2: any[] = [];
    city1: any = null;
    city2: any = null;
    selectedCountry: any = null;
    selectedProvince: any = null;
    selectedCity: any = null;
    countries: any[] = [];
    provinces: any[] = [];
    cities: any[] = [];
    items: MenuItem[] = [];
    cardMenu: MenuItem[] = [];
    options: google.maps.MapOptions = {
        zoom: 8,
        center: { lat: this.lat, lng: this.lng },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map: google.maps.Map;
    marker: google.maps.Marker;

    constructor(
        private readonly locationService: LocationService,
        private readonly location: Location,
        private readonly companyService: CompanyService,
        private readonly gatewayService: GatewayService,
        private readonly messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.locationService.getCountries().subscribe(data => {
            this.countries = data;
        });
        this.loadCompaniesGateways();
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    initMap(): void {
        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
            ...this.options,
            scrollwheel: true,
        });
        this.marker = new google.maps.Marker({
            position: { lat: this.lat, lng: this.lng },
            map: this.map,
            draggable: true,
            title: 'Arrastra el marcador'
        });
        this.addMapEventListeners();
    }

    addMapEventListeners(): void {
        google.maps.event.addListener(this.marker, 'dragend', (event) => {
            this.lat = event.latLng.lat();
            this.lng = event.latLng.lng();
            this.updateLatLngInputs();
            this.updateMapLocation();
        });
        google.maps.event.addListener(this.map, 'click', (event) => {
            this.lat = event.latLng.lat();
            this.lng = event.latLng.lng();
            this.marker.setPosition(event.latLng);
            this.updateLatLngInputs();
            this.updateMapLocation();
        });
    }

    onCountryChange(country: any): void {
        this.selectedCountry = country;
        this.locationService.getProvinces(country.geonameId).subscribe(data => {
            this.provinces = data;
            this.cities = [];
            this.selectedProvince = null;
            this.selectedCity = null;
        });
    }

    onProvinceChange(province: any): void {
        this.selectedProvince = province;
        this.locationService.getCities(province.geonameId).subscribe(data => {
            this.cities = data;
            this.selectedCity = null;
            this.updateMapLocationFromCoordinates(parseFloat(province.lat), parseFloat(province.lng));
        });
    }

    onCityChange(city: any): void {
        this.selectedCity = city;
        this.lat = parseFloat(city.lat);
        this.lng = parseFloat(city.lng);
        this.updateMapLocation();
        this.marker.setPosition({ lat: this.lat, lng: this.lng });
    }

    updateMapLocationFromCoordinates(lat: number, lng: number): void {
        this.lat = lat;
        this.lng = lng;
        this.updateMapLocation();
    }

    updateMapLocation(): void {
        if (this.map && this.marker) {
            this.map.setCenter({ lat: this.lat, lng: this.lng });
            this.marker.setPosition({ lat: this.lat, lng: this.lng });
        }
    }

    onLatLngChange(): void {
        const latInput = <HTMLInputElement>document.getElementById('latInput');
        const lngInput = <HTMLInputElement>document.getElementById('lngInput');

        const newLat = parseFloat(latInput.value);
        const newLng = parseFloat(lngInput.value);
        if (!isNaN(newLat) && !isNaN(newLng)) {
            this.lat = newLat;
            this.lng = newLng;
            this.updateMapLocation();
        } else {
            alert('Por favor ingresa coordenadas válidas');
        }
    }

    updateLatLngInputs(): void {
        const latInput = <HTMLInputElement>document.getElementById('latInput');
        const lngInput = <HTMLInputElement>document.getElementById('lngInput');
        latInput.value = this.lat.toFixed(6);
        lngInput.value = this.lng.toFixed(6);
    }

    onGoBack(): void {
        this.location.back();
    }

    onSave(): void {
        this.gateway.comunication = this.valCheck.join(', ');
        if (this.selectedCompany) {
            this.gateway.companyUniqueKey = this.selectedCompany.uniqueKey;
        }
        if (this.selectedState) {
            this.gateway.state = this.selectedState.code;
        }
        if (this.selectedRegion) {
            this.gateway.region = this.selectedRegion.name;
        }
        if (this.valClass) {
            this.gateway.classB = this.valClass;
        }
        if (this.selectedSubRed) {
            this.gateway.subRed = this.selectedSubRed.name;
        }
        if (this.valPKTFWD) {
            this.gateway.pktfwd = this.valPKTFWD;
        }
        if (this.valPKTFWD) {
            this.gateway.pktfwd = this.valPKTFWD;
        }
        if (this.selectedGatewayType) {
            this.gateway.type = this.selectedGatewayType.name;
        }
        console.log(this.gateway);
        this.gatewayService.saveGateway(this.gateway).subscribe(
            response => {
                this.location.back();
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el gateway.', life: 3000 });
                console.error(error);
                this.createGatewayDialog = false;
            }
        );
    }

    onClear(): void {
        this.selectedState = null;
        this.valCheck = [];
        this.selectedRegion = [];
        this.selectedSubRed = [];
        this.valClass = false;
        this.valPKTFWD = false;
        this.typeAutentification = [];
        this.selectedCountry = null;
        this.selectedProvince = null;
        this.selectedCity = null;
        this.lat = -0.345638;
        this.lng =  -78.447889;
        this.updateLatLngInputs();
        this.updateMapLocation();
        this.marker.setPosition({ lat: this.lat, lng: this.lng });
        this.gateway.name = " ";
        this.selectedCompany = null;
        this.selectedGatewayType = null;
        this.typeAutentification = [];

        this.selectedGateway = [];
    }

    loadCompaniesGateways(): void {
        this.companyService.getCompanies().subscribe(data => {
            this.companies = data;
        });

        this.gatewayService.getGatewaysByCompany(this.companyKey).subscribe(data => {
            this.gateways = data;
        });
    }
}
