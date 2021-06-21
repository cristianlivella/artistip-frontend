import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import useComponentSize from '@rehooks/component-size';

import CustomLoader from '../../../../../common/components/CustomLoader/CustomLoader';
import { ReduxState, UserSettings } from '../../../../../redux/types';
import api from '../../../../../utils/api';
import DataTable from './components/DataTable/DataTable';
import NoDataAvailable from './components/NoDataAvailable/NoDataAvailable';
import TimeSpanSelector from './components/TimeSpanSelector/TimeSpanSelector';
import { Container, StyledTypography } from './styled';
import { ApiResponse, TimeSpan } from './types';

const ArtistsRanking = () => {
    const [containerHeight, setContainerHeight] = useState<number | null>(null);
    const [timeSpan, setTimeSpan] = useState<TimeSpan>('week');
    const [timePeriod, setTimePeriod] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ApiResponse | null>(null);

    const userSettings = useSelector((state: ReduxState) => state.user.settings as UserSettings);
    const { budget, maxFollowers, smallArtistsConstant } = userSettings;

    const containerRef = useRef(null);
    const containerCurrentSize = useComponentSize(containerRef);
    const containerCurrentHeight = useRef(0);

    const updateData = useCallback(() => {
        api.request('/stats/' + timeSpan + '/' + timePeriod).then(res => {
            setData(res.data);
        }).finally(() => {
            setIsLoading(false);
            setContainerHeight(null);
        });
    }, [timePeriod, timeSpan]);

    useEffect(() => {
        containerCurrentHeight.current = containerCurrentSize.height;
    }, [containerCurrentSize]);

    useEffect(() => {
        setContainerHeight(containerCurrentHeight.current);
        setIsLoading(true);
    }, [timePeriod, timeSpan]);

    useEffect(() => {
        updateData();

        const timer = setInterval(() => {
            updateData();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [updateData, budget, maxFollowers, smallArtistsConstant]);

    return (
        <Container ref={containerRef} height={containerHeight}>
            <StyledTypography variant='h4'>Artists ranking</StyledTypography>
            <TimeSpanSelector value={timeSpan} set={setTimeSpan} />
            { isLoading ? <CustomLoader /> : (data?.data.length === 0 ? <NoDataAvailable /> : <DataTable data={data?.data} />)  }
        </Container>
    );
};

export default ArtistsRanking;
