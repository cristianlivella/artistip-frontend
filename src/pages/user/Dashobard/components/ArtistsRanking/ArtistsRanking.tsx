import { useCallback, useEffect, useState } from 'react';

import CustomLoader from '../../../../../common/components/CustomLoader/CustomLoader';
import api from '../../../../../utils/api';
import DataTable from './components/DataTable/DataTable';
import TimeSpanSelector from './components/TimeSpanSelector/TimeSpanSelector';
import { StyledTypography } from './styled';
import { ApiResponse, TimeSpan } from './types';

const ArtistsRanking = () => {
    const [timeSpan, setTimeSpan] = useState<TimeSpan>('week');
    const [timePeriod, setTimePeriod] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ApiResponse | null>(null);

    const updateData = useCallback((background: boolean = false) => {
        if (!background) {
            setIsLoading(true);
        }
        api.request('/stats/' + timeSpan + '/' + timePeriod).then(res => {
            setData(res.data);
        }).finally(() => {
            if (!background) {
                setIsLoading(false);
            }
        });
    }, [timePeriod, timeSpan]);

    useEffect(() => {
        updateData();

        const timer = setInterval(() => {
            updateData(true);
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [updateData]);

    return (
        <>
            <StyledTypography variant='h4'>Artists ranking</StyledTypography>
            <TimeSpanSelector value={timeSpan} set={setTimeSpan} />
            { isLoading ? <CustomLoader /> : (data !== null && <DataTable data={data.data} />)  }
        </>
    );
};

export default ArtistsRanking;
