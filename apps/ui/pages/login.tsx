import { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Form } from '../src/form/Form';
import { TextInput } from '../src/form/input/TextInput';
import { useFormManager } from '../src/form/useFormManager';
import { Labels, UserSignInVM } from "@futbolyamigos/data";
import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { PasswordInput } from '../src/form/input/PasswordInput';
import { useApiManager } from '../src/api/useApiManager';
import { LoadingButton } from "@mui/lab";
import { useUser } from '../src/api/auth/useUser';
import Head from 'next/head';
import { useRouter } from 'next/router';

function Login () {
    const { Post } = useApiManager();
    const { replace } = useRouter()
    const { loading } = useUser();

    const onSubmitSignIn = async (userSignin: UserSignInVM, formikHelpers: FormikHelpers<UserSignInVM>) => {
        await Post('auth/login', userSignin);
        replace('/admin/torneos');
    };

    const formManager = useFormManager<UserSignInVM>({
        initialValues: {
            Email: '',
            Password: ''
        },
        validations: {
            [Labels.Email]: Yup.string().required('requerido').email('email inválido'),
            [Labels.Password]: Yup.string().required('requerido')
        },
        onSubmit: onSubmitSignIn
    })

    return (
        <Stack direction='row' alignItems="center" justifyContent="center" sx={{
            minHeight: '100vh',
            bgcolor: 'secondary.main',
            opacity: 0.8,
            backgroundImage: 'radial-gradient(#27272B 0.75px, #FFAB3B 0.75px)',
            backgroundSize: '15px 15px'
        }}>
            <Head>
                <title>Login</title>
            </Head>
            {loading ?
                <CircularProgress color='primary' />
                :
                <Paper sx={{ width: { xs: 300, md: 400 }, py: 8, px: 5 }} elevation={6}>
                    <Stack direction='row' justifyContent="center">
                        <LockIcon color='primary' fontSize='large' />
                    </Stack>
                    <Typography variant='body1' sx={{ fontWeight: 700, color: 'text.secondary' }} gutterBottom align='center'>{Labels.IniciarSesion}</Typography>
                    <Form handleSubmit={formManager.handleSubmit}>
                        <TextInput
                            name={Labels.Email}
                            label={Labels.Email}
                            formManager={formManager}
                        />
                        <PasswordInput
                            name={Labels.Password}
                            label={Labels.Password}
                            formManager={formManager}
                        />
                        <Stack direction='row' justifyContent="center" mt={2}>
                            <LoadingButton loading={formManager.isSubmitting} variant="contained" type='submit' color='primary'>
                                {Labels.Ingresar}
                            </LoadingButton>
                        </Stack>
                    </Form>
                </Paper>
            }

        </Stack>
    );
}

export default Login;