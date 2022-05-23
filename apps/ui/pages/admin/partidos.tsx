import SectionCollapse from '../../src/components/SectionCollapse';
import { useRef, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef, GridColumns, GridRowModel, GridRowParams, GridSelectionModel, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment'
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, Validator, RegistrarGolVM, RegistrarJugadorVM, RegistrarSancionVM, PartidoResultadoDataView } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { Form } from '../../src/form/Form';
import { useApiManager } from '../../src/api/useApiManager';
import { FormikHelpers } from 'formik';
import { RegistrarPartidoVM, Tarjetas } from "@futbolyamigos/data";
import { useSWRConfig } from "swr";
import { useNotification } from '../../src/notifications/useNotification';
import { DialogAlert } from '../../src/components/DialogAlert';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { AutoCompleteInput } from '../../src/form/input/AutoCompleteInput';
import { LoadingButton } from '@mui/lab';
import { DateTimeInput } from '../../src/form/input/DateTimeInput';
import { NumberInput } from '../../src/form/input/NumberInput';
import { Portal } from '@mui/base';
import { Add, Delete as DeleteIcon, SportsSoccer, Sports } from '@mui/icons-material'
import { yellow, red, green, deepOrange } from "@mui/material/colors";

const columns: GridColDef[] = [
    {
        field: Labels.Fecha,
        headerName: Labels.Fecha,
        type: 'date',
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams) => {
            if (!params.value) return null;
            return moment(params.value as Date).format('DD-MM-YYYY H:mm[hs]');
        },
    },
    {
        field: Labels.NombreTorneo,
        headerName: 'Torneo',
        type: 'string',
        flex: 1,
    },
    {
        field: 'Enfrentamiento',
        headerName: 'Enfrentamiento',
        type: 'string',
        flex: 1,
        valueGetter: (params: GridValueGetterParams<any, any>) => {

            const resultadoLocal = params.row[Labels.ResultadoLocal] || params.row[Labels.ResultadoLocal] === 0 ? `[ ${params.row[Labels.ResultadoLocal]} ]` : '';

            const resultadoVisitante = params.row[Labels.ResultadoVisitante] || params.row[Labels.ResultadoVisitante] === 0 ? `[ ${params.row[Labels.ResultadoVisitante]} ]` : '';

            return `${params.row[Labels.NombreEquipoLocal]} ${resultadoLocal} vs ${resultadoVisitante} ${params.row[Labels.NombreEquipoVisitante]}`
        },

    },
    {
        field: Labels.NroCancha,
        headerName: Labels.NroCancha,
        type: 'string',
        flex: 1,
    },
    {
        field: 'Estado',
        headerName: 'Estado',
        type: 'string',
        flex: 1,
        valueGetter: (params: GridValueGetterParams<any, any>) => {
            if (params.row[Labels.ResultadoLocal] ||
                params.row[Labels.ResultadoLocal] === 0 ||
                params.row[Labels.ResultadoVisitante] ||
                params.row[Labels.ResultadoVisitante] === 0) return 'Finalizado';

            return 'Pendiente';
        },
        cellClassName: (params: GridCellParams<string>) => {
            return params.value === 'Finalizado' ? 'finalizado' : 'pendiente'
        }

    }
];

