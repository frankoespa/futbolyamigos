import { DatePicker } from '@mui/lab';
import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';
import { Moment } from 'moment';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    formManager: FormikProps<Record<any, any>>;
    maxDate?: Moment;
    disableFuture?: boolean
}

export function DateInput (props: IPropsInput) {
    const { name, label, disabled, size, formManager, maxDate, disableFuture } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;

    return (
        <DatePicker
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
                    setFieldValue(name, date.hour(0).minute(0).second(0).millisecond(0).toISOString())

                }
            }}
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
