import { Model } from './model.model';

export interface Brand {
    uniqueKey?: string;
    name: string;
    models: Model[];
}