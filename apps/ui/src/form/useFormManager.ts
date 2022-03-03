import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import { ObjectShape } from "yup/lib/object";

interface IProps<TypeValues>
{
    initialValues: TypeValues;
    validations: ObjectShape;
    onSubmit: (values: TypeValues, form: FormikHelpers<TypeValues>) => Promise<void>;
}

export function useFormManager<TypeValues> (props: IProps<TypeValues>)
{
    const { initialValues, validations, onSubmit } = props;

    const formManager = useFormik<TypeValues>({
        initialValues: initialValues,
        validationSchema: Yup.object().shape(validations),
        onSubmit: async (values, formikHelpers) =>
        {
            await onSubmit(Yup.object().shape(validations).cast(values) as TypeValues, formikHelpers);
        },
        enableReinitialize: true
    })

    return formManager;
}