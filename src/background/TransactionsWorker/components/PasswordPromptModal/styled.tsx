import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';

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
