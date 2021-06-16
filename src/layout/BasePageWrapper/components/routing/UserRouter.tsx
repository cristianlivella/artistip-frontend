import { Redirect, Route, Switch } from 'react-router-dom';

import Dashboard from '../../../../pages/user/Dashobard/Dashboard';

const UserRouter = () => {
    return (
        <Switch>
            <Route exact path='/dashboard'>
                <Dashboard />
            </Route>
            <Redirect to='/dashboard' />
        </Switch>
    );
};

export default UserRouter;
