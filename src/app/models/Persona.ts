import { Recapito } from './Recapito';

export interface Persona {
    idpersona?: Number,
    nome?: String,
    cognome?: String,
    data_nascita?: Date,
    recapiti?: Recapito[]
}