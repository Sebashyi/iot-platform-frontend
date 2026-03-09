export interface MessageDecoded {
    uniqueKey?: string;
    typeMessage: string;
    controlCode: string;
    dateLength: string;
    dataIdentification1: string;
    dataIdentification2: string;
    countNumber: string;
    unit: number;
    volumeData: number;
    meterStateSt1: string;
    meterStateSt2: string;
    batteryCapacity: string;
    lowBatteryAlarm: boolean;
    emptyPipeAlarm: boolean;
    reverseFlowAlarm: boolean;
    overRangeAlarm: boolean;
    overTempratureAlarm: boolean;
    eepromError: boolean;
    leakageAlarm: boolean;
    burstAlarm: boolean;
    tamperAlarm: boolean;
    freezingAlarm: boolean;
    createdAt: Date;
    sendMessageTime: string;
    devEui: string;
    rawData: string;
}