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
import { RegistrarEquipoVM, EquipoResultadoDataView, Validator } from "@futbolyamigos/data";
import { useSWRConfig } from "swr";
import { useNotification } from '../../src/notifications/useNotification';
import { DialogAlert } from '../../src/components/DialogAlert';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { LoadingButton } from '@mui/lab';
import { AutoCompleteInput } from '../../src/form/input/AutoCompleteInput';

const columns: GridColDef[] = [
    {
        field: Labels.Nombre,
        headerName: Labels.Nombre,
        flex: 1,
        hideable: false
    },
    {
        field: Labels.TotalJugadores,
        headerName: 'Total Jugadores',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left'
    },
    {
        field: Labels.NombreTorneo,
        headerName: 'Torneo',
        type: 'string',
        flex: 1
    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStateEquipoForm: RegistrarEquipoVM = {
        _id: null,
        Nombre: '',
        TorneoID: null,
    };
    const [equipoForm, setEquipoForm] = useState<RegistrarEquipoVM>(initialStateEquipoForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarEquipoVM>({
        initialValues: equipoForm,
        validations: {
            [Labels.Nombre]: Yup.string().required('requerido'),
            [Labels.TorneoID]: Yup.string().nullable()
        },
        onSubmit: async (equipo: RegistrarEquipoVM, formikHelpers: FormikHelpers<RegistrarEquipoVM>) => {
            try
            {
                await Post('equipo', equipo);
                mutate('equipo', true);
                setShowSectionDetalle(false);
                setEquipoSeleccionado([]);
                resetForm();
                showNotificationSuccess(Messages.SeGuardoExitosamente)

            } catch (e)
            {
                return;
            }

        }

    })
    const refNombreForm = useRef<HTMLElement>();

    const { data: equiposFromDB, loading } = useGetSWR<EquipoResultadoDataView[]>('equipo');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setEquipoSeleccionado([]);
        focusNombreForm();
    };

    const onCancelDetail = () => {
        resetForm();
        setEquipoSeleccionado([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStateEquipoForm);
        setEquipoForm(initialStateEquipoForm)
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const equipo = await Get<RegistrarEquipoVM>(`equipo/${equipoSeleccionado[0].toString()}`);
            setEquipoForm(equipo);
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
            await Delete(`equipo/${equipoSeleccionado[0].toString()}`);
            mutate('equipo', true);
            setOpenDialog(false);
            setEquipoSeleccionado([]);
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
            <SectionCollapse title={Labels.Equipos} expanded>
                <DataGrid
                    loading={loading}
                    rows={equiposFromDB?.length ? equiposFromDB : []}
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
                            const selectionSet = new Set(equipoSeleccionado);
                            const result = newSelectionModel.filter((s) => !selectionSet.has(s));
                            setEquipoSeleccionado(result);

                        } else
                        {
                            setEquipoSeleccionado(newSelectionModel);
                        }
                    }}
                    selectionModel={equipoSeleccionado}
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
                    <Button variant="contained" color='info' disabled={equipoSeleccionado.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    <Button variant="contained" color='error' disabled={equipoSeleccionado.length ? false : true} onClick={onDeleteDialogAlert}>
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
                            <AutoCompleteInput
                                urlApiData='torneo/dropdown/todosNoFinalizados'
                                name={Labels.TorneoID}
                                label={Labels.NombreTorneo}
                                formManager={formManager} />
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
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar equipo' content='Se eliminará el equipo. ¿Estás seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;