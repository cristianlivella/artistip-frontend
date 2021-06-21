import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import bigInt from 'big-integer';

import { ReduxState, UserSettings } from '../../../../../../../../redux/types';
import { setFromApi } from '../../../../../../../../redux/user/userSlice';
import api from '../../../../../../../../utils/api';
import SettingsModal from './components/SettingsModal/SettingsModal';
import { Container, SettingContainer, StyledButton, StyledCellHeader, StyledCellValue } from './styled';

const SettingsBanner = () => {
    const dispatch = useDispatch();

    const { budget, maxFollowers, smallArtistsConstant } = useSelector((state: ReduxState) => state.user.settings as UserSettings);
    const formattedBudget = bigInt(budget).divide(bigInt(10).pow(22)).toJSNumber() / Math.pow(10, 8) + ' NANO';

    const [settingsModal, setSettingsModal] = useState(false);

    const handleWalletModalClose = useCallback(() => {
        setSettingsModal(false);
        api.request('/users/me', 'GET', null, false).then((res) => {
            const { data } = res;
            dispatch(setFromApi(data));
        });
    }, [dispatch]);

    return (
        <Container elevation={3}>
            <SettingContainer>
                <StyledCellHeader>Weekly budget</StyledCellHeader>
                <StyledCellValue>{formattedBudget}</StyledCellValue>
            </SettingContainer>
            <SettingContainer>
                <StyledCellHeader>Maximum followers</StyledCellHeader>
                <StyledCellValue>{maxFollowers === 0 ? 'not set' : maxFollowers}</StyledCellValue>
            </SettingContainer>
            <SettingContainer>
                <StyledCellHeader>Small artists constant</StyledCellHeader>
                <StyledCellValue>{smallArtistsConstant === 1 ? 'not set' : smallArtistsConstant}</StyledCellValue>
            </SettingContainer>
            <StyledButton variant='outlined' onClick={() => setSettingsModal(true)}>
                Edit settings
            </StyledButton>
            <SettingsModal open={settingsModal} onClose={handleWalletModalClose} />
        </Container>
    );
};

export default SettingsBanner;
