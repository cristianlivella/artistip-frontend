import { useEffect, useMemo } from 'react';

import dayjs from '../../../../utils/dayjs';
import { Container, StyledTypography } from './styled';

interface Props {
    maintenanceEnd?: string;
}

const ErrorPage = (props : Props) => {
    const { maintenanceEnd } = props;

    const errorTitle = useMemo(() => {
        if (maintenanceEnd) {
            return 'Maintenance in progress';
        }
        return 'Cannot reach server';
    }, [maintenanceEnd]);

    const errorDescription = useMemo(() => {
        if (maintenanceEnd) {
            return 'Maintenance will end ' + dayjs().to(dayjs.utc(maintenanceEnd));
        }
        return 'Please, retry later';
    }, [maintenanceEnd]);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.reload();
        }, Math.min(5 * 60 * 1000, dayjs.utc(maintenanceEnd).diff(dayjs())));

        return () => {
            clearTimeout(timer);
        };
    }, [maintenanceEnd]);

    return (
        <Container>
            <StyledTypography variant='h2'>
                ArtisTip
            </StyledTypography>
            <StyledTypography variant='h4'>
                {errorTitle}
            </StyledTypography>
            <StyledTypography variant='h6'>
                {errorDescription}
            </StyledTypography>
        </Container >
    );
};

export default ErrorPage;
