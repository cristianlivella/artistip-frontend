import { useCallback, useEffect, useRef, useState } from 'react';

import useComponentSize from '@rehooks/component-size';

import CustomLoader from '../../../../../common/components/CustomLoader/CustomLoader';
import api from '../../../../../utils/api';
import DataTable from './components/DataTable/DataTable';
import TimeSpanSelector from './components/TimeSpanSelector/TimeSpanSelector';
import { Container, StyledTypography } from './styled';
import { ApiResponse, TimeSpan } from './types';

const ArtistsRanking = () => {
    const [containerHeight, setContainerHeight] = useState<number | null>(null);
    const [timeSpan, setTimeSpan] = useState<TimeSpan>('week');
    const [timePeriod, setTimePeriod] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ApiResponse | null>(null);

    const containerRef = useRef(null);
    const containerCurrentSize = useComponentSize(containerRef);
    const containerCurrentHeight = useRef(0);

    const updateData = useCallback((background: boolean = false) => {
        if (!background) {
            setContainerHeight(containerCurrentHeight.current);
            setIsLoading(true);
        }
        api.request('/stats/' + timeSpan + '/' + timePeriod).then(res => {
            setData(res.data);
        }).finally(() => {
            setIsLoading(false);
            setContainerHeight(null);
        });
    }, [timePeriod, timeSpan, containerCurrentHeight]);

    useEffect(() => {
        containerCurrentHeight.current = containerCurrentSize.height;
    }, [containerCurrentSize]);

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
        <Container ref={containerRef} height={containerHeight}>
            <StyledTypography variant='h4'>Artists ranking</StyledTypography>
            <TimeSpanSelector value={timeSpan} set={setTimeSpan} />
            { isLoading ? <CustomLoader /> : (data !== null && <DataTable data={data.data} />)  }
        </Container>
    );
};

export default ArtistsRanking;
