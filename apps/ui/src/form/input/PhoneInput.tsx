import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';
import { ChangeEvent, Ref } from 'react';
import ReactPhoneInput, { CountryData } from 'react-phone-input-material-ui';
import { Validator } from "@futbolyamigos/data";

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    refElement?: Ref<HTMLElement>;
    formManager: FormikProps<Record<any, any>>
}

export function PhoneInput (props: IPropsInput) {
    const { name, label, disabled, size, refElement, formManager } = props;
    const { values, touched, errors, setFieldValue, setFieldTouched } = formManager;

    const handleChangeCustom = (value: string, data: Record<string, unknown> | CountryData, event: ChangeEvent<HTMLInputElement>, formattedValue: string) => {

        setFieldTouched(name);

        setFieldValue(name, value);
    }

    return (
        <ReactPhoneInput
            value={values[name]}
            country='ar'
            enableAreaCodes
            onChange={handleChangeCustom}
            component={TextField}
            onlyCountries={['ar']}
            masks={{ ar: '(...) . .. .. ..' }}
            enableAreaCodeStretch
            placeholder='+54 (xxx) x xx xx xx'
            inputProps={{
                fullWidth: true,
                id: name,
                name: name,
                label: label,
                error: (touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name]),
                helperText: (touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name],
                type: 'text',
                size: size ? size : 'small',
                variant: 'outlined',
                disabled: disabled ? disabled : false,
                margin: 'normal'
            }}
        />
    );
}
