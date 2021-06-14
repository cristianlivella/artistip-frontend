import { useMemo } from 'react';

import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';

import BasePage from './layout/BasePage/BasePage';

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
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BasePage />
            </ThemeProvider>
        </StylesProvider>
	);
};

export default App;
