import { useEffect } from 'react';

import api from '../../../utils/api';

interface Props {
    service: 'google' | 'spotify';
}

const RedirectToLoginPage = (props: Props) => {
    const { service } = props;

    useEffect(() => {
        const apiUrl = '/auth/login/' + service;
        api.request(apiUrl).then(res => {
            window.location.href = res.data.url;
        });
    }, [service]);

    return null;
};

export default RedirectToLoginPage;
