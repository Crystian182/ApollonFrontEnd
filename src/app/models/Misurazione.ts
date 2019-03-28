import { Centralina } from './Centralina';

export interface Misurazione { 
    _id?: Number;
    valore?: Number,
    data?: Date,
    centralina?: Centralina;
}
