import { useMemo } from 'react';

import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';

import BasePageWrapper from './layout/BasePageWrapper/BasePageWrapper';
import { SnackbarUtilsConfigurator } from './utils/snackbar';

const App = () => {
    const theme = useMemo(() => {
        return createMuiTheme({
          palette: {
            type: 'dark',
          },
        });
    }, []);

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
