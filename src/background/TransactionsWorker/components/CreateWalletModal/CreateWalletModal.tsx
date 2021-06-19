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
import { StyledAlert, StyledDialogContentText, StyledLinearProgress } from './styled';

interface Props {
    open: boolean;
    serverKey: string;
    setLsWalletKey: (value: string) => void;
    setSsWalletKey: (value: string) => void;
}

const CreateWalletModal = (props: Props) => {
    const { open, serverKey, setLsWalletKey, setSsWalletKey} = props;
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

    const handleClose = () => {
        const a = 1;
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const passwordScore = useMemo(() => {
        const strength = zxcvbn(password ?? '');
        const score = strength.score;
        return (score < 4) ? score : (score +
            (strength.crack_times_display.offline_slow_hashing_1e4_per_second === 'centuries' ? 1 : 0) +
            (strength.crack_times_display.offline_fast_hashing_1e10_per_second === 'centuries' ? 1 : 0));
    }, [password]);

    const passwordScoreColor = useMemo(() => {
        if (passwordScore < 4) {
            return '#dc143c';
        }
        else if (passwordScore < 6) {
            return '#ff8c00';
        }
        return '#28b128';
    }, [passwordScore]);

    const passwordsAreEquals = useMemo(() => {
        return password === confirmPassword;
    }, [confirmPassword, password]);

    const passwordIsValid = useMemo(() => {
        return (passwordScore > 4) && passwordsAreEquals;
    }, [passwordsAreEquals, passwordScore]);

    const passwordError = useMemo(() => {
        if (password === null || confirmPassword === null) {
            return null;
        }
        else if (passwordScore < 5) {
            return 'The passwor is too weak. Try adding more characters or words.';
        }
        else if (!passwordsAreEquals) {
            return 'Password confirmation is invalid. Try typing it again.';
        }
        return null;
    }, [confirmPassword, password, passwordsAreEquals, passwordScore]);

    const generateWallet = useCallback(async () => {
        setIsLoading(true);
        const seed = await nanocurrency.generateSeed();
        const secretKey = nanocurrency.deriveSecretKey(seed, 0);
        const publicKey = nanocurrency.derivePublicKey(secretKey);
        const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
        const salt = array.random(32).toString();
        pbkdf2(password ?? '', salt, 10000000, 32, (_err, res) => {
            const encryptedSeed = AES.encrypt(seed, res.toString()).toString();
            const dataToSave = {salt, encryptedSeed};
            const encodedData = btoa(JSON.stringify(dataToSave));
            api.request('/wallets', 'POST', {
                address, seed: encodedData
            }).then(() => {
                const encryptedKey = AES.encrypt(seed, serverKey);
                setLsWalletKey(encryptedKey.toString());
                return true;
            });
        });
    }, [password]);

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} >
        <DialogTitle id='responsive-dialog-title'>Welcome on ArtisTip!</DialogTitle>
        <DialogContent>
            <StyledDialogContentText>
                You need to choose a password to protect your Nano wallet.
            </StyledDialogContentText>
            <StyledDialogContentText>
                This password will be used to encrypt your new private key; please keep in mind that we cannot help you recover it in any way,
                and you may lose access to your funds if you forget it.
            </StyledDialogContentText>
            <StyledDialogContentText>
                Choose a strong password and write it down in a safe place.
                </StyledDialogContentText>
            <TextField autoFocus margin='dense' label='Password' type='password' variant='outlined'
                        color='primary' fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <StyledLinearProgress variant='determinate' value={(passwordScore + 1) / 7 * 100} hexcolor={passwordScoreColor} />
            <TextField margin='dense' label='Confirm password' type='password' variant='outlined'
                        color='primary' fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            {passwordError && <StyledAlert variant='outlined' severity='error'>
                {passwordError}
            </StyledAlert>}
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={generateWallet} color='default' disabled={!passwordIsValid || isLoading}>
                Confirm
            </Button>
        </DialogActions>
      </Dialog>
    );
};

export default CreateWalletModal;
