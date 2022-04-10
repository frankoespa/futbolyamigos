import { Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { FormikProps } from 'formik';

interface IPropsInput {
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    formManager: FormikProps<Record<any, any>>
}

export function CheckBoxInput (props: IPropsInput) {
    const { name, label, disabled, size, formManager } = props;
    const { values, handleBlur, setFieldValue, setFieldTouched } = formManager;

    const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === 'true' ? false : true;
        setFieldTouched(name);
        setFieldValue(name, value);
    }

    return (
        <Stack direction='column' justifyContent="center" height='100%'>
            <FormGroup >
                <FormControlLabel control={<Checkbox size={size ? size : undefined}
                    checked={values[name]}
                    value={values[name]}
                    onChange={handleChangeCustom} />} label={label} disabled={disabled ? disabled : false} name={name}
                />
            </FormGroup>
        </Stack >
    )

}