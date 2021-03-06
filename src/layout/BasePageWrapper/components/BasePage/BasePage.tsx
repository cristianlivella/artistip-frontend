import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ServerInfoPolling from '../../../../background/ServerInfoPolling/ServerInfoPolling';
import TransactionsWorker from '../../../../background/TransactionsWorker/TransactionsWorker';
import UserInfoPolling from '../../../../background/UserInfoPolling/UserInfoPolling';
import CustomLoader from '../../../../common/components/CustomLoader/CustomLoader';
import { ReduxState } from '../../../../redux/types';
import { clear, setFromApi } from '../../../../redux/user/userSlice';
import api from '../../../../utils/api';
import InternalBasePage from '../InternalBasePage/InternalBasePage';
import ExternalRouter from '../routing/ExternalRouter';

const BasePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const userInfo = useSelector((state: ReduxState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        api.request('/users/me', 'GET', null, false).then((res) => {
            const { data } = res;
            dispatch(setFromApi(data));
            setIsLoading(false);
        }).catch(() => {
            dispatch(clear());
            setIsLoading(false);
        });
    }, [dispatch]);

    if (isLoading) {
        return (
            <CustomLoader />
        );
    }

    if (userInfo.id === null) {
        return <ExternalRouter />;
    }

    return (
        <>
            <InternalBasePage />
            <UserInfoPolling />
            <ServerInfoPolling />
            <TransactionsWorker />
        </>
    );
};

export default BasePage;
