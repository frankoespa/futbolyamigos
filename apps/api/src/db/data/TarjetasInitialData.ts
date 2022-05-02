import { AnyKeys } from 'mongoose';
import { Tarjeta } from '../../tarjeta/schema/TarjetaSchema';

export const TarjetasInitialData: AnyKeys<Tarjeta>[] = [
    {
        _id: 1,
        Description: 'Amarilla'

    },
    {
        _id: 2,
        Description: 'Roja'
    },
    {
        _id: 3,
        Description: 'Roja (Doble Amarilla)'
    }
];