import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Switch from '@material-ui/core/Switch';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';

export const PasswordStrengthBar = styled(LinearProgress)<{hexcolor: string}>`
    margin: 6px 0;
    & .MuiLinearProgress-barColorPrimary {
        background-color: ${props => props.hexcolor};
    }
`;

export const StyledAlert = styled(Alert)`
    margin: 12px 0 0;
`;

export const StyledDialogContentText = styled(DialogContentText)`
    color: #e6e6e6;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
    color: #e4e4e4;
    margin-top: 4px;
`;

export const StyledLoader = styled(CircularProgress)`
    width: 22px !important;
    height: 22px !important;
`;

export const StyledSwitch = styled(Switch)`
    & .Mui-checked {
        color: #3f51b5;
    }

    & .Mui-checked + .MuiSwitch-track {
        background-color: #6f84ff;
    }
`;
