import CountUp from 'react-countup';

import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export const Container = styled(Paper)<{red: number}>`
    max-width: 800px;
    margin: 14px;
    padding: 16px;
    padding-top: 6px;
    text-align: center;
    ${props => props.red ? 'color: #f44336;' : ''}
`;

export const DecimalCountUp = styled(CountUp)`
    font-size: 1.6rem;
`;

export const DecimalSeparator = styled.span`
    font-size: 2.2rem;
`;

export const IntegerCountUp = styled(CountUp)`
    font-size: 2.6rem;
`;

export const NanoLabel = styled.span`
    font-size: 1.2rem;
    margin-left: 8px;
`;

export const StyledButton = styled(Button)`
    display: block;
    margin: 12px auto 2px;
`;

export const UsdCountUp = styled(CountUp)`
    font-size: 1.15rem;
`;
