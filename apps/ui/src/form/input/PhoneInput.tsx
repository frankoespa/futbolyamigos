import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';
import { ChangeEvent, Ref } from 'react';
import ReactPhoneInput, { CountryData } from 'react-phone-input-material-ui';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    refElement?: Ref<HTMLElement>;
    formManager: FormikProps<Record<any, any>>,
    validator?: (value: string) => boolean
}

export function PhoneInput (props: IPropsInput) {
    const { name, label, disabled, size, refElement, formManager, validator } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;

    const handleChangeCustom = (value: string, data: Record<string, unknown> | CountryData, event: ChangeEvent<HTMLInputElement>, formattedValue: string) => {
        console.log(value)
        // if (validator && validator(e.target.value))
        // {
        //     setFieldTouched(name);
        //     setFieldValue(name, e.target.value);
        // }

        // if (!validator)
        // {
        //     setFieldTouched(name);
        //     setFieldValue(name, e.target.value);
        // }

    }

    return (
        <ReactPhoneInput
            value={values[name]}
            country='ar'
            enableAreaCodes
            onChange={handleChangeCustom} // passed function receives the phone value
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
                // value={values[name]}
                // onChange={handleChangeCustom}
                // onBlur={handleBlur}
                error: (touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name]),
                helperText: (touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name],
                type: 'text',
                size: size ? size : 'small',
                variant: 'outlined',
                disabled: disabled ? disabled : false,
                margin: 'normal',
                inputRef: { refElement }
            }}
        />
    );
}
