import { useEffect, useState } from 'react';

import api from '../../utils/api';
import dayjs from '../../utils/dayjs';
import ErrorPage from '../ErrorPage/ErrorPage';
import { Loader, LoaderContainer } from './styled';
import { ServerInfo } from './types';

const BasePage = () => {
    const [serverInfo, setServerInfo] = useState<ServerInfo | null | false>(null);

    useEffect(() => {
        api.request('/info').then(res => {
            setServerInfo(res.data);
        }).catch(() => {
            api.request('/maintenance.json').then(res => {
                setServerInfo(res.data);
            }).catch(() => {
                setServerInfo(false);
            });
        });
    }, []);

    if (serverInfo === null) {
        return (
            <LoaderContainer>
                <Loader color={'secondary'} />
            </LoaderContainer>
        );
    }

    if (serverInfo === false) {
        return <ErrorPage />;
    }

    const { start, end } = serverInfo.maintenance;
    const now = dayjs();
    if (start && end && dayjs.utc(start).subtract(1, 'minute').isBefore(now) && dayjs.utc(end).isAfter(now)) {
        return (
            <ErrorPage maintenanceEnd={end} />
        );
    }

    const { status } = serverInfo;
    if (status === 'ok') {
        // TODO: load the application
        return <h1>Welcome!</h1>;
    }

    return <ErrorPage />;
};

export default BasePage;
