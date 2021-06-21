import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import snackbar from './snackbar';

type HttpMethod = 'GET' | 'POST' | 'PUT';

const API_HOST = process.env.REACT_APP_API_HOST ?? '';

const NODES = [
    'https://mynano.ninja/api/node',
    'https://vault.nanocrawler.cc/api/node-api',
    'https://nault.nanos.cc/proxy',
    'https://proxy.powernode.cc/proxy',
    'https://rainstorm.city/api',
    'https://node.somenano.com/proxy'
];

const WORK_NODES = [
    'https://mynano.ninja/api/node',
    'https://nault.nanos.cc/proxy',
    'https://proxy.powernode.cc/proxy',
    'https://rainstorm.city/api',
];

const apiRequest = (url: string = '', method: HttpMethod = 'GET', data: any = null) => {
    return new Promise((resolve: (value: any) => void, reject) => {
        data = data && snakecaseKeys(data);
        url = (method === 'GET' && data) ? (url + '?' + new URLSearchParams(data)) : url;
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(url.startsWith(API_HOST) && {'Authorization': 'Bearer ' + localStorage.getItem('access_token')})
            },
            ...(url.startsWith(API_HOST) && {credentials: 'include'}),
            ...(data && method !== 'GET' && {body: JSON.stringify(data)})
        }).then(res => {
            const { headers, status } = res;
            const afterJsonDecode = (status >= 200 && status <= 299) ? resolve : reject;
            res.json().then(json => {
                afterJsonDecode({
                    statusCode: status,
                    data: camelcaseKeys(json, { deep: true }),
                    requestId: headers.get('ARTISTIP-REQUEST-ID')
                });
            }).catch(() => {
                reject({
                    statusCode: status,
                    data: null,
                    requestId: headers.get('ARTISTIP-REQUEST-ID')
                });
            });
        }).catch(() => {
            snackbar.error('API request failed. Check your internet connession.');
        });
    });
};

const apiRequestWrapper = (url: string = '', method: HttpMethod = 'GET', requestData: any = null, showErrorSnackbar: boolean = true) => {
    return new Promise((resolve: (value: any) => void, reject) => {
        const requestStart = Date.now();
        apiRequest(API_HOST + url, method, requestData).then(res => {
            const { requestId, statusCode } = res;
            sendApiRequestFeedback(requestId, statusCode, Date.now() - requestStart);
            resolve(res);
        }).catch(res => {
            const { requestId, statusCode } = res;
            if (showErrorSnackbar) {
                snackbar.error('API request failed (error ' + statusCode + ')');
            }
            sendApiRequestFeedback(requestId, statusCode, Date.now() - requestStart);
            reject(res);
        });
    });
};

const nodeRequestWrapper = (host: string, action: string, requestData: any = null, showErrorSnackbar: boolean = true) =>  {
    return new Promise((resolve: (value: any) => void, reject) => {
        requestData = {
            action,
            ...requestData
        };
        const requestStart = Date.now();
        apiRequest(host, 'POST', requestData).then(res => {
            const { statusCode } = res;
            sendNodeRequestFeedback(host + '?action=' + action, statusCode, '', Date.now() - requestStart);
            resolve(res);
        }).catch(res => {
            const { data, statusCode } = res;
            if (showErrorSnackbar) {
                snackbar.error('Node request failed (error ' + statusCode + ')');
            }
            sendNodeRequestFeedback(host + '?action=' + action, statusCode, JSON.stringify(data), Date.now() - requestStart);
            reject(res);
        });
    });
};

const sendApiRequestFeedback = (requestId: string, statusCode: number, time: number) => {
    const data = {
        type: 'api',
        id: requestId,
        statusCode,
        time
    };
    fetch(API_HOST + '/performance-monitor', {
        method: 'POST',
        body: JSON.stringify(snakecaseKeys(data))
    }).catch(() => undefined);
};

const sendNodeRequestFeedback = (url: string, statusCode: number, errorBody: string, time: number) => {
    const data = {
        type: 'node',
        url,
        statusCode,
        errorBody,
        time
    };
    fetch(API_HOST + '/performance-monitor', {
        method: 'POST',
        body: JSON.stringify(snakecaseKeys(data))
    }).catch(() => undefined);
};

const api = {
    nodes: NODES,
    workNodes: WORK_NODES,
    request: apiRequestWrapper,
    nodeRequest: nodeRequestWrapper
};

export default api;
