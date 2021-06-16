import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setFromApi } from '../../redux/server/serverSlice';
import api from '../../utils/api';
import dayjs from '../../utils/dayjs';
import snackbar from '../../utils/snackbar';

interface MaintenanceData {
    start: string | null;
    end: string | null;
}

interface FrontendData {
    version: string;
    hotfix: boolean;
}

const ServerInfoPolling = () => {
    const [lastMaintenanceInfo, setLastMaintenanceInfo] = useState<MaintenanceData | null>(null);
    const [lastFrontendInfo, setLastFrontendInfo] = useState<FrontendData | null>(null);
    const dispatch = useDispatch();

    const checkMaintenance = useCallback((data: MaintenanceData) => {
        if (JSON.stringify(lastMaintenanceInfo) !== JSON.stringify(data)) {
            if (lastMaintenanceInfo) {
                const { start, end } = data;
                const now = dayjs();
                if (start && end && dayjs.utc(end).isAfter(now)) {
                    const startDate = dayjs.utc(start);

                    setTimeout(() => {
                        window.location.reload();
                    }, startDate.diff(now));

                    snackbar.info('Maintenance will start ' + now.to(startDate), {
                        autoHideDuration: 30 * 1000
                    });
                }
            }
            setLastMaintenanceInfo(data);
        }
    }, [lastMaintenanceInfo]);

    const checkFrontend = useCallback((data: FrontendData) => {
        if (JSON.stringify(lastFrontendInfo) !== JSON.stringify(data)) {
            if (lastFrontendInfo) {
                const refreshPage = () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 30 * 1000);
                    snackbar.info('The app will update in a few seconds');
                };

                setTimeout(() => {
                    refreshPage();
                }, data.hotfix ? 0 : (3 * 60 * 60 * 1000));
            }

            setLastFrontendInfo(data);
        }
    }, [lastFrontendInfo]);

    const updateServerInfo = useCallback(() => {
        api.request('/info', 'GET', null, false).then((res) => {
            const { data } = res;
            dispatch(setFromApi(data));

            checkMaintenance(data.maintenance);
            checkFrontend(data.frontend);
        });
    }, [dispatch, checkMaintenance, checkFrontend]);

    useEffect(() => {
        updateServerInfo();

        const interval = setInterval(() => {
            updateServerInfo();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [updateServerInfo]);

    return null;
};

export default ServerInfoPolling;
