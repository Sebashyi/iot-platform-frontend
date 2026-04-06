import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocationService } from '../../../../service/location.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Company } from '../../../../api/company.model'
import { Meter } from '../../../../api/meter.model';
import { CompanyService } from '../../../../service/company.service';
import { MeterService } from '../../../../service/meter.service';
import { Gateway } from '../../../../api/gateway.model';
import { GatewayService } from '../../../../service/gateway.service';
import { ActivatedRoute } from '@angular/router';
import { Brand } from '../../../../api/brand.model';
import { Model } from '../../../../api/model.model';
import { BrandService } from '../../../../service/brand.service';

@Component({
    selector: 'app-edit-meter',
    templateUrl: './editmeter.component.html',
    styleUrls: ['./editmeter.component.css'],
    providers: [MessageService]
})
export class EditMeterComponent implements OnInit, AfterViewInit {

    selectedState: any = null;
    selectedBrand: any = null;
    selectedModel: any = null;
    selectedCompany: any = null;
    selectedRegion: any = null;
    selectedTypeProduct: any = null;
    selectedComunication: string = '';
    selectedSubRed: any = null;
    selectedGateway: any = null;
    selectedDiameter: any = null;
    valClassSupport: string = '';
    typeAutentification: string = '';
    companies: Company[] = [];
    gateways: Gateway[] = [];
    lat: number = -0.345638;
    lng: number = -78.447889;
    companyKey: string = localStorage.getItem('selectedCompanyId');
    meters: Meter[] = [];
    changeMeterDialog: boolean = false;

