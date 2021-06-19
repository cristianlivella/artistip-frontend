import DialogContentText from '@material-ui/core/DialogContentText';
import Link from '@material-ui/core/Link';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

export const StyledDialogContentText = styled(DialogContentText)`
    color: #e6e6e6;
`;

export const StyledLink = styled(Link)`
    font-weight: bold;
    word-break: break-word
`;

export const StyledQRCode = styled(QRCode)`
    margin: 0 auto;
    display: block;
    border: 5px white solid;
`;
