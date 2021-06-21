import { useSelector } from 'react-redux';

import { Alert, AlertTitle } from '@material-ui/lab';
import bigInt from 'big-integer';

import { ReduxState, UserSettings } from '../../../../../../../../redux/types';
import { Container } from './styled';

const LowBalanceBanner = () => {
    const { balance } = useSelector((state: ReduxState) => state.user);
    const { budget } = useSelector((state: ReduxState) => state.user.settings as UserSettings);

    if (bigInt(balance ?? '0').greaterOrEquals(bigInt(budget ?? '0'))) {
        return null;
    }

    return <Container elevation={3}>
        <Alert variant='outlined' severity='error'>
            <AlertTitle>Insufficient balance</AlertTitle>
            Your balance is not sufficient to send the tips of this week. Make a deposit, or set a lower weekly budget.
        </Alert>
    </Container>;
};

export default LowBalanceBanner;
