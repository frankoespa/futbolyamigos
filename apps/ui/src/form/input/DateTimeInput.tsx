import { DateTimePicker } from '@mui/lab';
import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';
import { Moment } from 'moment';
import { Ref } from 'react';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    formManager: FormikProps<Record<any, any>>;
    maxDate?: Moment;
    disableFuture?: boolean;
    refElement?: Ref<HTMLInputElement>;

}

export function DateTimeInput (props: IPropsInput) {
    const { name, label, disabled, size, formManager, maxDate, disableFuture, refElement } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;

    return (
        <DateTimePicker
            label={label}
            value={values[name]}
            onChange={(date: Moment) => {
                if (!date)
                {
                    setFieldTouched(name);
                    setFieldValue(name, null);

                } else
                {
                    setFieldTouched(name);
                    setFieldValue(name, date.second(0).millisecond(0).toISOString())

                }
            }}
            inputRef={refElement}
            renderInput={(params) => <TextField
                {...params}
                id={name}
                fullWidth
                name={name}
                onBlur={handleBlur}
                error={(touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name])}
                helperText={(touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name]}
                size={size ? size : 'small'}
                variant='outlined'
                disabled={disabled ? disabled : false}
                margin='normal'
                type='date'
            />}
            clearable
            clearText='Limpiar'
            maxDate={maxDate ? maxDate : null}
            disableFuture={disableFuture}
        />
    );
}
