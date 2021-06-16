import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import { ReduxState } from '../../../../redux/types';
import UserRouter from '../routing/UserRouter';
import SidebarContent from './components/SidebarContent/SidebarContent';
import { AppTitleContainer, Content, DrawerContainer, MainContainer, MenuButton, MenuButtonContainer, StyledAppBar, StyledDrawer, StyledSwipeableDrawer } from './styled';

const InternalBasePage = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const userInfo = useSelector((state: ReduxState) => state.user);

    const drawerContent = useMemo(() => {
        return <SidebarContent closeDrawer={() => setIsDrawerOpen(false)} />;
    }, []);

    const showSidebar = true;

    return (
        <MainContainer>
            <CssBaseline/>
            <StyledAppBar position='fixed' color='inherit'>
                <Toolbar>
                    <MenuButtonContainer show={showSidebar}>
                        <MenuButton color='inherit' edge='start' onClick={() => setIsDrawerOpen(true)} >
                            <MenuIcon/>
                        </MenuButton>
                    </MenuButtonContainer>
                    <AppTitleContainer center={!showSidebar}>
                        <Typography variant='h6' noWrap>
                            ArtisTip
                        </Typography>
                    </AppTitleContainer>
                </Toolbar>
            </StyledAppBar>

            <DrawerContainer show={showSidebar}>
                <Hidden mdUp implementation='css'>
                    <StyledSwipeableDrawer
                        variant='temporary'
                        anchor={'left'}
                        open={isDrawerOpen}
                        onOpen={() => setIsDrawerOpen(true)}
                        onClose={() => setIsDrawerOpen(false)}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        disableBackdropTransition
                    >
                        {drawerContent}
                    </StyledSwipeableDrawer>
                </Hidden>
                <Hidden smDown implementation='css'>
                    <StyledDrawer variant='permanent'>
                        {drawerContent}
                    </StyledDrawer>
                </Hidden>
            </DrawerContainer>

            <Content>
                {userInfo.type === 'user' ? <UserRouter /> : null}
            </Content>
        </MainContainer>
    );
};

export default InternalBasePage;
