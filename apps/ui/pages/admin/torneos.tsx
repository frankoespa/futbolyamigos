import SectionCollapse from '../../src/components/SectionCollapse';
import { useRef, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridRowModel, GridSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { Box, Button, Grid, Stack } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, TorneoResultadoDataView, Validator } from "@futbolyamigos/data";
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
import { LoadingButton } from '@mui/lab';
import { green, red } from "@mui/material/colors";

const columns: GridColDef[] = [
    {
        field: Labels.Nombre,
        headerName: Labels.Nombre,
        flex: 1,
        hideable: false
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
        field: Labels.TotalEquipos,
        headerName: 'Total Equipos',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left'

    },
    {
        field: Labels.Finalizado,
        headerName: 'Estado',
        type: 'string',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            return params.value ? 'Finalizado' : 'En curso';
        },
        cellClassName: (params: GridCellParams<boolean>) => {
            return params.value ? 'finalizado' : 'encurso'
        }

    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [torneoSeleccionado, setTorneoSeleccionado] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStateTorneoForm: RegistrarTorneoVM = {
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
            [Labels.FechaInicio]: Yup.date().required().typeError('formato incorrecto'),
            [Labels.FechaFin]: Yup.date().nullable()
        },
        onSubmit: async (torneo: RegistrarTorneoVM, formikHelpers: FormikHelpers<RegistrarTorneoVM>) => {
            try
            {
                await Post('torneo', torneo);
                mutate('torneo', true);
                resetForm();
                setShowSectionDetalle(false);
                setTorneoSeleccionado([]);
                showNotificationSuccess('Se guardó exitosamente.');
            } catch (e)
            {
                return
            }
        }

    })

    const refNombreForm = useRef<HTMLElement>();

    const { data: torneosFromDB, loading } = useGetSWR<TorneoResultadoDataView[]>('torneo');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setTorneoSeleccionado([]);
        focusNombreForm();
    };

    const onCancelDetail = () => {
        resetForm();
        setTorneoSeleccionado([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStateTorneoForm);
        setTorneoForm(initialStateTorneoForm)
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const torneo = await Get<RegistrarTorneoVM>(`torneo/${torneoSeleccionado[0].toString()}`);
            setTorneoForm(torneo);
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
            await Delete(`torneo/${torneoSeleccionado[0].toString()}`)
            mutate('torneo', true);
            setOpenDialog(false);
            setTorneoSeleccionado([]);
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
            <SectionCollapse title={Labels.Torneos} expanded>
                <Box sx={{
                    '& .encurso': {
                        backgroundColor: green[300],
                        color: 'white'
                    },
                    '& .finalizado': {
                        backgroundColor: red[300],
                        color: 'white'
                    }
                }}>
                    <DataGrid
                        loading={loading}
                        rows={torneosFromDB?.length ? torneosFromDB : []}
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
                </Box>
                <Stack direction='row' justifyContent="right" mt={2} spacing={1}>
                    <Button variant="contained" onClick={onCreateDetail}>
                        {Labels.Nuevo}
                    </Button>
                    <Button variant="contained" color='info' disabled={torneoSeleccionado.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    {/* <Button variant="contained" color='error' disabled={torneoSeleccionado.length ? false : true} onClick={onDeleteDialogAlert}>
                        {Labels.Eliminar}
                    </Button> */}
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
                                disabled={formManager.values['_id'] === null}
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
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar torneo' content='Se eliminará el torneo, los torneos compuestos de los que sea parte, todos sus partidos y se desasociarán todos los equipos inscriptos. ¿Estás realmente seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;