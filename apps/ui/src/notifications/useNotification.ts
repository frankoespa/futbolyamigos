import { useSnackbar } from 'notistack';
import { ReactText } from 'react';

interface INotificationManager {
    showNotificationSuccess: (message: string) => ReactText;
    showNotificationFail: (message: string) => ReactText;
    showNotificationAlert: (message: string) => ReactText;
    closeNotification: (key?: ReactText) => void;
}

export const useNotification = (): INotificationManager => {
    const { enqueueSnackbar: showNotification, closeSnackbar: closeNotification } = useSnackbar();

    const showNotificationSuccess = (message: string) => {
        return showNotification(message, {
            variant: 'success'
        });
    }

    const showNotificationFail = (message: string) => {
        return showNotification(message, {
            variant: 'error'
        });
    };

    const showNotificationAlert = (message: string) => {
        return showNotification(message, {
            variant: 'warning'
        });
    };

    return {
        showNotificationSuccess,
        showNotificationFail,
        showNotificationAlert,
        closeNotification
    };
};