import SectionCollapse from '../../src/components/SectionCollapse';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { useFormManager } from '../../src/form/useFormManager';
import { Labels, LineaTabla } from "@futbolyamigos/data";
import * as Yup from 'yup';
import { Form } from '../../src/form/Form';
import { FormikHelpers } from 'formik';
import { useGetSWR } from '../../src/api/useGetSWR';
import { LocaleDataGrid } from '../../src/components/datagrid/LocaleDataGrid';
import { AutoCompleteInput } from '../../src/form/input/AutoCompleteInput';

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
        sortable: false

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

function Index () {

    const initialStateTorneoCompuesto: { TorneoCompuestoID: string } = {
        TorneoCompuestoID: null
    };

    const formManager = useFormManager<{ TorneoCompuestoID: string }>({
        initialValues: initialStateTorneoCompuesto,
        validations: {
            [Labels.TorneoCompuestoID]: Yup.string().nullable()
        },
        onSubmit: async (torneo: { TorneoCompuestoID: string }, formikHelpers: FormikHelpers<{ TorneoCompuestoID: string }>) => {
            console.log()
        }

    })

    const dependFetchTabla = () => {
        if (!formManager.values[Labels.TorneoCompuestoID])
        {
            return null

        } else
        {

            return `partido/tablaGeneral/${formManager.values[Labels.TorneoCompuestoID]}`;

        }

    }

    const { data: tablaCompuestaFromDB, loading } = useGetSWR<LineaTabla[]>(dependFetchTabla);

    return (
        <>
            <Grid container columnSpacing={5} justifyContent='center' marginBottom={3}>
                <Grid item xs={3}>
                    <Form handleSubmit={formManager.handleSubmit}>
                        <AutoCompleteInput
                            urlApiData='torneoCompuesto/dropdown/todos'
                            name={Labels.TorneoCompuestoID}
                            label={Labels.NombreTorneoCompuesto}
                            formManager={formManager} />
                    </Form>
                </Grid>
            </Grid>

            <SectionCollapse title={Labels.TablaGeneral} expanded>
                <DataGrid
                    loading={loading && formManager.values[Labels.TorneoCompuestoID] !== null}
                    rows={tablaCompuestaFromDB?.length ? tablaCompuestaFromDB : []}
                    columns={columns}
                    localeText={LocaleDataGrid.Spanish}
                    pageSize={tablaCompuestaFromDB?.length}
                    rowsPerPageOptions={[tablaCompuestaFromDB?.length]}
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
        </>
    );
}

export default Index;