import { Box, Container, Grid, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { Nav } from '../src/components/AppBar';
import { useFormManager } from '../src/form/useFormManager';
import { Labels, PartidoResultadoDataView } from '@futbolyamigos/data'
import { useGetSWR } from '../src/api/useGetSWR';
import { Form } from '../src/form/Form';
import { AutoCompleteInput } from '../src/form/input/AutoCompleteInput';
import SectionCollapse from '../src/components/SectionCollapse';
import { DataGrid, GridCellParams, GridColDef, GridRowModel, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { LocaleDataGrid } from '../src/components/datagrid/LocaleDataGrid';
import { ThemeConfigAdmin } from '../src/ThemeConfigAdmin';
import moment from 'moment'
import { green, deepOrange } from '@mui/material/colors';


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
        field: 'Enfrentamiento',
        headerName: 'Enfrentamiento',
        type: 'string',
        flex: 2,
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

function Fixture () {
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

    const { data: partidosFromDB, loading } = useGetSWR<PartidoResultadoDataView[]>(dependFetchPartidos);

    return (
        <>
            <Head>
                <title>Fixture</title>
                <meta name="description" content="Fixture de Fútbol y Amigos" />
            </Head>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: 'secondary.main',
                '& .finalizado': {
                    backgroundColor: green[300],
                    color: 'white'
                },
                '& .pendiente': {
                    backgroundColor: deepOrange[300],
                    color: 'white'
                }
            }}>
                <Nav />
                <ThemeProvider theme={ThemeConfigAdmin}>
                    <Box bgcolor='secondary.main' >
                        <Container maxWidth="xl">
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
                            <SectionCollapse title={Labels.Fixture} expanded>
                                <DataGrid
                                    loading={loading && formManagerTorneo.values[Labels.TorneoID] !== null}
                                    rows={partidosFromDB?.length ? partidosFromDB : []}
                                    columns={columns}
                                    localeText={LocaleDataGrid.Spanish}
                                    pageSize={partidosFromDB?.length}
                                    rowsPerPageOptions={[partidosFromDB?.length]}
                                    disableSelectionOnClick
                                    disableColumnFilter
                                    disableColumnMenu
                                    disableColumnSelector
                                    hideFooter
                                    autoHeight
                                    density='compact'
                                    getRowId={(row: GridRowModel) => row._id}
                                />
                            </SectionCollapse>
                        </Container>
                    </Box>
                </ThemeProvider>
            </Box>
        </>
    );
}

export default Fixture;