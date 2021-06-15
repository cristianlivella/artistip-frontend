import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const CustomLoader = () => {
    return (
        <LoaderContainer>
            <Loader color={'secondary'} />
        </LoaderContainer>
    );
};

const Loader = styled(CircularProgress)`
    color: #ffffff;
`;

const LoaderContainer = styled.div`
    width: fit-content;
    margin: 24px auto;
`;

export default CustomLoader;
