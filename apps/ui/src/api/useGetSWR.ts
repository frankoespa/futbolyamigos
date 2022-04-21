import useSWR, { Key } from "swr";
import { AxiosError } from 'axios'
import { ExceptionResponseInterface } from "@futbolyamigos/data";

export function useGetSWR<ResponseType> (url: Key) {
    const { data, error } = useSWR<ResponseType, AxiosError<ExceptionResponseInterface>>(url)

    return {
        data,
        loading: !error && !data,
        error: error
    }
}