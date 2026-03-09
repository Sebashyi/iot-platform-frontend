import { Brand } from './brand.model';

export interface Model {
    uniqueKey?: string;
    name: string;
    brand: Brand;
}