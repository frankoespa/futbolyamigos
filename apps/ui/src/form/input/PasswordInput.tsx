import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    formManager: FormikProps<Record<any, any>>
}

export function PasswordInput (props: IPropsInput) {
    const { name, label, disabled, size, formManager } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;

    const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!/(\s)/g.test(e.target.value))
        {
            setFieldTouched(name);
            setFieldValue(name, e.target.value);
        }

    }

    return (
        <TextField
            fullWidth
            id={name}
            name={name}
            label={label}
            value={values[name]}
            onChange={handleChangeCustom}
            onBlur={handleBlur}
            error={(touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name])}
            helperText={(touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name]}
            type='password'
            size={size ? size : 'small'}
            variant='outlined'
            disabled={disabled ? disabled : false}
            sx={{
                input: { color: 'text.secondary' },
                "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                        borderColor: "text.secondary"
                    }
                }
            }}
            margin='normal'
        />
    );
}
