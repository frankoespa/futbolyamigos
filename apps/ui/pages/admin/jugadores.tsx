import SectionCollapse from '../../src/components/SectionCollapse';
import { useRef, useState } from 'react';
import { DataGrid, GridColDef, GridRowModel, GridSelectionModel, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { Button, Grid, Stack } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, TorneoResultadoDataView, Validator } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { DateInput } from '../../src/form/input/DateInput';
import { Form } from '../../src/form/Form';
import { TextInput } from '../../src/form/input/TextInput';
import { useApiManager } from '../../src/api/useApiManager';
import { FormikHelpers } from 'formik';
import { RegistrarJugadorVM } from "@futbolyamigos/data";
import { useSWRConfig } from "swr";
import { useNotification } from '../../src/notifications/useNotification';
import { DialogAlert } from '../../src/components/DialogAlert';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { NumberInput } from '../../src/form/input/NumberInput';
import { PhoneInput } from '../../src/form/input/PhoneInput';
import { AutoCompleteInput } from '../../src/form/input/AutoCompleteInput';
import { LoadingButton } from '@mui/lab';

const columns: GridColDef[] = [
    {
        field: Labels.Nombres,
        headerName: Labels.Nombres,
        flex: 1,
        hideable: false
    },
    {
        field: Labels.Apellidos,
        headerName: Labels.Apellidos,
        flex: 1,
    },
    {
        field: Labels.FechaNacimiento,
        headerName: Labels.FechaNacimiento,
        type: 'date',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            if (!params.value) return null;
            return moment(params.value as Date).format('LL');
        },

    },
    {
        field: 'Edad',
        headerName: 'Edad',
        type: 'string',
        flex: 1,
        valueGetter: (params: GridValueGetterParams<any, any>) => {
            if (!params.row[Labels.FechaNacimiento]) return null;
            return moment().diff(moment(params.row.FechaNacimiento), 'years');
        },

    },
    {
        field: Labels.Dni,
        headerName: Labels.Dni,
        type: 'string',
        flex: 1
    },
    {
        field: Labels.Email,
        headerName: Labels.Email,
        type: 'string',
        flex: 1
    },
    {
        field: Labels.Telefono,
        headerName: Labels.Telefono,
        type: 'string',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            if (!params.value) return null;
            return `+${(params.value as string)}`;
        },
    },
    {
        field: Labels.NombreEquipo,
        headerName: 'Equipo',
        flex: 1,
    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStateJugadorForm: RegistrarJugadorVM = {
        _id: null,
        Nombres: '',
        Apellidos: '',
        FechaNacimiento: null,
        Dni: '',
        Email: null,
        Telefono: null,
        EquipoID: null
    };
    const [jugadorForm, setJugadorForm] = useState<RegistrarJugadorVM>(initialStateJugadorForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarJugadorVM>({
        initialValues: jugadorForm,
        validations: {
            [Labels.Nombres]: Yup.string().required('requerido'),
            [Labels.Apellidos]: Yup.string().required('requerido'),
            [Labels.FechaNacimiento]: Yup.date().nullable(),
            [Labels.Dni]: Yup.string().required('requerido'),
            [Labels.Email]: Yup.string().email('email inválido').nullable(),
            [Labels.Telefono]: Yup.string().nullable().matches(/54[0-9][0-9][0-9][0-9]{7}/, { excludeEmptyString: true, message: 'El formato tiene que ser: +54 (xxx) x xx xx xx' }),
            [Labels.EquipoID]: Yup.string().nullable()
        },
        onSubmit: async (jugador: RegistrarJugadorVM, formikHelpers: FormikHelpers<RegistrarJugadorVM>) => {
            try
            {
                await Post('jugador', jugador);
                mutate('jugador', true);
                resetForm();
                setShowSectionDetalle(false);
                setJugadorSeleccionado([]);
                showNotificationSuccess('Se guardó exitosamente.');

            } catch (e)
            {
                return;
            }

        }

    })

    const refNombreForm = useRef<HTMLElement>();

    const { data: jugadoresFromDB, loading } = useGetSWR<TorneoResultadoDataView[]>('jugador');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setJugadorSeleccionado([]);
        focusNombreForm();
    };

    const onCancelDetail = () => {
        resetForm();
        setJugadorSeleccionado([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStateJugadorForm);
        setJugadorForm(initialStateJugadorForm)
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const jugador = await Get<RegistrarJugadorVM>(`jugador/${jugadorSeleccionado[0].toString()}`);
            setJugadorForm(jugador);
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
            await Delete(`jugador/${jugadorSeleccionado[0].toString()}`);
            mutate('jugador', true);
            setOpenDialog(false);
            setJugadorSeleccionado([]);
            showNotificationSuccess('Se eliminó exitosamente.');

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
            <SectionCollapse title={Labels.Jugadores} expanded>
                <DataGrid
                    loading={loading}
                    rows={jugadoresFromDB?.length ? jugadoresFromDB : []}
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
                            const selectionSet = new Set(jugadorSeleccionado);
                            const result = newSelectionModel.filter((s) => !selectionSet.has(s));
                            setJugadorSeleccionado(result);

                        } else
                        {
                            setJugadorSeleccionado(newSelectionModel);
                        }
                    }}
                    selectionModel={jugadorSeleccionado}
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
                    <Button variant="contained" color='info' disabled={jugadorSeleccionado.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    {/* <Button variant="contained" color='error' disabled={jugadorSeleccionado.length ? false : true} onClick={onDeleteDialogAlert}>
                        {Labels.Eliminar}
                    </Button> */}
                </Stack>
            </SectionCollapse>
            <SectionCollapse title={Labels.Detalle} expanded={showsectionDetalle}>
                <Form handleSubmit={formManager.handleSubmit}>
                    <Grid container columnSpacing={5}>
                        <Grid item xs={3}>
                            <TextInput
                                name={Labels.Nombres}
                                label={Labels.Nombres}
                                formManager={formManager}
                                refElement={refNombreForm}
                                validator={Validator.ConEspacios}
                                textTransform='uppercase'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextInput
                                name={Labels.Apellidos}
                                label={Labels.Apellidos}
                                formManager={formManager}
                                validator={Validator.ConEspacios}
                                textTransform='uppercase'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <NumberInput
                                name={Labels.Dni}
                                label={Labels.Dni}
                                formManager={formManager}
                                validator={Validator.SoloNumerosEnterosPositivos}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DateInput
                                name={Labels.FechaNacimiento}
                                label={Labels.FechaNacimiento}
                                formManager={formManager}
                                disableFuture
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='equipo/dropdown/todos'
                                name={Labels.EquipoID}
                                label={Labels.NombreEquipo}
                                formManager={formManager} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextInput
                                name={Labels.Email}
                                label={Labels.Email}
                                formManager={formManager}
                                validator={Validator.SinEspacios}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <PhoneInput
                                name={Labels.Telefono}
                                label={Labels.Telefono}
                                formManager={formManager}
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
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar jugador' content='Se eliminará el jugador. ¿Estás seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;