import SectionCollapse from '../../src/components/SectionCollapse';
import { useRef, useState } from 'react';
import { DataGrid, GridColDef, GridRowModel, GridSelectionModel } from '@mui/x-data-grid';
import { Button, Grid, Stack } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, Messages } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { Form } from '../../src/form/Form';
import { TextInput } from '../../src/form/input/TextInput';
import { useApiManager } from '../../src/api/useApiManager';
import { FormikHelpers } from 'formik';
import { RegistrarCanchaFormVM, Validator } from "@futbolyamigos/data";
import { useSWRConfig } from "swr";
import { useNotification } from '../../src/notifications/useNotification';
import { DialogAlert } from '../../src/components/DialogAlert';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { NumberInput } from '../../src/form/input/NumberInput';
import { LoadingButton } from '@mui/lab';

const columns: GridColDef[] = [
    {
        field: Labels.Nombre,
        headerName: Labels.Nombre,
        flex: 1,
        hideable: false
    },
    {
        field: Labels.Identificador,
        headerName: 'Nro',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left'
    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [canchaSeleccionada, setCanchaSeleccionada] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStateCanchaForm: RegistrarCanchaFormVM = {
        _id: null,
        Nombre: '',
        Identificador: null,
    };
    const [canchaForm, setCanchaForm] = useState<RegistrarCanchaFormVM>(initialStateCanchaForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarCanchaFormVM>({
        initialValues: canchaForm,
        validations: {
            [Labels.Nombre]: Yup.string().required('requerido'),
            [Labels.Identificador]: Yup.number().nullable().required('requerido')
        },
        onSubmit: async (cancha: RegistrarCanchaFormVM, formikHelpers: FormikHelpers<RegistrarCanchaFormVM>) => {
            try
            {
                await Post('cancha', cancha);
                mutate('cancha', true);
                setShowSectionDetalle(false);
                setCanchaSeleccionada([]);
                resetForm();
                showNotificationSuccess(Messages.SeGuardoExitosamente)

            } catch (e)
            {
                return;
            }
        }

    })
    const refNombreForm = useRef<HTMLElement>();

    const { data: canchasFromDB, loading } = useGetSWR<RegistrarCanchaFormVM[]>('cancha');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setCanchaSeleccionada([]);
        focusNombreForm();
    };

    const onCancelDetail = () => {
        resetForm();
        setCanchaSeleccionada([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStateCanchaForm);
        setCanchaForm(initialStateCanchaForm)
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const torneo = await Get<RegistrarCanchaFormVM>(`cancha/${canchaSeleccionada[0].toString()}`);
            setCanchaForm(torneo);
            setShowSectionDetalle(true);
            focusNombreForm();

        } catch (e)
        {
            return;
        }
    };

    const onDeleteDialogAlert = async () => {
        setOpenDialog(true);
    };

    const onDeleteDetail = async () => {
        try
        {
            await Delete(`cancha/${canchaSeleccionada[0].toString()}`);
            mutate('cancha', true);
            setOpenDialog(false);
            setCanchaSeleccionada([]);
            showNotificationSuccess(Messages.SeEliminoExitosamente);

        } catch (e)
        {
            return;
        }
    };

    const focusNombreForm = () => {
        setTimeout(() => {
            refNombreForm.current.focus();
        }, 0);
    }

    return (
        <>
            <SectionCollapse title={Labels.Canchas} expanded>
                <DataGrid
                    loading={loading}
                    rows={canchasFromDB?.length ? canchasFromDB : []}
                    columns={columns}
                    localeText={LocaleDataGrid.Spanish}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    pagination
                    disableSelectionOnClick
                    autoHeight
                    onSelectionModelChange={(newSelectionModel) => {
                        if (newSelectionModel.length > 1)
                        {
                            const selectionSet = new Set(canchaSeleccionada);
                            const result = newSelectionModel.filter((s) => !selectionSet.has(s));
                            setCanchaSeleccionada(result);

                        } else
                        {
                            setCanchaSeleccionada(newSelectionModel);
                        }
                    }}
                    selectionModel={canchaSeleccionada}
                    checkboxSelection
                    sx={{
                        '.MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                            display: "none"
                        }
                    }}
                    getRowId={(row: GridRowModel) => row._id}
                />
                <Stack direction='row' justifyContent="right" mt={2} spacing={1}>
                    <Button variant="contained" onClick={onCreateDetail}>
                        {Labels.Crear}
                    </Button>
                    <Button variant="contained" color='info' disabled={canchaSeleccionada.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    <Button variant="contained" color='error' disabled={canchaSeleccionada.length ? false : true} onClick={onDeleteDialogAlert}>
                        {Labels.Eliminar}
                    </Button>
                </Stack>
            </SectionCollapse>
            <SectionCollapse title={Labels.Detalle} expanded={showsectionDetalle}>
                <Form handleSubmit={formManager.handleSubmit}>
                    <Grid container columnSpacing={5}>
                        <Grid item xs={3}>
                            <TextInput
                                name={Labels.Nombre}
                                label={Labels.Nombre}
                                formManager={formManager}
                                refElement={refNombreForm}
                                validator={Validator.ConEspacios}
                                textTransform='uppercase'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <NumberInput
                                name={Labels.Identificador}
                                label='Nro Identificador'
                                formManager={formManager}
                                validator={Validator.SoloNumerosEnterosPositivos}
                            />
                        </Grid>
                    </Grid>
                    <Stack direction='row' justifyContent="right" mt={2} spacing={1}>
                        <LoadingButton loading={formManager.isSubmitting} variant="contained" type='submit' color='success' disabled={!formManager.isValid}>
                            {Labels.Guardar}
                        </LoadingButton>
                        <Button variant="contained" color='error' onClick={onCancelDetail}>
                            {Labels.Cancelar}
                        </Button>
                    </Stack>
                </Form>
            </SectionCollapse>
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar cancha' content='Se eliminará la cancha. ¿Estás seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;