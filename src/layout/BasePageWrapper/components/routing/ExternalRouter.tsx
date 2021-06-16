import { Redirect, Route, Switch } from 'react-router-dom';

import AuthPage from '../../../../pages/external/AuthPage/AuthPage';
import LoginPage from '../../../../pages/external/LoginPage/LoginPage';
import RedirectToLoginPage from '../../../../pages/external/RedirectToLoginPage/RedirectToLoginPage';

const ExternalRouter = () => {
    return (
        <Switch>
            <Route exact path='/login'>
                <LoginPage />
            </Route>
            <Route exact path='/login/spotify'>
                <RedirectToLoginPage service='spotify'/>
            </Route>
            <Route exact path='/login/google'>
                <h1>Login page (Google)</h1>
            </Route>
            <Route exact path='/auth/spotify'>
                <AuthPage service='spotify'/>
            </Route>
            <Route exact path='/auth/google'>
                <h1>Auth page (Google)</h1>
            </Route>
            <Redirect to='/login' />
        </Switch>
    );
};

export default ExternalRouter;
