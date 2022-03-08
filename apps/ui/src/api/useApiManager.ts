import Axios, { AxiosError } from 'axios';
import { useNotification } from '../notifications/useNotification';
import { ExceptionResponseInterface } from "@futbolyamigos/data";
import { useRouter } from 'next/router';

export const useApiManager = () => {
    const { showNotificationFail } = useNotification();
    const { replace } = useRouter();

    async function Get<ResponseDataType> (
        controllerName: string,
        actionName: string
    ): Promise<ResponseDataType> {

        return new Promise((resolve, reject) => {
            Axios.get<ResponseDataType>(`/${controllerName}/${actionName}`)
                .then(response => {
                    return resolve(response.data)
                })
                .catch(error => {
                    HandleError(error);
                    return reject(error)
                })
        })
    }

    async function Post<ResponseDataType, BodyDataType> (
        controllerName: string,
        actionName: string,
        body: BodyDataType
    ): Promise<ResponseDataType | null> {

        try
        {
            const { data } = await Axios.post<ResponseDataType>(`/${controllerName}/${actionName}`, body);
            return data;
        } catch (error)
        {

            if (Axios.isAxiosError(error))
            {
                HandleError(error as AxiosError<ExceptionResponseInterface>)
            } else
            {
                showNotificationFail((error as Error).message)

            }
            return null;
        }
    }

    function HandleError (error: AxiosError<ExceptionResponseInterface>) {
        if (error.response)
        {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            showNotificationFail(error.response.data.message);
            if (error.response.data.status === 401)
            {
                replace('login')
            }
        } else if (error.request)
        {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            showNotificationFail(error.message)
        } else
        {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
            showNotificationFail(error.message)

        }
    }

    return {
        Get,
        Post
    };
};