import { useUser } from "../../src/api/auth/useUser";


export function Index () {
    const { user, loading } = useUser();

    if (loading)
    {
        return 'loading'
    }

    if (user)
    {
        return (
            <>
                {JSON.stringify(user)}
            </>
        )
    }


}

export default Index;
