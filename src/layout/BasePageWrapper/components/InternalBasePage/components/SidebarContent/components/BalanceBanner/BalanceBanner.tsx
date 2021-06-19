import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import bigInt from 'big-integer';

import WalletAddressModal from '../../../../../../../../common/components/WalletAddressModal/WalletAddressModal';
import { ReduxState } from '../../../../../../../../redux/types';
import { setFromApi } from '../../../../../../../../redux/user/userSlice';
import api from '../../../../../../../../utils/api';
import { Container, DecimalCountUp, DecimalSeparator, IntegerCountUp, NanoLabel, StyledButton, UsdCountUp } from './styled';

const BalanceBanner = () => {
    const dispatch = useDispatch();

    const [walletModal, setWalletModal] = useState(false);

    const handleWalletModalClose = useCallback(() => {
        setWalletModal(false);
        api.request('/users/me', 'GET', null, false).then((res) => {
            const { data } = res;
            dispatch(setFromApi(data));
        });
    }, [dispatch]);

    const walletAddress = useSelector((state: ReduxState) => state.user.wallet) ?? '0';
    const balance = useSelector((state: ReduxState) => state.user.balance) ?? '0';
    const nanoPrice = useSelector((state: ReduxState) => state.server.nanoPrice);

    const balanceIntPart = bigInt(balance).divide(bigInt(10).pow(30));
    const balanceDecimalPart = bigInt(balance).divide(bigInt(10).pow(24)).minus(balanceIntPart.multiply(bigInt(10).pow(8))).abs();
    const balanceUsd = bigInt(balance).divide(bigInt(10).pow(22)).toJSNumber() / Math.pow(10, 8) * nanoPrice;

    const balanceNegative = bigInt(balance).lesser(0);

    return (
        <Container elevation={3} red={balanceNegative ? 1 : 0}>
            <div>
                <IntegerCountUp
                    start={0}
                    end={balanceIntPart.toJSNumber()}
                    duration={4}
                    preserveValue={true}
                    separator=''
                />
                <DecimalSeparator>.</DecimalSeparator>
                <DecimalCountUp
                   start={0}
                   end={balanceDecimalPart.toJSNumber()}
                   duration={4}
                   preserveValue={true}
                   formattingFn={val => val.toLocaleString('en-US', {minimumIntegerDigits: 6, useGrouping: false})}
                   separator=''
               />
               <NanoLabel>NANO</NanoLabel>
            </div>
            <UsdCountUp
               start={0}
               end={balanceUsd}
               duration={4}
               preserveValue={true}
               decimals={2}
               separator=''
               decimal='.'
               prefix='$'
           />
           <StyledButton variant='outlined' onClick={() => setWalletModal(true)}>
               Deposit
           </StyledButton>
           <WalletAddressModal open={walletModal} onClose={handleWalletModalClose} address={walletAddress} />
        </Container>
    );
};

export default BalanceBanner;
