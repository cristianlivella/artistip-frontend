import { useSelector } from 'react-redux';

import { Alert, AlertTitle } from '@material-ui/lab';

import { ReduxState } from '../../../../../../../../redux/types';
import dayjs from '../../../../../../../../utils/dayjs';
import TimeToMaintenance from './components/TimeToMaintenance';
import { Container } from './styled';

const MaintenanceBanner = () => {
    const { start, end } = useSelector((state: ReduxState) => state.server.maintenance);

    if (!start || !end || !dayjs.utc(end).isAfter(dayjs())) {
        return null;
    }

    const alreadyStarted = dayjs.utc(start).isBefore(dayjs());

    return <Container elevation={3}>
        <Alert variant='outlined' severity='warning'>
            <AlertTitle>App maintenance</AlertTitle>
            {
                alreadyStarted ?
                'ArtisTip is in maintenance mode' :
                <>Maintenance will start <TimeToMaintenance date={start} /></>

            }
        </Alert>
    </Container>;
};

export default MaintenanceBanner;
