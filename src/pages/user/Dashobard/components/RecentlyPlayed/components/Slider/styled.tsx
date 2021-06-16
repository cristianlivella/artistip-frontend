import { Link } from '@material-ui/core';
import styled from 'styled-components';

export const Container = styled.div`
    text-align: center;
    padding: 0 30px;
`;

export const Image = styled.img`
    margin: 0 auto;
    height: 160px;
    width: 160px;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
`;

export const StyledArtist = styled(Link)`
    margin: 2px 0;
    color: #eaeaea;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const StyledTime = styled.p`
    margin: 8px 0;
    color: #d2d2d2;
`;

export const StyledTitle = styled(Link)`
    margin: 2px 0;
    color: #ececec;
    display: block;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
