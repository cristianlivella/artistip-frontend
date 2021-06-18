import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export const Container = styled.div<{height: number | null}>`
    ${props => props.height ? 'height: ' + props.height + 'px' : ''}
`;

export const StyledTypography = styled(Typography)`
    margin-bottom: 14px;
`;
