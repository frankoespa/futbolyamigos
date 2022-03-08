import { SnackbarProvider } from 'notistack';

interface IProps {
    children: JSX.Element | JSX.Element[];
}

export function NotificationManager (props: IProps) {

    const { children } = props;

    return (
        <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}>
            {children}
        </SnackbarProvider>
    )
}