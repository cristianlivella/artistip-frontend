import { useSelector } from 'react-redux';

import bigInt from 'big-integer';

import { ReduxState } from '../../../../../../../../redux/types';
import { Container, DecimalCountUp, DecimalSeparator, IntegerCountUp, NanoLabel, UsdCountUp } from './styled';

const BalanceBanner = () => {
    const balance = useSelector((state: ReduxState) => state.user.balance) ?? '0';
    const nanoPrice = useSelector((state: ReduxState) => state.server.nanoPrice);

    const balanceIntPart = bigInt(balance).divide(bigInt(10).pow(30));
    const balanceDecimalPart = bigInt(balance).divide(bigInt(10).pow(22)).minus(balanceIntPart.multiply(bigInt(10).pow(8))).abs();
    const balanceUsd = bigInt(balance).divide(bigInt(10).pow(22)).toJSNumber() / Math.pow(10, 8) * nanoPrice;

    const balanceNegative = bigInt(balance).lesserOrEquals(0);

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
                   formattingFn={val => val.toLocaleString('en-US', {minimumIntegerDigits: 8, useGrouping: false})}
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
        </Container>
    );
};

export default BalanceBanner;
