import { useCallback, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import snackbar from '../../../../utils/snackbar';
import { StyledDialogContentText, StyledFormControlLabel, StyledLoader, StyledSwitch } from './styled';

interface Props {
    open: boolean;
    setLsWalletKey: (key: string | null) => void;
    setSsWalletKey: (key: string | null) => void;
    decryptWalletServer: (key: string) => Promise<string>;
    createNewWallet: () => void;
}

const PasswordPromptModal = (props: Props) => {
    const { createNewWallet, open, setLsWalletKey, setSsWalletKey, decryptWalletServer } = props;
    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState<string>('');
    const [savePassword, setSavePassword] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleSubmit = useCallback(() => {
        setIsLoading(true);
        snackbar.info('Unlocking wallet... please, wait.');
        decryptWalletServer(password ?? '').then((key) => {
            snackbar.success('Wallet successfully unlocked!');
            setLsWalletKey(savePassword ? key : null);
            setSsWalletKey(!savePassword ? key : null);
        }).catch((e) => {
            snackbar.error('Wallet unlock fail. Try retyping the password.');
        }).finally(() => {
            setIsLoading(false);
        });
    }, [decryptWalletServer, password, savePassword, setLsWalletKey, setSsWalletKey]);

    const handleKeyDown = useCallback((e) => {
        if (e.keyCode === 13 && !isLoading) {
            handleSubmit();
        }
    }, [handleSubmit, isLoading]);

    useEffect(() => {
        setPassword('');
        setSavePassword(false);
        setIsLoading(false);
    }, [open]);

    return (
        <Dialog fullScreen={fullScreen} open={open} disableScrollLock >
        <DialogTitle id='responsive-dialog-title'>Wallet unlock</DialogTitle>
        <DialogContent>
            <StyledDialogContentText>
                Insert your password to unlock your Nano wallet.
            </StyledDialogContentText>
            <StyledDialogContentText>
                If you forgot your password, you can create a new wallet. You will lose access to the funds on current wallet.
            </StyledDialogContentText>
            <TextField autoFocus margin='dense' label='Password' type='password' variant='outlined' disabled={isLoading}
                color='primary' fullWidth value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            <StyledFormControlLabel
                control={
                    <StyledSwitch
                        checked={savePassword}
                        onChange={() => setSavePassword(!savePassword)}
                        color='primary'
                        disabled={isLoading}
                    />
                }
                label='Save password in the browser until logout'
            />
        </DialogContent>
        <DialogActions>
            { isLoading && <StyledLoader /> }
            <Button onClick={createNewWallet} color='primary' disabled={isLoading}>
                Create new wallet
            </Button>
            <Button onClick={handleSubmit} color='default' disabled={isLoading}>
                Unlock
            </Button>
        </DialogActions>
      </Dialog>
    );
};

export default PasswordPromptModal;
