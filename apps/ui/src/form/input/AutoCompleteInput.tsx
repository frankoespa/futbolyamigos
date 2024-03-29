import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FormikProps } from 'formik';
import { Ref, useEffect, useState } from 'react';
import { useGetSWR } from '../../api/useGetSWR';
import { DropDownVM } from "@futbolyamigos/data";
import { Key } from "swr";


interface IPropsInput {
    urlApiData: Key
    name: string;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    refElement?: Ref<HTMLElement>;
    formManager: FormikProps<Record<any, any>>;
}

export function AutoCompleteInput (props: IPropsInput) {
    const { name, label, disabled, size, refElement, formManager, urlApiData } = props;
    const { values, touched, errors, handleBlur, setFieldValue, setFieldTouched } = formManager;
    const [inputValue, setInputValue] = useState('');
    const { data, loading } = useGetSWR<DropDownVM<string>[]>(urlApiData);
    const valueForm = values[name];
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (!valueForm)
        {
            setValue(null);
            setInputValue('')
        } else
        {
            if (!loading)
                setValue(data.find(i => i._id === valueForm))
        }
    }, [valueForm, data, loading])

    return (
        <Autocomplete
            options={loading ? [] : data}
            onChange={(e, value: DropDownVM<string | number>) => {
                setValue(value);
                setFieldTouched(name);
                setFieldValue(name, value !== null ? value._id : null);
            }}
            onBlur={handleBlur}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue)
            }}
            clearText='Borrar'
            openText='Abrir'
            value={value}
            loading={loading}
            loadingText='Cargando...'
            noOptionsText='Sin datos'
            fullWidth
            id={name}
            size={size ? size : 'small'}
            disabled={disabled ? disabled : false}
            getOptionLabel={(option) => option.Description}
            isOptionEqualToValue={(option, value) => {
                return option._id === value._id
            }}
            renderInput={(params) => <TextField
                {...params}
                name={name}
                label={label}
                error={(touched as Record<string, boolean>)[name] && Boolean((errors as Record<string, string>)[name])}
                helperText={(touched as Record<string, boolean>)[name] && (errors as Record<string, string>)[name]}
                variant='outlined'
                margin='normal'
                inputRef={refElement}
            />}
        />
    );
}
