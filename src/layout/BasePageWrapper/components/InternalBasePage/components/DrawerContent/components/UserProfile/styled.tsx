import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import styled from 'styled-components/macro';

export const Container = styled.div`
    margin: 0 12px;
    display: flex;
`;

export const UserName = styled.div`
    margin: auto 14px;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const StyledAvatar = styled(Avatar)`
    width: 56px;
    height: 56px;
`;

export const StyledButton = styled(Button)`
    margin: auto;
    margin-right: 0;
    flex-shrink: 0;
`;
