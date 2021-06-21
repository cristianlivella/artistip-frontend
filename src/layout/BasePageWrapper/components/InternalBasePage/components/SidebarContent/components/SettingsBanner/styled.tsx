import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

export const Container = styled(Paper)`
    max-width: 800px;
    margin: 18px 14px;
    padding: 14px;
    padding-top: 14px;
    text-align: center;
`;

export const SettingContainer = styled.div`
    display: flex;
    margin: 6px 4px;
`;

export const StyledButton = styled(Button)`
    display: block;
    margin: 12px auto 2px;
`;

export const StyledCellHeader = styled.div`
    flex-grow: 1;
    text-align: left;
`;

export const StyledCellValue = styled.div`
    flex-grow: 1;
    text-align: right;
`;
