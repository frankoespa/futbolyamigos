import Axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotification } from '../notifications/useNotification';
import { ExceptionResponseInterface } from "@futbolyamigos/data";
import { useRouter } from 'next/router';

export const useApiManager = () => {
    const { showNotificationFail } = useNotification();
    const { replace } = useRouter();

    const AxiosInstance = Axios.create();

    // Add a response interceptor
    AxiosInstance.interceptors.response.use((response: AxiosResponse) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (Axios.isAxiosError(error))
        {
            const errorAxios: AxiosError<ExceptionResponseInterface> = error;

            if (errorAxios.response)
            {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                showNotificationFail(errorAxios.response.data.message);

                if (errorAxios.response.data.status === 401)
                {
                    replace('/login')
                }

                return Promise.reject(errorAxios);

            } else if (errorAxios.request)
            {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                showNotificationFail(errorAxios.message);
                return Promise.reject(errorAxios);
            } else
            {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                showNotificationFail(errorAxios.message);
                return Promise.reject(errorAxios);

            }
        } else
        {
            showNotificationFail((error as Error).message);
            return Promise.reject(error);

        }
    });

    async function Get<ResponseDataType> (
        url: string
    ): Promise<ResponseDataType> {

        return AxiosInstance.get<ResponseDataType, ResponseDataType>(`/${url}`);

    }

    async function Post<ResponseDataType, BodyDataType> (
        url: string,
        body?: BodyDataType
    ): Promise<ResponseDataType> {

        return AxiosInstance.post<ResponseDataType, ResponseDataType>(`/${url}`, body ? body : null);
    }

    async function Delete<ResponseDataType> (
        url: string
    ): Promise<ResponseDataType> {

        return AxiosInstance.delete<ResponseDataType, ResponseDataType>(`/${url}`);

    }

    return {
        Get,
        Post,
        Delete
    };
};