import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import styled from 'styled-components/macro';

const drawerStyle = `
    @media (min-width: 960px) {
        width: 360px;
        flex-shrink: 0;
    }
`;

export const MainContainer = styled.div`
    display: flex;
`;

export const AppTitleContainer = styled.div<{center: boolean}>`
    ${props => props.center ? 'margin: 0 auto !important;' : ''}
`;

export const DrawerContainer = styled.nav<{show: boolean}>`
    ${drawerStyle}
    ${props => props.show ? '' : 'display: none;'}
`;

export const StyledDrawer = styled(Drawer)`
    ${drawerStyle}
    & > .MuiPaper-root {
        width: 360px;
        background-color: #303030;
    }
`;

export const StyledSwipeableDrawer = styled(SwipeableDrawer)`
    & > .MuiPaper-root {
        width: 360px;
        background-color: #303030;
    }
    @media (max-width: 400px) {
        & > .MuiPaper-root {
            width: 100%;
        }
    }
`;

export const StyledAppBar = styled(AppBar)`
    z-index: ${props => props.theme.zIndex.drawer + 1} !important;
    @media (min-width: 960px) {
        display: none !important;
    }
`;

export const MenuButtonContainer = styled.div<{show: boolean}>`
    ${props => props.show ? '' : 'display: none !important;'}
`;

export const MenuButton = styled(IconButton)`
    @media (min-width: 960px) {
        display: none !important;
    }
`;

export const Content = styled.div`
    flex-grow: 1;
    padding: 24px;
    max-width: 100%;
    overflow-x: hidden;
    @media (max-width: 960px) {
        margin-top: 54px;
    }
    @media (max-width: 600px) {
        margin-top: 40px;
    }
`;
