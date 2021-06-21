import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import bigInt from 'big-integer';

import { ReduxState, UserSettings } from '../../../../../../../../../../redux/types';
import api from '../../../../../../../../../../utils/api';
import { StyledDialogContentText } from './styled';

interface Props {
    open: boolean;
    onClose: () => void;
}

const SettingsModal = (props: Props) => {
    const { open, onClose } = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const nanoMinimumAmount = useSelector((state: ReduxState) => state.server.nanoMinimumAmount);
    const userSettings = useSelector((state: ReduxState) => state.user.settings as UserSettings);
    const formattedBudget = bigInt(userSettings.budget).divide(bigInt(10).pow(22)).toJSNumber() / Math.pow(10, 8);
    const nanoMaxDecimalDigits = 30 - nanoMinimumAmount.replace(/[^0]/g, '').length;

    const [isLoading, setIsLoading] = useState(false);
    const [budget, setBudget] = useState('123');
    const [maxFollowers, setMaxFollowers] = useState('');
    const [smallArtistsConstant, setSmallArtistsConstant] = useState('');

    const handleBudgetChange = (value: string) => {
        const maxIntegerDigits = 4;
        const maxDecimalDigits = nanoMaxDecimalDigits;
        value = value.replaceAll(',', '.').replace(/[^0-9.]/g, '').split('.', 2).join('.');
        value = value.split('.')[0].substring(0, maxIntegerDigits) + (value.indexOf('.') >= 0 ? ('.' + value.split('.')[1].substring(0, maxDecimalDigits)) : '') ;
        setBudget(value);
    };

    const handleMaxFollowersChange = (value: string) => {
        value = isNaN(parseInt(value, 10)) ? '0' : value.replace(/[^0-9]/g, '').substring(0, 9);
        setMaxFollowers(parseInt(value, 10).toString());
    };

    const handleSmallArtistsConstant = (value: string) => {
        const maxIntegerDigits = 3;
        const maxDecimalDigits = 1;
        value = value.replaceAll(',', '.').replace(/[^0-9.]/g, '').split('.', 2).join('.');
        value = value.split('.')[0].substring(0, maxIntegerDigits) + (value.indexOf('.') >= 0 ? ('.' + value.split('.')[1].substring(0, maxDecimalDigits)) : '') ;
        if (parseFloat(value) < 1) {
            value = '1';
        }
        setSmallArtistsConstant(value);
    };

    const estimatedPayoutSmallArtist = useMemo(() => {
        const constant = isNaN(parseFloat(smallArtistsConstant)) ? 1 : parseFloat(smallArtistsConstant);
        return 10 * constant;
    }, [smallArtistsConstant]);

    const handleSubmit = useCallback(() => {
        const settingsData = {
            budget: bigInt(isNaN(parseFloat(budget)) ? 0 : (parseFloat(budget) * Math.pow(10, nanoMaxDecimalDigits))).multiply(bigInt(10).pow(30 - nanoMaxDecimalDigits)).toString(),
            maxFollowers,
            smallArtistsConstant: isNaN(parseFloat(smallArtistsConstant)) ? 1 : parseFloat(smallArtistsConstant)
        };
        api.request('/settings', 'PUT', settingsData).then(() => {
            onClose();
        }).finally(() => {
            setIsLoading(false);
        });
    }, [budget, nanoMaxDecimalDigits, onClose, maxFollowers, smallArtistsConstant]);

    const handleKeyDown = useCallback((e) => {
        if (e.keyCode === 13 && !isLoading) {
            handleSubmit();
        }
    }, [handleSubmit, isLoading]);

    useEffect(() => {
        if (open) return;
        setBudget(formattedBudget.toString());
        setMaxFollowers(userSettings.maxFollowers.toString());
        setSmallArtistsConstant(userSettings.smallArtistsConstant.toString());
    }, [open, formattedBudget, userSettings]);

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onClose} disableScrollLock >
        <DialogTitle id='responsive-dialog-title'>Tips settings</DialogTitle>
        <DialogContent>
            <TextField margin='dense' label='Weekly budget' variant='outlined'
                        color='primary' fullWidth value={budget} disabled={isLoading}
                        onChange={(e) => handleBudgetChange(e.target.value)} onKeyDown={handleKeyDown} />
            <StyledDialogContentText>
                This is the amount of NANO will be sent to your most listened artists, based on your listening time and other settings.
            </StyledDialogContentText>
            <TextField margin='dense' label='Maximum followers' variant='outlined'
                        color='primary' fullWidth value={maxFollowers} disabled={isLoading}
                        onChange={(e) => handleMaxFollowersChange(e.target.value)} onKeyDown={handleKeyDown} />
            <StyledDialogContentText>
                { maxFollowers !== '0' ?
                    <>Tips will be sent only to artists with less then <strong>{maxFollowers}</strong> followers.
                    Type <strong>0</strong> if you want to send tips no matter how many followers the artists have.</> :
                    <>Tips will be sent to all artists.</>
                }
            </StyledDialogContentText>
            <TextField margin='dense' label='Small artists constant' variant='outlined'
                        color='primary' fullWidth value={smallArtistsConstant} disabled={isLoading}
                        onChange={(e) => handleSmallArtistsConstant(e.target.value)} onKeyDown={handleKeyDown} />
            <StyledDialogContentText>
                { (parseFloat(smallArtistsConstant) === 1 || isNaN(parseFloat(smallArtistsConstant))) ?
                    <>
                        With this settings, all the artists wit the same listening time will receive the same amount of NANO.
                        Set an higher value to favor artists with fewer followers.
                    </>  :
                    <>
                        With this settings, with the same listening time, if an artist with <strong>1000000</strong> followers will receive <strong>10</strong> NANO,
                        an artist with <strong>1000</strong> followers will receive {estimatedPayoutSmallArtist} NANO.
                        Type <strong>1</strong> if you want don't want to favor small artists.
                    </>
                 }
            </StyledDialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color='primary' disabled={isLoading} >
                Discard
            </Button>
            <Button onClick={handleSubmit} color='default' disabled={isLoading} >
                Save
            </Button>
        </DialogActions>
      </Dialog>
    );
};

export default SettingsModal;
