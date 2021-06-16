import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';

import CustomLoader from '../../../common/components/CustomLoader/CustomLoader';
import { setFromApi } from '../../../redux/user/userSlice';
import api from '../../../utils/api';
import snackbar from '../../../utils/snackbar';
import { Container, Section, StyledButton, StyledFormControlLabel, StyledLink, StyledTypography } from './styled';

interface Props {
    service: 'google' | 'spotify';
}

interface ChekboxState {
    terms: boolean;
    privacy: boolean;
}

const AuthPage = (props: Props) => {
    const { service } = props;

    const [checkboxState, setCheckboxState] = useState<ChekboxState>({ terms: false, privacy: false });
    const [needAcceptPolicy, setNeedAcceptPolicy] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const onLoginError = useCallback(() => {
        snackbar.error('Login failed. Please, try again.');
        history.push('/login');
    }, [history]);

    const refreshUserProfile = useCallback(() => {
        api.request('/users/me', 'GET', null, false).then((res) => {
            const { data } = res;
            dispatch(setFromApi(data));
            snackbar.success('Successfully logged in');
        }).catch(() => {
            onLoginError();
        });
    }, [dispatch, onLoginError]);

    const acceptPrivacyPolicy = () => {
        api.request('/privacy', 'POST', {consent: true}).then(() => {
            refreshUserProfile();
        }).catch(() => {
            setIsLoading(false);
        });
    };

    const handleCheboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckboxState({ ...checkboxState, [e.target.name]: e.target.checked });
    };

    const handleButton = () => {
        if (checkboxState.terms && checkboxState.privacy) {
            localStorage.setItem('access_token', accessToken);
            setIsLoading(true);
            acceptPrivacyPolicy();
        }
        else {
            snackbar.info('You must accept the terms and the privacy policy to continue');
        }
    };

    const canAcceptPolicy = checkboxState.terms && checkboxState.privacy;

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const code = params.get('code');

        api.request('/auth/login/' + service + '/code', 'POST', { code }, false).then(res => {
            const { data } = res;
            if (data.privacy) {
                localStorage.setItem('access_token', data.accessToken);
                refreshUserProfile();
            }
            else {
                setNeedAcceptPolicy(true);
                setAccessToken(data.accessToken);
            }
        }).catch(() => {
            onLoginError();
        });
    }, [onLoginError, refreshUserProfile, service]);

    if (needAcceptPolicy) {
        return (
            <Container>
                <StyledTypography variant='h2'>
                    ArtisTip
                </StyledTypography>
                <Section elevation={3}>
                    <StyledTypography variant='h5'>
                        We're almost there!
                    </StyledTypography>
                    <StyledTypography variant='body1'>
                        To start using ArtisTip you must read and accept our{' '}
                        <StyledLink href='#' color='inherit'>Terms of Service</StyledLink> and our {' '}
                        <StyledLink href='#' color='inherit'>Privacy Policy</StyledLink>.
                    </StyledTypography>
                    <StyledFormControlLabel
                        control={<Checkbox
                            checked={checkboxState.terms}
                            onChange={handleCheboxChange}
                            name='terms'
                            color='secondary' />}
                        label='I have read and I accept the Terms of Service' />
                    <StyledFormControlLabel
                        control={<Checkbox
                            checked={checkboxState.privacy}
                            onChange={handleCheboxChange}
                            name='privacy'
                            color='secondary' />}
                        label='I have read and I accept the Privacy Policy' />
                    <StyledButton variant='contained' color='primary' disabled={!canAcceptPolicy || isLoading} onClick={handleButton}>
                        Continue
                    </StyledButton>
                </Section>
            </Container>
        );
    }

    return <CustomLoader />;
};

export default AuthPage;
