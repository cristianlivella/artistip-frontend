import { Paper } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { Button } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export const Container = styled.div`
    margin: 24px;
    text-align: center;
`;

export const Section = styled(Paper)`
    max-width: 800px;
    margin: 32px auto;
    padding: 16px;
`;

export const StyledButton = styled(Button)`
    margin: 16px;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
    display: block;
`;

export const StyledLink = styled(Link)`
    color: #b3e6ff;
`;

export const StyledTypography = styled(Typography)`
    margin: 12px;
`;
