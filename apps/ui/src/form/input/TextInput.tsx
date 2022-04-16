import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';
import { Ref } from 'react';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    refElement?: Ref<HTMLElement>;
    formManager: FormikProps<Record<any, any>>,
    validator?: (value: string) => boolean,
    textTransform?: 'uppercase' | 'lowercase' | 'none'
}

export function TextInput (props: IPropsInput) {
    const { name, label, disabled, size, refElement, formManager, validator, textTransform } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;

    const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {

        let text = e.target.value;

        if (textTransform)
        {
            switch (textTransform)
            {
                case 'uppercase':
                    text = text.toUpperCase();
                    break;
                case 'lowercase':
                    text = text.toLowerCase();
                    break;

                default:
                    break;
            }
        }

        if (validator && validator(text))
        {
            setFieldTouched(name);
            setFieldValue(name, text);
        }

        if (!validator)
        {
            setFieldTouched(name);
            setFieldValue(name, text);
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
            type='text'
            size={size ? size : 'small'}
            variant='outlined'
            disabled={disabled ? disabled : false}
            margin='normal'
            inputRef={refElement}
        />
    );
}
