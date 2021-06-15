import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

const UserRouter = () => {
    return (
        <Switch>
            <Route exact path='/dashboard'>
                <h1>Welcome from UsrRouter!</h1>
            </Route>
            <Redirect to='/dashboard' />
        </Switch>
    );
};

export default UserRouter;
