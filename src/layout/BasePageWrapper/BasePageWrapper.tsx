import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import CustomLoader from '../../common/components/CustomLoader/CustomLoader';
import api from '../../utils/api';
import dayjs from '../../utils/dayjs';
import BasePage from './components/BasePage/BasePage';
import ErrorPage from './components/ErrorPage/ErrorPage';
import { ServerInfo } from './types';

const BasePageWrapper = () => {
    const [serverInfo, setServerInfo] = useState<ServerInfo | null | false>(null);

    useEffect(() => {
        api.request('/info', 'GET', null, false).then(res => {
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
            <CustomLoader />
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
        return (
            <BrowserRouter>
                <BasePage />
            </BrowserRouter>
        );
    }

    return <ErrorPage />;
};

export default BasePageWrapper;
