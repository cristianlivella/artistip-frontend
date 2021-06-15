import { NavLink } from 'react-router-dom';

import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export const Container = styled.div`
    margin: 24px;
    text-align: center;
`;

export const Footer = styled(Typography)`
    margin: 36px 12px;
`;

export const Section = styled(Paper)`
    max-width: 800px;
    margin: 32px auto;
    padding: 16px;
`;

export const StyledButton = styled(Button)`
    margin: 8px;
    background-color: #15863d;
    &:hover {
        background-color: #127535;
    }
`;

export const StyledLink = styled(Link)`
    margin: 0 8px;
`;

export const StyledNavLink = styled(NavLink)`
    text-decoration: none;
`;

export const StyledTypography = styled(Typography)`
    margin: 12px;
`;
