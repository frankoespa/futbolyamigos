import SectionCollapse from '../../src/components/SectionCollapse';
import { useRef, useState } from 'react';
import { DataGrid, GridColDef, GridRowModel, GridSelectionModel } from '@mui/x-data-grid';
import { Button, Grid, Stack } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, Messages, RegistrarTorneoCompuestoVM, TorneoCompuestoResultadoDataView } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { Form } from '../../src/form/Form';
import { TextInput } from '../../src/form/input/TextInput';
import { useApiManager } from '../../src/api/useApiManager';
import { FormikHelpers } from 'formik';
import { Validator } from "@futbolyamigos/data";
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
        field: Labels.NombreTorneoApertura,
        headerName: Labels.NombreTorneoApertura,
        type: 'string',
        flex: 1
    },
    {
        field: Labels.NombreTorneoClausura,
        headerName: Labels.NombreTorneoClausura,
        type: 'string',
        flex: 1
    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess } = useNotification();
    const { mutate } = useSWRConfig();
    const [torneoCompuestoSeleccionado, setTorneoCompuestoSeleccionado] = useState<GridSelectionModel>([]);
    const [showsectionDetalle, setShowSectionDetalle] = useState<boolean>(false);
    const initialStateTorneoCompuestoForm: RegistrarTorneoCompuestoVM = {
        _id: null,
        Nombre: '',
        TorneoAperturaID: null,
        TorneoClausuraID: null
    };
    const [torneoCompuestoForm, setTorneoCompuestoForm] = useState<RegistrarTorneoCompuestoVM>(initialStateTorneoCompuestoForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarTorneoCompuestoVM>({
        initialValues: torneoCompuestoForm,
        validations: {
            [Labels.Nombre]: Yup.string().required('requerido'),
            [Labels.TorneoAperturaID]: Yup.string().nullable().required('requerido'),
            [Labels.TorneoClausuraID]: Yup.string().nullable().required('requerido'),
        },
        onSubmit: async (torneoCompuesto: RegistrarTorneoCompuestoVM, formikHelpers: FormikHelpers<RegistrarTorneoCompuestoVM>) => {
            try
            {
                await Post('torneoCompuesto', torneoCompuesto);
                mutate('torneoCompuesto', true);
                setShowSectionDetalle(false);
                setTorneoCompuestoSeleccionado([]);
                resetForm();
                showNotificationSuccess(Messages.SeGuardoExitosamente)

            } catch (e)
            {
                return;
            }

        }

    })
    const refNombreForm = useRef<HTMLElement>();

    const { data: torneosCompuestosFromDB, loading } = useGetSWR<TorneoCompuestoResultadoDataView[]>('torneoCompuesto');

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setTorneoCompuestoSeleccionado([]);
        focusNombreForm();
    };

    const onCancelDetail = () => {
        resetForm();
        setTorneoCompuestoSeleccionado([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStateTorneoCompuestoForm);
        setTorneoCompuestoForm(initialStateTorneoCompuestoForm)
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const torneoCompuesto = await Get<RegistrarTorneoCompuestoVM>(`torneoCompuesto/${torneoCompuestoSeleccionado[0].toString()}`);
            setTorneoCompuestoForm(torneoCompuesto);
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
            await Delete(`torneoCompuesto/${torneoCompuestoSeleccionado[0].toString()}`);
            mutate('torneoCompuesto', true);
            setOpenDialog(false);
            setTorneoCompuestoSeleccionado([]);
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

    const dependFetchTorneoAperturaInput = () => {
        if (!formManager.values[Labels.TorneoClausuraID])
        {
            return 'torneo/dropdown/todos';
        } else
        {
            return `torneo/dropdown/todosDiscriminando?torneoID=${formManager.values[Labels.TorneoClausuraID]}`
        }

    }

    const dependFetchTorneoClausuraInput = () => {
        if (!formManager.values[Labels.TorneoAperturaID])
        {
            return 'torneo/dropdown/todos';
        } else
        {
            return `torneo/dropdown/todosDiscriminando?torneoID=${formManager.values[Labels.TorneoAperturaID]}`
        }

    }

    return (
        <>
            <SectionCollapse title={Labels.TorneosCompuestos} expanded>
                <DataGrid
                    loading={loading}
                    rows={torneosCompuestosFromDB?.length ? torneosCompuestosFromDB : []}
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
                            const selectionSet = new Set(torneoCompuestoSeleccionado);
                            const result = newSelectionModel.filter((s) => !selectionSet.has(s));
                            setTorneoCompuestoSeleccionado(result);

                        } else
                        {
                            setTorneoCompuestoSeleccionado(newSelectionModel);
                        }
                    }}
                    selectionModel={torneoCompuestoSeleccionado}
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
                        {Labels.Nuevo}
                    </Button>
                    <Button variant="contained" color='info' disabled={torneoCompuestoSeleccionado.length ? false : true} onClick={onEditDetail}>
                        {Labels.Editar}
                    </Button>
                    <Button variant="contained" color='error' disabled={torneoCompuestoSeleccionado.length ? false : true} onClick={onDeleteDialogAlert}>
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
                                urlApiData={dependFetchTorneoAperturaInput}
                                name={Labels.TorneoAperturaID}
                                label={Labels.NombreTorneoApertura}
                                formManager={formManager} />
                        </Grid>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData={dependFetchTorneoClausuraInput}
                                name={Labels.TorneoClausuraID}
                                label={Labels.NombreTorneoClausura}
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
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar torneo compuesto' content='Se eliminará el torneo compuesto. ¿Estás seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;