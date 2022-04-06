import useSWR, {} from "swr";
import { AxiosError } from 'axios'
import { ExceptionResponseInterface } from "@futbolyamigos/data";

export function useGetSWR<ResponseType> (url: string) {
    const { data, error, mutate } = useSWR<ResponseType, AxiosError<ExceptionResponseInterface>>(url)

    return {
        data,
        loading: !error && !data,
        error: error
    }
}