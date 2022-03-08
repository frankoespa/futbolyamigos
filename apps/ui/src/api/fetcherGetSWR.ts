import { Axios } from "axios";

// export const FetcherGetSWR = async url => {

//     try
//     {
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error)
//     {
//         if (Axios.isAxiosError(error))
//         {
//             HandleError(error as AxiosError<ExceptionResponseInterface>)
//             throw error;
//         } else
//         {
//             showNotificationFail((error as Error).message)
//             throw error;


//         }
//     }

// };