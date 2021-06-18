import { Avatar } from '@material-ui/core';
import { Link } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export const AvatarTableCell = styled(TableCell)`
    padding: 6px 16px;
    width: 1px;
`;

export const Container = styled.div`
    margin: 24px 0;
    & > div {
        overflow-y: hidden;
    }
`;

export const FixedWidthCell = styled(TableCell)`
    width: 12%;
    white-space: nowrap;
`;

export const StyledLink = styled(Link)`
    color: inherit;
`;

export const SmallTableCell = styled(TableCell)`
    width: 1px;
    white-space: nowrap;
`;

export const StyledAvatar = styled(Avatar)`
    width: 46px;
    height: 46px;
`;

export const StyledTableHeader = styled(TableRow)`
    background-color: #383838;
    font-weight: bold;
`;
