import { Box, Container, Grid, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { Nav } from '../src/components/AppBar';
import { useFormManager } from '../src/form/useFormManager';
import { Labels, LineaTabla } from '@futbolyamigos/data'
import { useGetSWR } from '../src/api/useGetSWR';
import { Form } from '../src/form/Form';
import { AutoCompleteInput } from '../src/form/input/AutoCompleteInput';
import SectionCollapse from '../src/components/SectionCollapse';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { LocaleDataGrid } from '../src/components/datagrid/LocaleDataGrid';
import { ThemeConfigAdmin } from '../src/ThemeConfigAdmin';


const columns: GridColDef[] = [
    {
        field: Labels.Posicion,
        headerName: 'Posicion',
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.NombreEquipo,
        headerName: 'Equipo',
        type: 'string',
        flex: 5,
        sortable: false,

    },
    {
        field: Labels.Puntos,
        headerName: 'Pts',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.PartidosJugados,
        headerName: 'PJ',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.PartidosGanados,
        headerName: 'PG',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.PartidosPerdidos,
        headerName: 'PP',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.PartidosEmpatados,
        headerName: 'PE',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.GolesFavor,
        headerName: 'GF',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.GolesContra,
        headerName: 'GC',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.DiferenciaGoles,
        headerName: 'DG',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    }

];

function Tablas () {
    const initialStateTorneo: { TorneoID: string } = {
        TorneoID: null
    };

    const formManager = useFormManager<{ TorneoID: string }>({
        initialValues: initialStateTorneo,
        validations: {
            [Labels.TorneoID]: Yup.string().nullable()
        },
        onSubmit: async (torneo: { TorneoID: string }, formikHelpers: FormikHelpers<{ TorneoID: string }>) => {
            console.log()
        }

    })

    const dependFetchTabla = () => {
        if (!formManager.values[Labels.TorneoID])
        {
            return null

        } else
        {

            return `partido/tabla/${formManager.values[Labels.TorneoID]}`;

        }

    }

    const { data: tablaFromDB, loading } = useGetSWR<LineaTabla[]>(dependFetchTabla);

    return (
        <>
            <Head>
                <title>Tablas</title>
                <meta name="description" content="Tablas de posiciones de Fútbol y Amigos" />
            </Head>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: 'secondary.main'
            }}>
                <Nav />
                <ThemeProvider theme={ThemeConfigAdmin}>
                    <Box bgcolor='secondary.main' >
                        <Container maxWidth="xl">
                            <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
                                <Grid item xs={3}>
                                    <Form handleSubmit={formManager.handleSubmit}>
                                        <AutoCompleteInput
                                            urlApiData='torneo/dropdown/todos'
                                            name={Labels.TorneoID}
                                            label={Labels.NombreTorneo}
                                            formManager={formManager} />
                                    </Form>
                                </Grid>
                            </Grid>

                            <SectionCollapse title={Labels.Tabla} expanded>
                                <DataGrid
                                    loading={loading && formManager.values[Labels.TorneoID] !== null}
                                    rows={tablaFromDB?.length ? tablaFromDB : []}
                                    columns={columns}
                                    localeText={LocaleDataGrid.Spanish}
                                    pageSize={tablaFromDB?.length}
                                    rowsPerPageOptions={[tablaFromDB?.length]}
                                    disableSelectionOnClick
                                    disableColumnFilter
                                    disableColumnMenu
                                    disableColumnSelector
                                    hideFooter
                                    autoHeight
                                    density='compact'
                                    getRowId={(row: GridRowModel) => row.Posicion}
                                />
                            </SectionCollapse>
                        </Container>
                    </Box>
                </ThemeProvider>
            </Box>
        </>
    );
}

export default Tablas;