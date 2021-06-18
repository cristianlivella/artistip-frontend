import { useCallback, useEffect, useMemo, useState } from 'react';

import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import * as nanocurrency from 'nanocurrency';

import api from '../../utils/api';
import CreateWalletModal from './components/CreateWalletModal/CreateWalletModal';
import { WalletInfo } from './types';

const TransactionsWorker = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [serverKey, setServerKey] = useState('');
    const [walletKey, setWalletKey] = useState(sessionStorage.getItem('wallet_key') ?? localStorage.getItem('wallet_key'));

    const [createWalletModal, setCreateWalletModal] = useState(false);
    const [passwordModal, setPassworPromptModal] = useState(false);

    const walletAddress = useMemo(() => {
        return walletInfo ? walletInfo.address : null;
    }, [walletInfo]);

    const updateWalletData = useCallback(() => {
        api.request('/wallets/current').then(res => {
            if (Object.keys(res.data).length !== 0) {
                setWalletInfo(res.data);
            }
            setIsLoading(false);
        });
    }, []);

    const fetchKeyAndData = useCallback(() => {
        api.request('/wallets/key').then(res => {
            setServerKey(res.data.key);
            updateWalletData();
        });
    }, [updateWalletData]);

    const decryptWalletLocal = useCallback(() => {
        try {
            const nanoPrivateKey = AES.decrypt(walletKey ?? '', serverKey);
            const publicKey = nanocurrency.derivePublicKey(nanoPrivateKey.toString(Utf8));
            const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
            if (address === walletAddress) {
                return nanoPrivateKey;
            }
            return false;
        } catch {
            return false;
        }
    }, [serverKey, walletAddress, walletKey]);

    const tryDecryptWalletFromServer = useCallback((info, password) => {
        return new Promise((resolve, reject) => {
            const encryptedObj = JSON.parse(atob(info));
            if (encryptedObj.salt === undefined || encryptedObj.encryptedSeed === undefined) {
                reject();
            }

        });

    }, []);

    useEffect(() => {
        if (walletInfo === null) {
            fetchKeyAndData();
        }

        const timer = setInterval(() => {
            updateWalletData();
        }, 10 * 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [updateWalletData, walletInfo, fetchKeyAndData]);

    useEffect(() => {
        if (isLoading) return;
        if (walletAddress === null) {
            setCreateWalletModal(true);
        }
        else {
            if (decryptWalletLocal() === false) {
                setPassworPromptModal(true);
            }
            else {
                // check and send transactions
            }
        }

    }, [isLoading, walletAddress, decryptWalletLocal]);

    return (
        <>
            <CreateWalletModal open={createWalletModal} />
        </>
    );
};

export default TransactionsWorker;
