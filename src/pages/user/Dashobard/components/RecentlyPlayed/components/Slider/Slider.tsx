import { useEffect, useMemo } from 'react';

import { useWindowWidth } from '@react-hook/window-size/throttled';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

import { Item } from '../../types';
import SliderItem from './SliderItem';

interface Props {
    items: Item[];
}

const Slider = (props: Props) => {
    const data = props.items;
    const windowWidth = useWindowWidth({ leading: true });
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>();

    const computedSlidesPerView = useMemo(() => {
        if (sliderRef && slider && windowWidth) {
            const sliderWidth = sliderRef?.current?.clientWidth ?? 0;
            return Math.floor(sliderWidth / 220);
        }
        return 0;
    }, [slider, sliderRef, windowWidth]);

    useEffect(() => {
        if (slider) {
            slider.refresh({ initial: 0, slidesPerView: computedSlidesPerView, controls: false });
            slider.moveToSlide(data.length);
            const timeout = setTimeout(() => {
                slider.moveToSlide(data.length);
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [computedSlidesPerView, data, slider]);

    return (
        <div ref={sliderRef} className='keen-slider' >
            { data.map((item) => <SliderItem  key={item.id + item.time} item={item} />) }
        </div>
    );
};

export default Slider;
