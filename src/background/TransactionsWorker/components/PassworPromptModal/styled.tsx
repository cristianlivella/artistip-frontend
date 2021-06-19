import DialogContentText from '@material-ui/core/DialogContentText';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import styled from 'styled-components';

export const StyledAlert = styled(Alert)`
    margin: 12px 0 0;
`;

export const StyledDialogContentText = styled(DialogContentText)`
    color: #e6e6e6;
`;

export const StyledLinearProgress = styled(LinearProgress)<{hexcolor: string}>`
    margin: 6px 0;
    & .MuiLinearProgress-barColorPrimary {
        background-color: ${props => props.hexcolor};
    }
`;
