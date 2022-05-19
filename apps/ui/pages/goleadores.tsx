import { Box, Container, Grid, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { Nav } from '../src/components/AppBar';
import { useFormManager } from '../src/form/useFormManager';
import { Labels, LineaGoleadorVM } from '@futbolyamigos/data'
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
        headerName: '',
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.NombreJugador,
        headerName: 'Jugador',
        type: 'string',
        flex: 5,
        sortable: false

    },
    {
        field: Labels.NombreEquipo,
        headerName: 'Equipo',
        type: 'string',
        flex: 5,
        sortable: false

    },
    {
        field: Labels.Cantidad,
        headerName: 'Goles',
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    }

];

function Goleadores () {
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

    const dependFetchGoleadores = () => {
        if (!formManager.values[Labels.TorneoID])
        {
            return null

        } else
        {

            return `gol/goleadores/${formManager.values[Labels.TorneoID]}`;

        }

    }

    const { data: tablaGoleadoresFromDB, loading } = useGetSWR<LineaGoleadorVM[]>(dependFetchGoleadores);

    return (
        <>
            <Head>
                <title>Goleadores</title>
                <meta name="description" content="Goleadores de Fútbol y Amigos" />
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

                            <SectionCollapse title={Labels.Goleadores} expanded>
                                <DataGrid
                                    loading={loading && formManager.values[Labels.TorneoID] !== null}
                                    rows={tablaGoleadoresFromDB?.length ? tablaGoleadoresFromDB : []}
                                    columns={columns}
                                    localeText={LocaleDataGrid.Spanish}
                                    pageSize={tablaGoleadoresFromDB?.length}
                                    rowsPerPageOptions={[tablaGoleadoresFromDB?.length]}
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

export default Goleadores;