    meter: Meter = {
        uniqueKey: undefined,
        name: '',
        devEui: '',
        serial: '',
        diameter: '',
        createdAt: undefined,
        typeCommunication: '',
        state: false,
        model: '',
        classSupport: '',
        lastCommunication: null,
        valveState: '',
        latitude: this.lat,
        longitude: this.lng,
        companyUniqueKey: '',
        typeProduct: '',
        subRed: '',
        appSkey: '',
        appKey: '',
        nwkSkey: '',
        devAddr: '',
        authenticationType: '',
        euiAplication: '',
        directionGprs: '',
        imei: '',
        serialNumberGprs: '',
        gatewayUniqueKey: '',
        region: '',
        detail: ''
    };
    brand: Brand = {
        name: '',
        uniqueKey: '',
        models: []
    };
    model: Model = {
        name: '',
        uniqueKey: '',
        brand: this.brand
    };
    dropdownBrandMeter: Brand[] = [];
    dropdownModelMeter: Model[] = [];
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
        { name: 'RU864', code: 'RU864' },
    ];
    dropdownItemsProductType = [
        { name: 'rhf3mr01', code: 'rhf3mr01' },
        { name: 'rhf3m485', code: 'rhf3m485' },
        { name: 'lorawan', code: 'lorawan' },
    ];
    dropdownItemsTypeGateway = [
        { name: 'Wi-Fi', code: 'WIFI' },
        { name: 'Ethernet', code: 'ETH' },
        { name: 'Bluetooth', code: 'BLU' },
        { name: 'Zigbee', code: 'ZIG' }
    ];

    dropdownItemsSubRed: { name: string; code: string }[] = [];

    private readonly regionSubredMap: { [key: string]: { name: string; code: string }[] } = {
        'CN470': [
            { name: 'CH_00-07', code: 'CH_00-07' },
            { name: 'CH_08-15', code: 'CH_08-15' },
            { name: 'CH_16-23', code: 'CH_16-23' },
            { name: 'CH_24-31', code: 'CH_24-31' },
            { name: 'CH_32-39', code: 'CH_32-39' },
            { name: 'CH_40-47', code: 'CH_40-47' },
            { name: 'CH_48-55', code: 'CH_48-55' },
            { name: 'CH_56-63', code: 'CH_56-63' },
        ],
        'CN470PREQUEL': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'CN470PHOENIX': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'CN470ALID': [{ name: 'CH_08-15', code: 'CH_08-15' }],
        'CN470ALIS': [{ name: 'CH_08-15', code: 'CH_08-15' }],
        'AS923': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'AS923MYS': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'AS923IND': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'EU868': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'EU433': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'US915': [{ name: 'CH_00-07_64', code: 'CH_00-07_64' }],
        'AU915': [
            { name: 'CH_00-07_64', code: 'CH_00-07_64' },
            { name: 'CH_08-15_65', code: 'CH_08-15_65' },
        ],
        'IN865': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'KR920': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'RU864': [{ name: 'CH_00-07', code: 'CH_00-07' }],
        'ID920': [{ name: 'CH_00-07', code: 'CH_00-07' }],
    };

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
    dropdownItemsDiameter = [
        { name: '15', code: '15' },
        { name: '20', code: '20' },
        { name: '25', code: '25' },
        { name: '40', code: '40' },
        { name: '50', code: '50' },
        { name: 'DN50', code: 'DN50' },
        { name: 'DN65', code: 'DN65' },
        { name: 'DN80', code: 'DN80' },
        { name: 'DN100', code: 'DN100' },
        { name: 'DN125', code: 'DN125' },
        { name: 'DN150', code: 'DN150' },
        { name: 'DN200', code: 'DN200' },
        { name: 'DN250', code: 'DN250' },
        { name: 'DN300', code: 'DN300' },
        { name: 'DN400', code: 'DN400' }
    ];

    constructor(
        private readonly locationService: LocationService,
        private readonly location: Location,
        private readonly companyService: CompanyService,
        private readonly meterService: MeterService,
        private readonly gatewayService: GatewayService,
        private readonly route: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly brandService: BrandService
    ) { }

    ngOnInit(): void {
        this.locationService.getCountries().subscribe(data => {
            this.countries = data;
        });
        this.meterService.getMetersByCompany(this.companyKey).subscribe(data => {
            this.meters = data;
        });
        const meterId = this.route.snapshot.paramMap.get('id');
        if (meterId) {
            this.companyService.getCompanies().subscribe(companies => {
                this.companies = companies;
                this.brandService.getAllBrands().subscribe(brands => {
                    this.dropdownBrandMeter = brands;
                    this.loadSelectedMeter(meterId);
                });
            });
        }
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    initMap(): void {
        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
            ...this.options,
            scrollwheel: true,
            zoom: 18
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

    onRegionChange(): void {
        this.selectedSubRed = null;
        this.dropdownItemsSubRed = this.selectedRegion
            ? (this.regionSubredMap[this.selectedRegion.code] ?? [])
            : [];
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
        if (this.selectedState) {
            this.meter.state = this.selectedState.code;
        }
        if (this.selectedBrand) {
            if (this.selectedState) {
                this.meter.model = this.selectedModel.name;
            }
        }
        if (this.selectedDiameter) {
            this.meter.diameter = this.selectedDiameter.code;
        }
        
        this.meter.typeCommunication = this.selectedComunication;
        if (this.selectedCompany) {
            this.meter.companyUniqueKey = this.selectedCompany.uniqueKey;
        }
        if (this.valClassSupport) {
            this.meter.classSupport = this.valClassSupport;
        }
        if (this.selectedRegion) {
            this.meter.region = this.selectedRegion.name;
        }
        if (this.selectedTypeProduct) {
            this.meter.typeProduct = this.selectedTypeProduct.name;
        }
        if (this.selectedSubRed) {
            this.meter.subRed = this.selectedSubRed.name;
        }
        if (this.typeAutentification) {
            this.meter.authenticationType = this.typeAutentification;
        }
        if (this.selectedGateway) {
            this.meter.gatewayUniqueKey = this.selectedGateway.uniqueKey;
        }
        this.meter.latitude = this.lat;
        this.meter.longitude = this.lng;
        this.meterService.updateMeter(this.meter.uniqueKey, this.meter).subscribe(
            response => {
                this.location.back();
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el medidor.', life: 3000 });
                console.error(error);
                this.changeMeterDialog = false;
            }
        );
    }

    onClear(): void {
        this.locationService.getCountries().subscribe(data => {
            this.countries = data;
        });
        this.loadCompaniesMeters();
        const meterId = this.route.snapshot.paramMap.get('id');
        if (meterId) {
            this.brandService.getAllBrands().subscribe(data => {
                this.dropdownBrandMeter = data;
            });
            this.loadSelectedMeter(meterId);
        }
    }

    loadCompaniesMeters(): void {
        this.companyService.getCompanies().subscribe(data => {
            this.companies = data;
        });
        this.meterService.getMetersByCompany(this.companyKey).subscribe(data => {
            this.meters = data;
        });
    }

    loadGatewaysByCompany(companyKey: string): void {
        this.gatewayService.getGatewaysByCompany(companyKey).subscribe(data => {
            this.gateways = data;
            this.selectedGateway = this.gateways.find(item => item.uniqueKey === this.meter.gatewayUniqueKey);
        });
    }

    loadSelectedMeter(meterId: string): void {
        this.meterService.getMeterById(meterId).subscribe({
            next: (data: Meter) => {
                this.meter = data;
                this.dropdownBrandMeter.forEach(brand => {
                    brand.models.forEach(model => {
                        if (model.name === this.meter.model) {
                            this.selectedBrand = brand;
                            this.selectedModel = model;
                            this.dropdownModelMeter = brand.models;
                        }
                    });
                });
                this.lat = this.meter.latitude;
                this.lng = this.meter.longitude;
                this.selectedCompany = this.companies.find(item => item.uniqueKey === this.meter.companyUniqueKey);
                this.selectedDiameter = this.dropdownItemsDiameter.find(item => item.name === this.meter.diameter);
                this.selectedState = this.dropdownItemsState.find(item => item.code === this.meter.state.toString());
                this.selectedComunication = this.meter.typeCommunication;
                this.selectedRegion = this.dropdownItemsRegion.find(item => item.name === this.meter.region);
                this.dropdownItemsSubRed = this.selectedRegion
                    ? (this.regionSubredMap[this.selectedRegion.code] ?? [])
                    : [];
                this.selectedSubRed = this.dropdownItemsSubRed.find(item => item.name === this.meter.subRed);
                this.valClassSupport = this.meter.classSupport;
                this.selectedTypeProduct = this.dropdownItemsProductType.find(item => item.name === this.meter.typeProduct);
                this.selectedSubRed = this.dropdownItemsSubRed.find(item => item.name === this.meter.subRed);
                this.typeAutentification = this.meter.authenticationType;
                this.selectedGateway = this.gateways.find(item => item.uniqueKey === this.meter.gatewayUniqueKey);
                this.updateMapLocation();
                if (this.selectedCompany) {
                    this.loadGatewaysByCompany(this.selectedCompany.uniqueKey);
                }
            },
            error: (error) => {
                console.error('Error al cargar el medidor:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el medidor.', life: 3000 });
            }
        });
    }

    ngOnDestroy(): void {
        google.maps.event.clearInstanceListeners(this.map);
        this.map = null;
        this.marker.setMap(null);
        this.marker = null;
        this.meter = null;
    }

    loadModelsByBrand(): void {
        if (this.selectedBrand && this.selectedBrand.uniqueKey) {
            this.dropdownBrandMeter.forEach(brand => {
                if (brand.uniqueKey === this.selectedBrand.uniqueKey) {
                    this.dropdownModelMeter = brand.models;
                }
            });
        } else {
            this.dropdownModelMeter = [];
            console.warn('selectedBrand es null o no tiene un uniqueKey válido.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Modelo no válido.' });
        }
    }
}
