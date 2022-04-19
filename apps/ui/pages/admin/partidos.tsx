import SectionCollapse from '../../src/components/SectionCollapse';
import { useRef, useState } from 'react';
import { DataGrid, GridColDef, GridRowModel, GridSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, TorneoResultadoDataView, Validator } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { Form } from '../../src/form/Form';
import { useApiManager } from '../../src/api/useApiManager';
import { FormikHelpers } from 'formik';
import { RegistrarPartidoVM } from "@futbolyamigos/data";
import { useSWRConfig } from "swr";
import { useNotification } from '../../src/notifications/useNotification';
import { DialogAlert } from '../../src/components/DialogAlert';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { AutoCompleteInput } from '../../src/form/input/AutoCompleteInput';
import { LoadingButton } from '@mui/lab';
import { DateTimeInput } from '../../src/form/input/DateTimeInput';
import { NumberInput } from '../../src/form/input/NumberInput';

const columns: GridColDef[] = [
    {
        field: Labels.Fecha,
        headerName: Labels.Fecha,
        type: 'date',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            if (!params.value) return null;
            return moment(params.value as Date).format('D-M-YYYY H:mm');
        },
    },
    {
        field: Labels.NombreTorneo,
        headerName: 'Torneo',
        type: 'string',
        flex: 1,
    },
    {
        field: Labels.NroCancha,
        headerName: Labels.NroCancha,
        type: 'string',
        flex: 1,
    },
    {
        field: Labels.NombreEquipoLocal,
        headerName: 'Equipo Local',
        type: 'string',
        flex: 1,
    },
    {
        field: Labels.NombreEquipoVisitante,
        headerName: 'Equipo Visitante',
        type: 'string',
        flex: 1,
    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [partidoSeleccionado, setPartidoSeleccionado] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStatePartidoForm: RegistrarPartidoVM = {
        _id: null,
        Fecha: null,
        TorneoID: null,
        CanchaID: null,
        EquipoLocalID: null,
        EquipoVisitanteID: null,
        ResultadoLocal: null,
        ResultadoVisitante: null
    };
    const [partidoForm, setJugadorForm] = useState<RegistrarPartidoVM>(initialStatePartidoForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarPartidoVM>({
        initialValues: partidoForm,
        validations: {
            [Labels.Fecha]: Yup.date().required().typeError('formato incorrecto'),
            [Labels.TorneoID]: Yup.string().nullable().required('requerido'),
            [Labels.CanchaID]: Yup.string().nullable(),
            [Labels.EquipoLocalID]: Yup.string().nullable().required('requerido'),
            [Labels.EquipoVisitanteID]: Yup.string().nullable().required('requerido'),
            [Labels.ResultadoLocal]: Yup.number().nullable(),
            [Labels.ResultadoVisitante]: Yup.number().nullable()
        },
        onSubmit: async (partido: RegistrarPartidoVM, formikHelpers: FormikHelpers<RegistrarPartidoVM>) => {
            try
            {
                await Post('partido', partido);
                mutate('partido', true);
                resetForm();
                setShowSectionDetalle(false);
                setPartidoSeleccionado([]);
                showNotificationSuccess('Se guardó exitosamente.');

            } catch (e)
            {
                return;
            }

        }

    })

    const refFechaForm = useRef<HTMLInputElement>();

    const { data: partidosFromDB, loading } = useGetSWR<TorneoResultadoDataView[]>('partido');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setPartidoSeleccionado([]);
        focusFechaForm();
    };

    const onCancelDetail = () => {
        resetForm();
        setPartidoSeleccionado([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStatePartidoForm);
        setJugadorForm(initialStatePartidoForm)
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const partido = await Get<RegistrarPartidoVM>(`partido/${partidoSeleccionado[0].toString()}`);
            setJugadorForm(partido);
            setShowSectionDetalle(true);
            focusFechaForm();

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
            await Delete(`partido/${partidoSeleccionado[0].toString()}`);
            mutate('partido', true);
            setOpenDialog(false);
            setPartidoSeleccionado([]);
            showNotificationSuccess('Se eliminó exitosamente.');

        } catch (e)
        {
            return;
        }
    };

    const focusFechaForm = () => {
        setTimeout(() => {
            refFechaForm.current.focus();
        }, 0);
    }

    return (
        <>
            <SectionCollapse title={Labels.Partidos} expanded>
                <DataGrid
                    loading={loading}
                    rows={partidosFromDB?.length ? partidosFromDB : []}
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
                            const selectionSet = new Set(partidoSeleccionado);
                            const result = newSelectionModel.filter((s) => !selectionSet.has(s));
                            setPartidoSeleccionado(result);

                        } else
                        {
                            setPartidoSeleccionado(newSelectionModel);
                        }
                    }}
                    selectionModel={partidoSeleccionado}
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
                    <Button variant="contained" color='info' disabled={partidoSeleccionado.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    <Button variant="contained" color='error' disabled={partidoSeleccionado.length ? false : true} onClick={onDeleteDialogAlert}>
                        {Labels.Eliminar}
                    </Button>
                </Stack>
            </SectionCollapse>
            <SectionCollapse title={Labels.Detalle} expanded={showsectionDetalle}>
                <Form handleSubmit={formManager.handleSubmit}>
                    <Divider>Fecha y hora</Divider>
                    <Grid container columnSpacing={5} justifyContent='center'>
                        <Grid item xs={3}>
                            <DateTimeInput
                                name={Labels.Fecha}
                                label={Labels.Fecha}
                                formManager={formManager}
                                refElement={refFechaForm}
                            />
                        </Grid>
                    </Grid>
                    <Divider>Torneo al que aplica</Divider>
                    <Grid container columnSpacing={5} justifyContent='center'>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='torneo/dropdown/todosNoFinalizados'
                                name={Labels.TorneoID}
                                label='Torneo'
                                formManager={formManager}
                                nulleable />
                        </Grid>
                    </Grid>
                    <Divider>Campo de juego</Divider>
                    <Grid container columnSpacing={5} justifyContent='center'>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='cancha/dropdown/todos'
                                name={Labels.CanchaID}
                                label={Labels.NroCancha}
                                formManager={formManager}
                                nulleable />
                        </Grid>

                    </Grid>
                    <Divider>Resultado</Divider>
                    <Grid container justifyContent='center'>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='equipo/dropdown/todos'
                                name={Labels.EquipoLocalID}
                                label='Equipo Local'
                                formManager={formManager}
                                nulleable />
                        </Grid>
                        <Grid item>
                            <NumberInput
                                name={Labels.ResultadoLocal}
                                label=''
                                formManager={formManager}
                                validator={Validator.SoloNumerosEnterosPositivosYCero}
                                width={50}
                            />
                        </Grid>
                        <Grid item xs='auto' alignItems='center' justifyContent='center' display='flex' px={2}>
                            <Typography variant='h6' sx={{ fontWeight: 800 }} >VS</Typography>
                        </Grid>
                        <Grid item>
                            <NumberInput
                                name={Labels.ResultadoVisitante}
                                label=''
                                formManager={formManager}
                                validator={Validator.SoloNumerosEnterosPositivosYCero}
                                width={50}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='equipo/dropdown/todos'
                                name={Labels.EquipoVisitanteID}
                                label='Equipo Visitante'
                                formManager={formManager}
                                nulleable />
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
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar partido' content='Se eliminará el partido. ¿Estás seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;