import * as Yup from 'yup';


/**
 * Discrimina entradas de teclado no válidas
 */
export class Validator {

    static SoloLetras (
        value: string
    ): boolean {
        return !/(\W|\d|_)/g.test(value)
    }

    static SinEspacios (
        value: string
    ): boolean {
        return !/(\s)/g.test(value)
    }

    static ConEspacios (
        value: string
    ): boolean {

        const text = value;

        if (text.length === 1 && text === ' ')
        {
            return false;
        } else
        {
            return !/\s{2,}/g.test(text) && text[0] != ' ';
        }
    }

    static SoloNumerosEnterosPositivos (
        value: string
    ): boolean {
        const schemaValueInput = Yup.number().positive().integer();
        const total = value.length;
        if (total > 1 && value[total - 1] == ' ') return false;
        return schemaValueInput.isValidSync(value) || value === ''

    }

    static NumeroTelefono (
        value: string
    ): boolean {
        return /54341[0-9]{7}/.test(value)

    }
}