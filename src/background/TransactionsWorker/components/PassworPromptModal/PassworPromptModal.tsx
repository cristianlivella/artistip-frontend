import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStorageState } from 'react-storage-hooks';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Alert, AlertTitle } from '@material-ui/lab';
import AES from 'crypto-js/aes';
import array from 'crypto-js/lib-typedarrays';
import * as nanocurrency from 'nanocurrency';
import { pbkdf2 } from 'pbkdf2';
import zxcvbn from 'zxcvbn';

import api from '../../../../utils/api';
import snackbar from '../../../../utils/snackbar';
import { StyledAlert, StyledDialogContentText, StyledLinearProgress } from './styled';

interface Props {
    open: boolean;
    serverKey: string;
    setLsWalletKey: (value: string) => void;
    setSsWalletKey: (value: string) => void;
    decryptWalletServer: (key: string) => Promise<string>;
}

const PassworPromptModal = (props: Props) => {
    const { open, serverKey, setLsWalletKey, setSsWalletKey, decryptWalletServer } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState<string | null>(null);

    const handleClose = () => {
        const a = 1;
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleSubmit = useCallback(() => {
        setIsLoading(true);
        snackbar.info('Wallet unlocking... please, wait.');
        decryptWalletServer(password ?? '').then((key) => {
            snackbar.success('Wallet successfully unlocked!');
            setLsWalletKey(key);
        }).catch((e) => {
            snackbar.error('Wallet unlock fail. Try retyping the password.');
        }).finally(() => {
            setIsLoading(false);
        });
    }, [decryptWalletServer, password, setLsWalletKey]);

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} >
        <DialogTitle id='responsive-dialog-title'>Wallet unlock</DialogTitle>
        <DialogContent>
            <StyledDialogContentText>
                Insert your password to unlock your Nano wallet.
            </StyledDialogContentText>
            <StyledDialogContentText>
                If you forgot the password, you can create a new wallet. You will lose access to the funds on current wallet.
            </StyledDialogContentText>
            <TextField autoFocus margin='dense' label='Password' type='password' variant='outlined'
                        color='primary' fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleSubmit} color='default' disabled={isLoading}>
                Unlock
            </Button>
        </DialogActions>
      </Dialog>
    );
};

export default PassworPromptModal;
