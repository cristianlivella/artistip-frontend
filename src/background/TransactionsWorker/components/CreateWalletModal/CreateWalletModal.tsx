import { useCallback, useEffect, useMemo, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AES from 'crypto-js/aes';
import array from 'crypto-js/lib-typedarrays';
import * as nanocurrency from 'nanocurrency';
import { pbkdf2 } from 'pbkdf2';
import zxcvbn from 'zxcvbn';

import api from '../../../../utils/api';
import snackbar from '../../../../utils/snackbar';
import { PasswordStrengthBar, StyledAlert, StyledDialogContentText, StyledFormControlLabel, StyledLoader, StyledSwitch } from './styled';

interface Props {
    open: boolean;
    serverKey: string;
    isFirstWallet: boolean;
    setLsWalletKey: (key: string | null) => void;
    setSsWalletKey: (key: string | null) => void;
    onClose: () => void;
    onWalletGenerated: (address: string) => void;
}

const CreateWalletModal = (props: Props) => {
    const { onWalletGenerated, open, serverKey, setLsWalletKey, setSsWalletKey, isFirstWallet, onClose } = props;
    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [savePassword, setSavePassword] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const passwordScore = useMemo(() => {
        const strength = zxcvbn(password ?? '');
        const score = strength.score;
        return score +
            (strength.crack_times_display.offline_slow_hashing_1e4_per_second === 'centuries' ? 1 : 0) +
            (strength.crack_times_display.offline_fast_hashing_1e10_per_second === 'centuries' ? 1 : 0);
    }, [password]);

    const passwordScoreColor = useMemo(() => {
        if (passwordScore < 4) {
            return '#dc143c';
        }
        else if (passwordScore < 5) {
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
        if (password === '' || confirmPassword === '') {
            return null;
        }
        else if (passwordScore < 5) {
            return 'The password is too weak. Try adding more characters or words.';
        }
        else if (!passwordsAreEquals) {
            return 'Password confirmation is invalid. Try typing it again.';
        }
        return null;
    }, [confirmPassword, password, passwordsAreEquals, passwordScore]);

    const generateWallet = useCallback(async () => {
        setIsLoading(true);
        snackbar.info('Generating wallet... please, wait.');
        const seed = await nanocurrency.generateSeed();
        const secretKey = nanocurrency.deriveSecretKey(seed, 0);
        const publicKey = nanocurrency.derivePublicKey(secretKey);
        const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
        const salt = array.random(32).toString();
        pbkdf2(password ?? '', salt, 5000000, 32, (err, res) => {
            if (err) {
                snackbar.error('Key derivation failed. Please, try again.');
                return;
            }
            const encryptedSeed = AES.encrypt(seed, res.toString()).toString();
            const dataToSave = {salt, encryptedSeed};
            const encodedData = btoa(JSON.stringify(dataToSave));
            if (!address || !salt || !encryptedSeed) {
                snackbar.error('Wallet generation failed. Please, try again.');
                return;
            }
            api.request('/wallets', 'POST', {
                address, seed: encodedData
            }).then(() => {
                snackbar.success('Wallet successfully generated!');
                const encryptedKey = AES.encrypt(seed, serverKey);
                setLsWalletKey(savePassword ? encryptedKey.toString() : null);
                setSsWalletKey(!savePassword ? encryptedKey.toString() : null);
                onWalletGenerated(address);
            });
        });
    }, [onWalletGenerated, password, savePassword, serverKey, setLsWalletKey, setSsWalletKey]);

    const handleKeyDown = useCallback((e) => {
        if (e.keyCode === 13 && passwordIsValid && !isLoading) {
            generateWallet();
        }
    }, [generateWallet, isLoading, passwordIsValid]);

    useEffect(() => {
        setPassword('');
        setConfirmPassword('');
        setSavePassword(false);
        setIsLoading(false);
    }, [open]);

    return (
        <Dialog fullScreen={fullScreen} open={open} disableScrollLock >
        <DialogTitle id='responsive-dialog-title'>{isFirstWallet ? 'Welcome on ArtisTip!' : 'Create new wallet'}</DialogTitle>
        <DialogContent>
            <StyledDialogContentText>
                You need to choose a password to protect your {isFirstWallet ? 'new ' : ''}
                Nano wallet.
            </StyledDialogContentText>
            <StyledDialogContentText>
                This password will be used to encrypt your new private key; please keep in mind that we cannot help you recover it in any way,
                and you may lose access to your funds if you forget it.
            </StyledDialogContentText>
            <StyledDialogContentText>
                Choose a strong password and write it down in a safe place.
                </StyledDialogContentText>
            <TextField autoFocus margin='dense' label='Password' type='password' variant='outlined'
                        color='primary' fullWidth value={password} disabled={isLoading}
                        onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            <PasswordStrengthBar variant='determinate' value={(passwordScore + 1) / 7 * 100} hexcolor={passwordScoreColor} />
            <TextField margin='dense' label='Confirm password' type='password' variant='outlined'
                        color='primary' fullWidth value={confirmPassword} disabled={isLoading}
                        onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown} />
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
            {passwordError && <StyledAlert variant='outlined' severity='error'>
                {passwordError}
            </StyledAlert>}
        </DialogContent>
        <DialogActions>
            { isLoading && <StyledLoader /> }
            { !isFirstWallet && <Button onClick={onClose} color='primary' disabled={isLoading}>
                Cancel
            </Button> }
            <Button onClick={generateWallet} color='default' disabled={!passwordIsValid || isLoading}>
                Confirm
            </Button>
        </DialogActions>
      </Dialog>
    );
};

export default CreateWalletModal;
