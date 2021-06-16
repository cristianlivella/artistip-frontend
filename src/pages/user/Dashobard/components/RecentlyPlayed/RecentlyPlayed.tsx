import { useCallback, useEffect, useState } from 'react';

import api from '../../../../../utils/api';
import Slider from './components/Slider/Slider';
import { Item } from './types';

const RecentlyPlayed = () => {
    const [data, setData] = useState<Item[]>([]);

    const updateData = useCallback(() => {
        api.request('/recently-played').then(res => {
            const plays = res.data.reverse();
            const newPlays = plays.filter((song: Item) => {
                return !data.find(old => old.id === song.id && old.time === song.time );
            });
            if (newPlays.length > 0) {
                setData([...data, ...newPlays]);
            }
        });
    }, [data]);

    useEffect(() => {
        if (data.length === 0) {
            updateData();
        }

        const timer = setInterval(() => {
            updateData();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [data, updateData]);

    if (data.length === 0) {
        return null;
    }

    return <Slider items={data} />;
};

export default RecentlyPlayed;
