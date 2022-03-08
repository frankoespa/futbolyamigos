import useSWR from "swr";
import { AxiosError } from 'axios'
import { UserDetailVM, ExceptionResponseInterface } from "@futbolyamigos/data";
import { useRouter } from "next/router";

export const useUser = () => {
    const { replace, pathname } = useRouter();
    const { data, error, mutate, } = useSWR<UserDetailVM, AxiosError<ExceptionResponseInterface>>('auth')

    if (data && !error && pathname.includes('login'))
    {
        replace('admin');
    }

    if ((data || !data) && error && pathname.includes('admin'))
    {
        replace('login');
    }

    return {
        user: data,
        loading: !error && !data,
        error: error,
        mutate
    }
}