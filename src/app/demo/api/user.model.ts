export interface User {
    uniqueKey?: string;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    email: string;
    password: string;
    createdAt?: Date;
    role: string;
    phoneNumber: string;
}