import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';

import BasePageWrapper from './layout/BasePageWrapper/BasePageWrapper';
import { ReduxState } from './redux/types';
import { SnackbarUtilsConfigurator } from './utils/snackbar';

const App = () => {
    const userInfo = useSelector((state: ReduxState) => state.user);

    const theme = useMemo(() => {
        return createMuiTheme({
          palette: {
            type: 'dark',
            ...(
                userInfo.id && {background: {
                    default: '#252525'
                }}
            )
          },
        });
    }, [userInfo]);

    return (
        <StylesProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} autoHideDuration={8000} maxSnack={5}>
                        <SnackbarUtilsConfigurator />
                        <CssBaseline />
                        <BasePageWrapper />
                    </SnackbarProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </StylesProvider>
	);
};

export default App;
