import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components/macro';

const drawerStyle = `
    @media (min-width: 960px) {
        width: 240px;
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
    }
`;

export const StyledSwipeableDrawer = styled(SwipeableDrawer)`
    & > .MuiPaper-root {
        width: 360px;
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

export const StyledToolbar = styled(Toolbar)`
    ${props => props.theme.mixins.toolbar}
`;

export const Content = styled.div`
    flex-grow: 1;
    padding: 24px;
    margin-top: 54px;
    @media (max-width: 600px) {
        margin-top: 40px;
    }
`;
