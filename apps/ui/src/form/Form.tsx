import { FormEvent } from "react";

interface IProps
{
    children: JSX.Element | JSX.Element[],
    handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void
}

export function Form (props: IProps)
{
    const { children, handleSubmit } = props;

    return (
        <form onSubmit={ handleSubmit }>
            { children }
        </form>
    )

}