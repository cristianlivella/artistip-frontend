import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Badge from '@material-ui/core/Badge';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BoringAvatar from 'boring-avatars';

import { ReduxState } from '../../../../../../../../redux/types';
import { clear } from '../../../../../../../../redux/user/userSlice';
import snackbar from '../../../../../../../../utils/snackbar';
import { Container, StyledAvatar, StyledButton, UserName } from './styled';

const UserProfile = () => {
    const userInfo = useSelector((state: ReduxState) => state.user);
    const badge = (userInfo.type === 'artist' && userInfo?.onboardingStep === 4) ? <VerifiedUserIcon /> : null;

    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        localStorage.setItem('access_token', '');
        dispatch(clear());
        snackbar.success('Successfully logged out');
    }, [dispatch]);

    return (
        <Container>
            <Badge
                overlap='circle'
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                badgeContent={badge} >
                <StyledAvatar alt={userInfo.name} src={userInfo.image} >
                    <BoringAvatar size={56} variant='beam' name={userInfo.id} colors={['#411f2d', '#ac4147', '#f88863', '#ffc27f', '#ffe29a']} />
                </StyledAvatar>
            </Badge>
            <UserName>Cristian Livella</UserName>
            <StyledButton variant='outlined' onClick={handleLogout}>
                Logout
            </StyledButton>
        </Container>
    );
};

export default UserProfile;
