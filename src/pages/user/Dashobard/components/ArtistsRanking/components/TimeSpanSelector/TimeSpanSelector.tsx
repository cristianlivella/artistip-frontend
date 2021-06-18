import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { TimeSpan } from '../../types';

interface Props {
    value: string;
    set: (value: TimeSpan) => void;
}

const TimeSpanSelector = (props: Props) => {
    const { value, set } = props;

    const timeSpans : {name: TimeSpan, label: string}[] = [
        {name: 'week', label: 'Week'},
        {name: 'month', label: 'Month'},
        {name: 'year', label: 'year'}
    ];

    return (
        <>
            <ButtonGroup color='default'>
                {timeSpans.map(timeSpan =>
                    <Button key={timeSpan.name}
                            variant={value === timeSpan.name ? 'contained' : undefined}
                            onClick={() => set(timeSpan.name)} >
                        {timeSpan.label}
                    </Button>)
                }
            </ButtonGroup>
        </>
    );
};

export default TimeSpanSelector;
