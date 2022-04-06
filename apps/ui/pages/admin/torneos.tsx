import SectionCollapse from '../../src/components/SectionCollapse';
import { useState } from 'react';
import { DataGrid, GridColDef, GridRowModel, GridSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { Button, Grid, Stack } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { DateInput } from '../../src/form/input/DateInput';
import { Form } from '../../src/form/Form';
import { TextInput } from '../../src/form/input/TextInput';
import { useApiManager } from '../../src/api/useApiManager';
import { FormikHelpers } from 'formik';
import { RegistrarTorneoVM } from "@futbolyamigos/data";
import { CheckBoxInput } from '../../src/form/input/CheckBoxInput';
import { useSWRConfig } from "swr";
import { useNotification } from '../../src/notifications/useNotification';
import { DialogAlert } from '../../src/components/DialogAlert';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';

const columns: GridColDef[] = [
    {
        field: Labels.Nombre,
        headerName: Labels.Nombre,
        flex: 1
    },
    {
        field: Labels.FechaInicio,
        headerName: 'Fecha Inicio',
        type: 'date',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            return moment(params.value as Date).format('DD-MM-YYYY');
        },

    },
    {
        field: Labels.FechaFin,
        headerName: 'Fecha Fin',
        type: 'date',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            if (!params.value) return null;
            return moment(params.value as Date).format('D-M-YYYY');
        }
    },
    {
        field: Labels.Finalizado,
        headerName: 'Finalizado',
        type: 'boolean',
        flex: 1

    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [torneoSeleccionado, setTorneoSeleccionado] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStateTorneoForm = {
        _id: null,
        Nombre: '',
        FechaInicio: null,
        FechaFin: null,
        Finalizado: false
    };
    const [torneoForm, setTorneoForm] = useState<RegistrarTorneoVM>(initialStateTorneoForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarTorneoVM>({
        initialValues: torneoForm,
        validations: {
            [Labels.Nombre]: Yup.string().required('requerido'),
            [Labels.FechaInicio]: Yup.date().required('requerido').typeError('formato incorrecto'),
            [Labels.FechaFin]: Yup.date().notRequired().nullable().typeError('formato incorrecto')
        },
        onSubmit: async (torneo: RegistrarTorneoVM, formikHelpers: FormikHelpers<RegistrarTorneoVM>) => {
            await Post('torneo', torneo);
            mutate('torneo', true);
            resetForm();
            setShowSectionDetalle(false);
            showNotificationSuccess('Se guardó exitosamente.');

        }

    })

    const { data: torneosFromDB, loading } = useGetSWR<RegistrarTorneoVM[]>('torneo');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
    };

    const onCancelDetail = () => {
        resetForm();
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStateTorneoForm)
    }

    const onEditDetail = async () => {
        resetForm();
        const torneo = await Get<RegistrarTorneoVM>(`torneo/${torneoSeleccionado[0].toString()}`);
        setTorneoForm(torneo);
        setShowSectionDetalle(true)
    };

    const onDeleteDialogAlert = async () => {
        setOpenDialog(true);
    };

    const onDeleteDetail = async () => {
        await Delete(`torneo/${torneoSeleccionado[0].toString()}`);
        mutate('torneo', true);
        setOpenDialog(false);
        showNotificationSuccess('Se eliminó exitosamente.');

    };

    return (
        <>
            <SectionCollapse title={Labels.Torneos} expanded>
                <DataGrid
                    loading={loading}
                    rows={torneosFromDB?.length ? torneosFromDB : []}
                    columns={columns}
                    localeText={LocaleDataGrid}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    pagination
                    disableColumnFilter
                    disableColumnMenu
                    disableSelectionOnClick
                    autoHeight
                    onSelectionModelChange={(newSelectionModel) => {
                        if (newSelectionModel.length > 1)
                        {
                            const selectionSet = new Set(torneoSeleccionado);
                            const result = newSelectionModel.filter((s) => !selectionSet.has(s));
                            setTorneoSeleccionado(result);

                        } else
                        {
                            setTorneoSeleccionado(newSelectionModel);
                        }
                    }}
                    selectionModel={torneoSeleccionado}
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
                    <Button variant="contained" color='info' disabled={torneoSeleccionado.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    <Button variant="contained" color='error' disabled={torneoSeleccionado.length ? false : true} onClick={onDeleteDialogAlert}>
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
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DateInput
                                name={Labels.FechaInicio}
                                label={Labels.FechaInicio}
                                formManager={formManager}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DateInput
                                name={Labels.FechaFin}
                                label={Labels.FechaFin}
                                formManager={formManager}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <CheckBoxInput name={Labels.Finalizado}
                                label={Labels.Finalizado}
                                formManager={formManager}
                            />
                        </Grid>
                    </Grid>
                    <Stack direction='row' justifyContent="right" mt={2} spacing={1}>
                        <Button variant="contained" type='submit' color='success' disabled={!formManager.isValid}>
                            {Labels.Guardar}
                        </Button>
                        <Button variant="contained" color='error' onClick={onCancelDetail}>
                            {Labels.Cancelar}
                        </Button>
                    </Stack>
                </Form>
            </SectionCollapse>
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar torneo' content='Se eliminará el torneo. ¿Estás seguro?' handleOk={onDeleteDetail} handleCancel={onCancelDetail} />
        </>
    );
}

export default Index;