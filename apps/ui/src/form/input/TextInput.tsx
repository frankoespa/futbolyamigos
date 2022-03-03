import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    formManager: FormikProps<Record<string, unknown>>
}

export function TextInput (props: IPropsInput) {
    const { name, label, disabled, size, formManager } = props;
    const { values, handleChange, touched, errors, handleBlur } = formManager;

    return (
        <TextField
            fullWidth
            id={name}
            name={name}
            label={label}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={(touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name])}
            helperText={(touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name]}
            type='text'
            size={size ? size : 'small'}
            variant='outlined'
            disabled={disabled ? disabled : false}
        />
    );
}
