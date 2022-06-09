import SectionCollapse from '../../src/components/SectionCollapse';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, LineaSancionadoVM } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { Form } from '../../src/form/Form';
import { FormikHelpers } from 'formik';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { AutoCompleteInput } from '../../src/form/input/AutoCompleteInput';

const columns: GridColDef[] = [
    {
        field: Labels.NombreJugador,
        headerName: 'Jugador',
        type: 'string',
        flex: 2,
        sortable: false

    },
    {
        field: Labels.NombreEquipo,
        headerName: 'Equipo',
        type: 'string',
        flex: 2,
        sortable: false

    },
    {
        field: Labels.Descripcion,
        headerName: Labels.Descripcion,
        type: 'string',
        flex: 3,
        sortable: false

    },
    {
        field: Labels.TotalFechas,
        headerName: Labels.TotalFechas,
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.FechasCumplidas,
        headerName: Labels.FechasCumplidas,
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    },
    {
        field: Labels.FechasRestantes,
        headerName: Labels.FechasRestantes,
        type: 'number',
        flex: 1,
        align: 'left',
        headerAlign: 'left',
        sortable: false

    }
];

function Index () {

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

    const dependFetchSancionados = () => {
        if (!formManager.values[Labels.TorneoID])
        {
            return null

        } else
        {

            return `sancion/sancionados/${formManager.values[Labels.TorneoID]}`;

        }

    }

    const { data: tablaSancionadosFromDB, loading } = useGetSWR<LineaSancionadoVM[]>(dependFetchSancionados);

    return (
        <>
            <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
                <Grid item xs={3}>
                    <Form handleSubmit={formManager.handleSubmit}>
                        <AutoCompleteInput
                            urlApiData='torneo/dropdown/todosNoFinalizados'
                            name={Labels.TorneoID}
                            label={Labels.NombreTorneo}
                            formManager={formManager} />
                    </Form>
                </Grid>
            </Grid>

            <SectionCollapse title={Labels.Sancionados} expanded>
                <DataGrid
                    loading={loading && formManager.values[Labels.TorneoID] !== null}
                    rows={tablaSancionadosFromDB?.length ? tablaSancionadosFromDB : []}
                    columns={columns}
                    localeText={LocaleDataGrid.Spanish}
                    pageSize={tablaSancionadosFromDB?.length}
                    rowsPerPageOptions={[tablaSancionadosFromDB?.length]}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector
                    hideFooter
                    autoHeight
                    density='compact'
                    getRowId={(row: GridRowModel) => row.NroLinea}
                />
            </SectionCollapse>
        </>
    );
}

export default Index;