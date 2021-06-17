import { useCallback, useEffect, useState } from 'react';

import dayjs from '../../../../../../../utils/dayjs';
import { Item } from '../../types';
import { Container, Image, StyledArtist, StyledTime, StyledTitle } from './styled';

interface Props {
    item: Item;
}

const SliderItem = (props: Props) => {
    const { item } = props;
    const [time, setTime] = useState('');

    const updateTime = useCallback(() => {
        setTime(dayjs.utc(item.time).from(dayjs()));
    }, [item]);

    useEffect(() => {
        updateTime();
        const timer = setInterval(() => {
            updateTime();
        }, 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [item, updateTime]);

    return (
        <Container className='keen-slider__slide'>
            <Image src={item.image} />
            <StyledTitle href={'https://open.spotify.com/track/' + item.id} target='_blank'>{item.name}</StyledTitle>
            <StyledArtist href={'https://open.spotify.com/artist/' + item.artistId} target='_blank'>{item.artist}</StyledArtist>
            <StyledTime>{time}</StyledTime>
        </Container>
    );
};

export default SliderItem;
