import { useCallback, useEffect, useState } from 'react';

import dayjs from '../../../../../../../../../utils/dayjs';

interface Props {
    date: string;
}

const TimeToMaintenance = (props: Props) => {
    const { date } = props;
    const [time, setTime] = useState('');

    const updateTime = useCallback(() => {
        setTime(dayjs().to(dayjs.utc(date)));
    }, [date]);

    useEffect(() => {
        updateTime();
        const timer = setInterval(() => {
            updateTime();
        }, 30 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [date, updateTime]);

    return <>{time}</>;
};

export default TimeToMaintenance;
