export interface Gateway {
    uniqueKey?: string;                
    name: string;             
    type: string;             
    region: string;           
    subRed: string;          
    state: boolean;           
    classB: boolean;
    pktfwd: boolean;
    latitude: number;
    longitude: number;
    mqtt: boolean;
    createdAt?: Date;
    companyUniqueKey: string;
    comunication: string,
    macDirection: string,
    gwEui: string,
}
