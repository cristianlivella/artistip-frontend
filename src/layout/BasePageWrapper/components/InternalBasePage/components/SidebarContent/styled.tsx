import { Link } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components/macro';

export const AttributionContainer = styled.div`
    display: flex;
`;

export const Container = styled.div`
    min-height: 100%;
    display: flex;
    flex-direction: column;
`;

export const Content = styled.div`
    flex: 1 0 auto;
`;

export const Footer = styled.div`
    color: #e2e2e2;
    text-align: center;
    flex-shrink: 0;
    margin-bottom: 6px;
`;

export const SpotifyAttributionText = styled.p`
    margin: 5px 8px;
    font-size: 0.8rem;
`;

export const SpotifyLogo = styled.img`
    height: 42px;
    margin: auto 4px auto 12px;
`;

export const StyledDivider = styled(Divider)`
    margin: 8px 0;
`;

export const StyledTypography = styled(Typography)`
    text-align: center;
    margin: 14px;
    text-shadow: 0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1);

`;

export const StyledLink = styled(Link)`
    margin: 2px 4px;
`;
