import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Labels } from "@futbolyamigos/data";

interface IProps {
    title: string;
    content: string;
    handleOk: () => void;
    handleCancel?: () => void;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;

}

export function DialogAlert (props: IProps) {
    const { title, content, handleCancel, handleOk, open, setOpen } = props;

    return (<Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color='success' onClick={handleOk}>
                {Labels.Ok}
            </Button>
            <Button variant="contained" color='error' autoFocus onClick={() => {
                setOpen(false);
                if (handleCancel) handleCancel();
            }}>
                {Labels.Cancelar}
            </Button>
        </DialogActions>
    </Dialog>)
}