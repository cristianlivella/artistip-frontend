import { useEffect, useMemo } from 'react';

import useComponentSize from '@rehooks/component-size';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

import { Item } from '../../types';
import SliderItem from './SliderItem';

interface Props {
    items: Item[];
}

const Slider = (props: Props) => {
    const data = props.items;
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>();
    const sliderSize = useComponentSize(sliderRef);

    const computedSlidesPerView = useMemo(() => {
        if (sliderRef && slider) {
            const { width } = sliderSize;
            return Math.floor(width / 220);
        }
        return 0;
    }, [slider, sliderRef, sliderSize]);

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
    }, [computedSlidesPerView, data, slider, sliderSize]);

    return (
        <div ref={sliderRef} className='keen-slider' >
            { data.map((item) => <SliderItem  key={item.id + item.time} item={item} />) }
        </div>
    );
};

export default Slider;
