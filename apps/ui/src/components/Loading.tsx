import { Backdrop, CircularProgress } from '@mui/material';

export function Loading () {
    return (
        <Backdrop sx={{ zIndex: (t) => t.zIndex.drawer + 1, backgroundColor: (t) => t.palette.primary.main }} open={true}>
            <CircularProgress color='secondary' />
        </Backdrop>
    );
}