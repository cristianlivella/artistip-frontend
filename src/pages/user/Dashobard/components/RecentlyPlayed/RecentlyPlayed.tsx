import { useCallback, useEffect, useState } from 'react';

import api from '../../../../../utils/api';
import NoDataAvailable from './components/NoDataAvailable/NoDataAvailable';
import Placeholder from './components/Placeholder/Placeholder';
import Slider from './components/Slider/Slider';
import { StyledTypography } from './styled';
import { Item } from './types';

const RecentlyPlayed = () => {
    const [data, setData] = useState<Item[] | null>(null);

    const updateData = useCallback(() => {
        api.request('/recently-played').then(res => {
            const oldPlays = data ?? [];
            const plays = res.data.reverse();
            const newPlays = plays.filter((song: Item) => {
                return !oldPlays.find(old => old.id === song.id && old.time === song.time );
            });
            if (data === null || newPlays.length > 0) {
                setData([...oldPlays, ...newPlays]);
            }
        });
    }, [data]);

    useEffect(() => {
        if (data === null) {
            updateData();
        }

        const timer = setInterval(() => {
            updateData();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [data, updateData]);

    return (
        <>
            <StyledTypography variant='h4'>Recently played</StyledTypography>
            { data === null ? <Placeholder /> : (data.length === 0 ? <NoDataAvailable /> : <Slider items={data} />) }
        </>
    );
};

export default RecentlyPlayed;
