import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { StyledDialogContentText, StyledLink, StyledQRCode } from './styled';

interface Props {
    open: boolean;
    onClose: () => void;
    address: string;
    isWalletNew?: boolean;
}

const WalletAddressModal = (props: Props) => {
    const { open, onClose, address, isWalletNew } = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onClose} disableScrollLock maxWidth='md' >
        <DialogTitle id='responsive-dialog-title'>Wallet deposit address</DialogTitle>
        <DialogContent>
            <StyledDialogContentText>
                This is your Nano wallet address: <StyledLink href={'nano:' + address} target='_blank'>{address}</StyledLink>.
            </StyledDialogContentText>
            <StyledDialogContentText>
                You can deposit here the funds you want to send to your favorite artists. This wallet is encrypted with the password you chose.
                Please keep in mind that we cannot help you to recover your funds if you forget the password.
            </StyledDialogContentText>
            { isWalletNew && <StyledDialogContentText>
                Don't forget to set your weekly budget and the other settings with the button on the sidebar!
            </StyledDialogContentText> }
            <StyledQRCode size={180} value={address} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color='default' >
                Close
            </Button>
        </DialogActions>
      </Dialog>
    );
};

export default WalletAddressModal;