function Index () {
    const { Post, Get, Delete } = useApiManager();
    const { showNotificationSuccess, showNotificationFail } = useNotification();
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
        ResultadoVisitante: null,
        GolesEquipoLocal: [],
        GolesEquipoVisitante: [],
        SancionesEquipoLocal: [],
        SancionesEquipoVisitante: []
    };

    const initialStateGolLocalForm: RegistrarGolVM = {
        _id: null,
        JugadorID: null,
        Nombre: null,
        Cantidad: null
    };

    const initialStateGolVisitanteForm: RegistrarGolVM = {
        _id: null,
        JugadorID: null,
        Nombre: null,
        Cantidad: null
    };

    const initialStateSancionLocalForm: RegistrarSancionVM = {
        _id: null,
        JugadorID: null,
        Nombre: null,
        TarjetaID: null,
        TotalFechas: null
    };

    const initialStateSancionVisitanteForm: RegistrarSancionVM = {
        _id: null,
        JugadorID: null,
        Nombre: null,
        TarjetaID: null,
        TotalFechas: null
    };
    const [partidoForm, setPartidoForm] = useState<RegistrarPartidoVM>(initialStatePartidoForm);
    const [openDialog, setOpenDialog] = useState(false);
    const formManager = useFormManager<RegistrarPartidoVM>({
        initialValues: partidoForm,
        validations: {
            [Labels.Fecha]: Yup.date().required().typeError('requerido'),
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
                let sumaGolesLocal = 0;
                partido.GolesEquipoLocal.forEach(i => { sumaGolesLocal += i.Cantidad });
                let sumaGolesVisitante = 0;
                partido.GolesEquipoVisitante.forEach(i => { sumaGolesVisitante += i.Cantidad });

                if (partido.ResultadoLocal === null && partido.ResultadoVisitante !== null ||
                    partido.ResultadoVisitante === null && partido.ResultadoLocal !== null)
                {
                    showNotificationFail('El Resultado cargado no es correcto. Falta cargar un resultado.')
                    throw new Error();
                }

                if ((partido.ResultadoLocal === null && sumaGolesLocal > 0) ||
                    (partido.ResultadoVisitante === null && sumaGolesVisitante > 0))
                {
                    showNotificationFail('El Resultado no coincide con los goles cargados.')
                    throw new Error();
                }

                if ((partido.ResultadoLocal !== null &&
                    sumaGolesLocal !== partido.ResultadoLocal) ||
                    (partido.ResultadoVisitante !== null &&
                        sumaGolesVisitante !== partido.ResultadoVisitante))
                {
                    showNotificationFail('El Resultado no coincide con los goles cargados.')
                    throw new Error();
                }

                if (partido.ResultadoLocal === null &&
                    partido.ResultadoVisitante === null &&
                    (partido.SancionesEquipoLocal.length > 0 ||
                        partido.SancionesEquipoVisitante.length > 0))
                {
                    showNotificationFail('No es posible cargar sanciones a un partido pendiente de juego.')
                    throw new Error();
                }

                await Post('partido', partido);
                mutate(dependFetchPartidos, true);
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

    const formManagerGolesLocal = useFormManager<RegistrarGolVM>({
        initialValues: initialStateGolLocalForm,
        validations: {
            [Labels.JugadorID]: Yup.string().nullable().required(''),
            [Labels.Cantidad]: Yup.number().nullable().required('')
        },
        onSubmit: async (gol: RegistrarGolVM, formikHelpers: FormikHelpers<RegistrarGolVM>) => {
            try
            {
                if (partidoForm.GolesEquipoLocal.some(i => i.JugadorID === gol.JugadorID))
                {
                    showNotificationFail('El jugador que intentas agregar ya se encuentra en la lista.')
                    throw new Error();
                }

                const jugador = await Get<RegistrarJugadorVM>(`jugador/${gol.JugadorID}`);
                gol.Nombre = `${jugador.Nombres} ${jugador.Apellidos}`
                setPartidoForm({
                    ...formManager.values,
                    GolesEquipoLocal: [...partidoForm.GolesEquipoLocal, gol]
                })
                resetGolLocalForm()

            } catch (e)
            {
                return;
            }

        }

    })

    const formManagerGolesVisitante = useFormManager<RegistrarGolVM>({
        initialValues: initialStateGolVisitanteForm,
        validations: {
            [Labels.JugadorID]: Yup.string().nullable().required(''),
            [Labels.Cantidad]: Yup.number().nullable().required('')
        },
        onSubmit: async (gol: RegistrarGolVM, formikHelpers: FormikHelpers<RegistrarGolVM>) => {
            try
            {
                if (partidoForm.GolesEquipoVisitante.some(i => i.JugadorID === gol.JugadorID))
                {
                    showNotificationFail('El jugador que intentas agregar ya se encuentra en la lista.')
                    throw new Error();
                }

                const jugador = await Get<RegistrarJugadorVM>(`jugador/${gol.JugadorID}`);
                gol.Nombre = `${jugador.Nombres} ${jugador.Apellidos}`
                setPartidoForm({
                    ...formManager.values,
                    GolesEquipoVisitante: [...partidoForm.GolesEquipoVisitante, gol]
                })
                resetGolVisitanteForm()

            } catch (e)
            {
                return;
            }

        }

    })

    const formManagerSancionLocal = useFormManager<RegistrarSancionVM>({
        initialValues: initialStateSancionLocalForm,
        validations: {
            [Labels.JugadorID]: Yup.string().nullable().required(''),
            [Labels.TarjetaID]: Yup.number().nullable().required(''),
            [Labels.TotalFechas]: Yup.number().when(Labels.TarjetaID, {
                is: (tarjetaID) => tarjetaID === Tarjetas.Roja || tarjetaID === Tarjetas.RojaDobleAmarilla,
                then: Yup.number().nullable().required(''),
                otherwise: Yup.number().nullable(),
            })
        },
        onSubmit: async (sancion: RegistrarSancionVM, formikHelpers: FormikHelpers<RegistrarSancionVM>) => {
            try
            {
                if (partidoForm.SancionesEquipoLocal.some(i => i.JugadorID === sancion.JugadorID))
                {
                    showNotificationFail('El jugador que intentas agregar ya se encuentra en la lista.')
                    throw new Error();
                }

                const jugador = await Get<RegistrarJugadorVM>(`jugador/${sancion.JugadorID}`);
                sancion.Nombre = `${jugador.Nombres} ${jugador.Apellidos}`
                setPartidoForm({
                    ...formManager.values,
                    SancionesEquipoLocal: [...partidoForm.SancionesEquipoLocal, sancion]
                })
                resetSancionLocalForm()

            } catch (e)
            {
                return;
            }

        }

    })

    const formManagerSancionVisitante = useFormManager<RegistrarSancionVM>({
        initialValues: initialStateSancionVisitanteForm,
        validations: {
            [Labels.JugadorID]: Yup.string().nullable().required(''),
            [Labels.TarjetaID]: Yup.number().nullable().required(''),
            [Labels.TotalFechas]: Yup.number().when(Labels.TarjetaID, {
                is: (tarjetaID) => tarjetaID === Tarjetas.Roja || tarjetaID === Tarjetas.RojaDobleAmarilla,
                then: Yup.number().nullable().required(''),
                otherwise: Yup.number().nullable(),
            })
        },
        onSubmit: async (sancion: RegistrarSancionVM, formikHelpers: FormikHelpers<RegistrarSancionVM>) => {
            try
            {
                if (partidoForm.SancionesEquipoVisitante.some(i => i.JugadorID === sancion.JugadorID))
                {
                    showNotificationFail('El jugador que intentas agregar ya se encuentra en la lista.')
                    throw new Error();
                }

                const jugador = await Get<RegistrarJugadorVM>(`jugador/${sancion.JugadorID}`);
                sancion.Nombre = `${jugador.Nombres} ${jugador.Apellidos}`
                setPartidoForm({
                    ...formManager.values,
                    SancionesEquipoVisitante: [...partidoForm.SancionesEquipoVisitante, sancion]
                })
                resetSancionVisitanteForm()

            } catch (e)
            {
                return;
            }

        }

    })

    const initialStateTorneo: { TorneoID: string } = {
        TorneoID: null
    };

    const formManagerTorneo = useFormManager<{ TorneoID: string }>({
        initialValues: initialStateTorneo,
        validations: {
            [Labels.TorneoID]: Yup.string().nullable()
        },
        onSubmit: async (torneo: { TorneoID: string }, formikHelpers: FormikHelpers<{ TorneoID: string }>) => {
            console.log()
        }

    })

    const dependFetchPartidos = () => {
        if (!formManagerTorneo.values[Labels.TorneoID])
        {
            return null

        } else
        {

            return `partido/obtenerTodosPorTorneo/${formManagerTorneo.values[Labels.TorneoID]}`;

        }

    }

    const refFechaForm = useRef<HTMLInputElement>();
    const containerGolesSection = useRef(null);
    const containerSancionesSection = useRef(null);

    const { data: partidosFromDB, loading } = useGetSWR<PartidoResultadoDataView[]>(dependFetchPartidos);

    const onCreateDetail = () => {
        resetForm();
        setShowSectionDetalle(true);
        setPartidoSeleccionado([]);
        focusFechaForm();
        formManager.setFieldValue(Labels.TorneoID, formManagerTorneo.values[Labels.TorneoID]);
    };

    const onCancelDetail = () => {
        resetForm();
        setPartidoSeleccionado([]);
        setShowSectionDetalle(false)
    };

    const resetForm = () => {
        formManager.setValues(initialStatePartidoForm);
        resetGolLocalForm();
        resetGolVisitanteForm();
        resetSancionLocalForm();
        resetSancionVisitanteForm();
        setPartidoForm(initialStatePartidoForm)
    }

    const resetGolLocalForm = () => {
        formManagerGolesLocal.setValues(initialStateGolLocalForm);
    }

    const resetGolVisitanteForm = () => {
        formManagerGolesVisitante.setValues(initialStateGolVisitanteForm);
    }

    const resetSancionLocalForm = () => {
        formManagerSancionLocal.setValues(initialStateSancionLocalForm);
    }

    const resetSancionVisitanteForm = () => {
        formManagerSancionVisitante.setValues(initialStateSancionVisitanteForm);
    }

    const onEditDetail = async () => {
        try
        {
            resetForm();
            const partido = await Get<RegistrarPartidoVM>(`partido/${partidoSeleccionado[0].toString()}`);
            setPartidoForm(partido);
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
            mutate(dependFetchPartidos, true);
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

    const dependFetchEquipoLocalInput = () => {
        if (!formManager.values[Labels.TorneoID] || formManager.values['_id'] !== null)
        {
            return 'equipo/dropdown/todos';
        } else
        {
            if (formManager.values[Labels.EquipoVisitanteID] !== null)
            {
                return `equipo/dropdown/todosDiscriminando?torneoID=${formManager.values[Labels.TorneoID]}&equipoID=${formManager.values[Labels.EquipoVisitanteID]}`
            } else
            {
                return `equipo/dropdown/todosDiscriminando?torneoID=${formManager.values[Labels.TorneoID]}&equipoID=`
            }
        }

    }

    const dependFetchEquipoVisitanteInput = () => {
        if (!formManager.values[Labels.TorneoID] || formManager.values['_id'] !== null)
        {
            return 'equipo/dropdown/todos';

        } else
        {
            if (formManager.values[Labels.EquipoLocalID] !== null)
            {
                return `equipo/dropdown/todosDiscriminando?torneoID=${formManager.values[Labels.TorneoID]}&equipoID=${formManager.values[Labels.EquipoLocalID]}`
            } else
            {
                return `equipo/dropdown/todosDiscriminando?torneoID=${formManager.values[Labels.TorneoID]}&equipoID=`
            }
        }

    }

    const dependFetchJugadoresLocalInput = () => {
        if (!formManager.values[Labels.EquipoLocalID])
        {
            return null

        } else
        {

            return `jugador/dropdown/todosPorEquipo?equipoID=${formManager.values[Labels.EquipoLocalID]}`

        }

    }

    const dependFetchJugadoresVisitanteInput = () => {
        if (!formManager.values[Labels.EquipoVisitanteID])
        {
            return null

        } else
        {

            return `jugador/dropdown/todosPorEquipo?equipoID=${formManager.values[Labels.EquipoVisitanteID]}`

        }

    }

    const disabledButtonAddGolLocal = (): boolean => {
        let sumaGoles = 0;

        partidoForm.GolesEquipoLocal.forEach(gol => {
            sumaGoles += gol.Cantidad
        })

        return formManager.values[Labels.ResultadoLocal] === null ||
            sumaGoles === formManager.values[Labels.ResultadoLocal] ||
            (formManagerGolesLocal.values[Labels.Cantidad] + sumaGoles) > formManager.values[Labels.ResultadoLocal]
    }

    const disabledButtonAddGolVisitante = (): boolean => {
        let sumaGoles = 0;

        partidoForm.GolesEquipoVisitante.forEach(gol => {
            sumaGoles += gol.Cantidad
        })

        return formManager.values[Labels.ResultadoVisitante] === null ||
            sumaGoles === formManager.values[Labels.ResultadoVisitante] ||
            (formManagerGolesVisitante.values[Labels.Cantidad] + sumaGoles) > formManager.values[Labels.ResultadoVisitante]
    }

    const deleteGolLocal = (params: GridRowParams) => {
        setPartidoForm({
            ...formManager.values,
            GolesEquipoLocal: partidoForm.GolesEquipoLocal.filter(v => v.JugadorID !== params.id)
        })

    }

    const deleteGolVisitante = (params: GridRowParams) => {
        setPartidoForm({
            ...formManager.values,
            GolesEquipoVisitante: partidoForm.GolesEquipoVisitante.filter(v => v.JugadorID !== params.id)
        })

    }

    const deleteSancionLocal = (params: GridRowParams) => {
        setPartidoForm({
            ...formManager.values,
            SancionesEquipoLocal: partidoForm.SancionesEquipoLocal.filter(v => v.JugadorID !== params.id)
        })

    }

    const deleteSancionVisitante = (params: GridRowParams) => {
        setPartidoForm({
            ...formManager.values,
            SancionesEquipoVisitante: partidoForm.SancionesEquipoVisitante.filter(v => v.JugadorID !== params.id)
        })

    }

    const columnsGolesLocal: GridColumns = [
        {
            field: Labels.Nombre,
            headerName: 'Nombre',
            type: 'string',
            flex: 1,
        },
        {
            field: Labels.Cantidad,
            headerName: Labels.Cantidad,
            type: 'number',
            flex: 1,
            align: 'left',
            headerAlign: 'left'
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => deleteGolLocal(params)}
                    key={1}
                />,
            ]


        }
    ];

    const columnsGolesVisitante: GridColumns = [
        {
            field: Labels.Nombre,
            headerName: 'Nombre',
            type: 'string',
            flex: 1,
        },
        {
            field: Labels.Cantidad,
            headerName: Labels.Cantidad,
            type: 'number',
            flex: 1,
            align: 'left',
            headerAlign: 'left'
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => deleteGolVisitante(params)}
                    key={1}
                />,
            ]


        }
    ];

    const columnsSancionLocal: GridColumns = [
        {
            field: Labels.Nombre,
            headerName: 'Nombre',
            type: 'string',
            flex: 1,
        },
        {
            field: Labels.TarjetaID,
            headerName: 'Tarjeta',
            type: 'string',
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams) => {
                switch (params.value)
                {
                    case Tarjetas.Amarilla:
                        return 'Amarilla';
                    case Tarjetas.Roja:
                        return 'Roja';
                    case Tarjetas.RojaDobleAmarilla:
                        return 'Roja (Doble Amarilla)';
                    default:
                        return '';
                }
            },
            cellClassName: (params: GridCellParams<number>) => {
                return params.value === Tarjetas.Amarilla ? 'amarilla' : 'roja'
            }

        },
        {
            field: Labels.TotalFechas,
            headerName: Labels.TotalFechas,
            type: 'number',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => deleteSancionLocal(params)}
                    key={1}
                />,
            ]


        }
    ];

    const columnsSancionVisitante: GridColumns = [
        {
            field: Labels.Nombre,
            headerName: 'Nombre',
            type: 'string',
            flex: 1,
        },
        {
            field: Labels.TarjetaID,
            headerName: 'Tarjeta',
            type: 'string',
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams) => {
                switch (params.value)
                {
                    case Tarjetas.Amarilla:
                        return 'Amarilla';
                    case Tarjetas.Roja:
                        return 'Roja';
                    case Tarjetas.RojaDobleAmarilla:
                        return 'Roja (Doble Amarilla)';
                    default:
                        return '';
                }
            },
            cellClassName: (params: GridCellParams<number>) => {
                return params.value === Tarjetas.Amarilla ? 'amarilla' : 'roja'
            }

        },
        {
            field: Labels.TotalFechas,
            headerName: Labels.TotalFechas,
            type: 'number',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => deleteSancionVisitante(params)}
                    key={1}
                />,
            ]


        }
    ];

    return (
        <>
            <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
                <Grid item xs={3}>
                    <Form handleSubmit={formManagerTorneo.handleSubmit}>
                        <AutoCompleteInput
                            urlApiData='torneo/dropdown/todos'
                            name={Labels.TorneoID}
                            label={Labels.NombreTorneo}
                            formManager={formManagerTorneo} />
                    </Form>
                </Grid>
            </Grid>
            <SectionCollapse title={Labels.Partidos} expanded>
                <Box sx={{
                    '& .finalizado': {
                        backgroundColor: green[300],
                        color: 'white'
                    },
                    '& .pendiente': {
                        backgroundColor: deepOrange[300],
                        color: 'white'
                    }
                }}>
                    <DataGrid
                        loading={loading && formManagerTorneo.values[Labels.TorneoID] !== null}
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
                </Box>
                <Stack direction='row' justifyContent="right" mt={2} spacing={1}>
                    <Button variant="contained" onClick={onCreateDetail} disabled={!formManagerTorneo.values[Labels.TorneoID]}>
                        {Labels.Nuevo}
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
                    <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
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
                    <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='torneo/dropdown/todos'
                                name={Labels.TorneoID}
                                label='Torneo'
                                formManager={formManager}
                                disabled={true} />
                        </Grid>
                    </Grid>
                    <Divider>Campo de juego</Divider>
                    <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData='cancha/dropdown/todos'
                                name={Labels.CanchaID}
                                label={Labels.NroCancha}
                                formManager={formManager} />
                        </Grid>

                    </Grid>
                    <Divider>Resultado</Divider>
                    <Grid container justifyContent='center' marginBottom={3}>
                        <Grid item xs={3}>
                            <AutoCompleteInput
                                urlApiData={dependFetchEquipoLocalInput}
                                name={Labels.EquipoLocalID}
                                label='Equipo Local'
                                formManager={formManager}
                                disabled={formManager.values['_id'] !== null} />
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
                                urlApiData={dependFetchEquipoVisitanteInput}
                                name={Labels.EquipoVisitanteID}
                                label='Equipo Visitante'
                                formManager={formManager}
                                disabled={formManager.values['_id'] !== null} />
                        </Grid>
                    </Grid>
                    <Box ref={containerGolesSection} marginBottom={3} />
                    <Box ref={containerSancionesSection} />
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
            <Portal container={containerGolesSection.current}>

                <Grid container columnSpacing={5}>
                    <Grid item xs={6}>
                        <Card variant='outlined' sx={{ backgroundColor: t => t.palette.grey[100] }}>
                            <CardHeader title={Labels.Goles} subheader='Local' avatar={<Avatar>
                                <SportsSoccer />
                            </Avatar>} />
                            <CardContent>
                                <Form handleSubmit={formManagerGolesLocal.handleSubmit}>
                                    <Stack direction='row' >
                                        <AutoCompleteInput
                                            urlApiData={dependFetchJugadoresLocalInput}
                                            name={Labels.JugadorID}
                                            label='Jugador'
                                            formManager={formManagerGolesLocal} />
                                        <NumberInput
                                            name={Labels.Cantidad}
                                            label=''
                                            formManager={formManagerGolesLocal}
                                            validator={Validator.SoloNumerosEnterosPositivos}
                                            width={50}
                                        />
                                        <IconButton type='submit' disabled={disabledButtonAddGolLocal()} disableRipple>
                                            <Add />
                                        </IconButton>
                                    </Stack>
                                </Form>
                                <DataGrid
                                    loading={loading}
                                    rows={partidoForm.GolesEquipoLocal.length ? partidoForm.GolesEquipoLocal : []}
                                    columns={columnsGolesLocal}
                                    localeText={LocaleDataGrid.Spanish}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                    disableColumnFilter
                                    disableColumnMenu
                                    disableColumnSelector
                                    hideFooter
                                    autoHeight
                                    density='compact'
                                    getRowId={(row: GridRowModel) => row.JugadorID}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card variant='outlined' sx={{ backgroundColor: t => t.palette.grey[100] }}>
                            <CardHeader title={Labels.Goles} subheader='Visitante' avatar={<Avatar>
                                <SportsSoccer />
                            </Avatar>} />
                            <CardContent>
                                <Form handleSubmit={formManagerGolesVisitante.handleSubmit}>
                                    <Stack direction='row' >
                                        <AutoCompleteInput
                                            urlApiData={dependFetchJugadoresVisitanteInput}
                                            name={Labels.JugadorID}
                                            label='Jugador'
                                            formManager={formManagerGolesVisitante} />
                                        <NumberInput
                                            name={Labels.Cantidad}
                                            label=''
                                            formManager={formManagerGolesVisitante}
                                            validator={Validator.SoloNumerosEnterosPositivos}
                                            width={50}
                                        />
                                        <IconButton type='submit' disabled={disabledButtonAddGolVisitante()} disableRipple>
                                            <Add />
                                        </IconButton>
                                    </Stack>
                                </Form>
                                <DataGrid
                                    loading={loading}
                                    rows={partidoForm.GolesEquipoVisitante.length ? partidoForm.GolesEquipoVisitante : []}
                                    columns={columnsGolesVisitante}
                                    localeText={LocaleDataGrid.Spanish}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                    disableColumnFilter
                                    disableColumnMenu
                                    disableColumnSelector
                                    hideFooter
                                    autoHeight
                                    density='compact'
                                    getRowId={(row: GridRowModel) => row.JugadorID}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

            </Portal>
            <Portal container={containerSancionesSection.current}>
                <Box sx={{
                    '& .amarilla': {
                        backgroundColor: yellow[600],
                        color: 'white'
                    },
                    '& .roja': {
                        backgroundColor: red[600],
                        color: 'white'
                    }
                }}>
                    <Grid container columnSpacing={5}>
                        <Grid item xs={6}>
                            <Card variant='outlined' sx={{ backgroundColor: t => t.palette.grey[100] }}>
                                <CardHeader title={Labels.Sanciones} subheader='Local' avatar={<Avatar>
                                    <Sports />
                                </Avatar>} />
                                <CardContent>
                                    <Form handleSubmit={formManagerSancionLocal.handleSubmit}>
                                        <Stack direction='row' >
                                            <AutoCompleteInput
                                                urlApiData={dependFetchJugadoresLocalInput}
                                                name={Labels.JugadorID}
                                                label='Jugador'
                                                formManager={formManagerSancionLocal} />
                                            <AutoCompleteInput
                                                urlApiData='tarjeta/dropdown/todos'
                                                name={Labels.TarjetaID}
                                                label='Tarjeta'
                                                formManager={formManagerSancionLocal} />
                                            <NumberInput
                                                name={Labels.TotalFechas}
                                                label={Labels.TotalFechas}
                                                formManager={formManagerSancionLocal}
                                                validator={Validator.SoloNumerosEnterosPositivos}
                                            />
                                            <IconButton type='submit' disabled={!formManagerSancionLocal.isValid} disableRipple>
                                                <Add />
                                            </IconButton>
                                        </Stack>
                                    </Form>
                                    <DataGrid
                                        rows={partidoForm.SancionesEquipoLocal.length ? partidoForm.SancionesEquipoLocal : []}
                                        columns={columnsSancionLocal}
                                        localeText={LocaleDataGrid.Spanish}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        disableSelectionOnClick
                                        disableColumnFilter
                                        disableColumnMenu
                                        disableColumnSelector
                                        hideFooter
                                        autoHeight
                                        density='compact'
                                        getRowId={(row: GridRowModel) => row.JugadorID}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card variant='outlined' sx={{ backgroundColor: t => t.palette.grey[100] }}>
                                <CardHeader title={Labels.Sanciones} subheader='Visitante' avatar={<Avatar>
                                    <Sports />
                                </Avatar>} />
                                <CardContent>
                                    <Form handleSubmit={formManagerSancionVisitante.handleSubmit}>
                                        <Stack direction='row' >
                                            <AutoCompleteInput
                                                urlApiData={dependFetchJugadoresVisitanteInput}
                                                name={Labels.JugadorID}
                                                label='Jugador'
                                                formManager={formManagerSancionVisitante} />
                                            <AutoCompleteInput
                                                urlApiData='tarjeta/dropdown/todos'
                                                name={Labels.TarjetaID}
                                                label='Tarjeta'
                                                formManager={formManagerSancionVisitante} />
                                            <NumberInput
                                                name={Labels.TotalFechas}
                                                label={Labels.TotalFechas}
                                                formManager={formManagerSancionVisitante}
                                                validator={Validator.SoloNumerosEnterosPositivos}
                                            />
                                            <IconButton type='submit' disabled={!formManagerSancionVisitante.isValid} disableRipple>
                                                <Add />
                                            </IconButton>
                                        </Stack>
                                    </Form>
                                    <DataGrid
                                        rows={partidoForm.SancionesEquipoVisitante.length ? partidoForm.SancionesEquipoVisitante : []}
                                        columns={columnsSancionVisitante}
                                        localeText={LocaleDataGrid.Spanish}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        disableSelectionOnClick
                                        disableColumnFilter
                                        disableColumnMenu
                                        disableColumnSelector
                                        hideFooter
                                        autoHeight
                                        density='compact'
                                        getRowId={(row: GridRowModel) => row.JugadorID}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Box>
            </Portal>
            <DialogAlert setOpen={setOpenDialog} open={openDialog} title='Eliminar partido' content='Se eliminará el partido. ¿Estás realmente seguro?' handleOk={onDeleteDetail} />
        </>
    );
}

export default Index;