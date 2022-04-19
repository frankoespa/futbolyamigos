import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    formManager: FormikProps<Record<any, any>>,
    validator: (value: string) => boolean
    width?: number
}

export function NumberInput (props: IPropsInput) {
    const { name, label, disabled, size, formManager, validator, width } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;

    const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '' && validator(e.target.value))
        {
            setFieldTouched(name);
            setFieldValue(name, parseInt(e.target.value));
        }
        if (e.target.value === '')
        {
            setFieldTouched(name);
            setFieldValue(name, null);
        }
    }

    return (
        <TextField
            fullWidth={width ? null : true}
            id={name}
            name={name}
            label={label}
            value={values[name] === null ? '' : values[name]}
            onChange={handleChangeCustom}
            onBlur={handleBlur}
            error={(touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name])}
            helperText={(touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name]}
            type='text'
            size={size ? size : 'small'}
            variant='outlined'
            disabled={disabled ? disabled : false}
            margin='normal'
            sx={{ width: width ? width : null }}
        />
    );
}
