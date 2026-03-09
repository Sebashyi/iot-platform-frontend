export interface Message {
    uniqueKey?: string;          
    createdAt: Date;            
    typeMessage: string;        
    communication: string | null;      
    devEui: string | null;             
    freq: number;               
    dr: number;                 
    fcnt: number;               
    port: number;               
    confirmed: boolean;         
    gws: string;                
    rawReading: string | null;         
    serialMeter: string | null;        
}