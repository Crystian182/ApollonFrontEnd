import { Centralina } from './Centralina';

export interface Misurazione { 
    id?: Number;
    valore?: Number,
    data?: Date,
    centralina: Centralina;
}
