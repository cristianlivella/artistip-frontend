import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setFromApi } from '../../redux/user/userSlice';
import api from '../../utils/api';

const UserInfoPolling = () => {
    const dispatch = useDispatch();

    const updateUserInfo = useCallback(() => {
        api.request('/users/me', 'GET', null, false).then((res) => {
            const { data } = res;
            dispatch(setFromApi(data));
        });
    }, [dispatch]);

    useEffect(() => {
        updateUserInfo();

        const interval = setInterval(() => {
            updateUserInfo();
        }, 5   * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [updateUserInfo]);

    return null;
};

export default UserInfoPolling;
