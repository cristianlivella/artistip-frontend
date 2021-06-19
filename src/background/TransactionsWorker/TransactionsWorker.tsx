import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStorageState } from 'react-storage-hooks';

import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import * as nanocurrency from 'nanocurrency';
import { pbkdf2 } from 'pbkdf2';

import api from '../../utils/api';
import CreateWalletModal from './components/CreateWalletModal/CreateWalletModal';
import PassworPromptModal from './components/PassworPromptModal/PassworPromptModal';
import { WalletInfo } from './types';

const TransactionsWorker = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [serverKey, setServerKey] = useState('');

    const [lsWalletKey, setLsWalletKey] = useStorageState<string | null>(localStorage, 'wallet_key', null);
    const [ssWalletKey, setSsWalletKey] = useStorageState<string | null>(sessionStorage, 'wallet_key', null);

    const walletKey = useMemo(() => {
        return lsWalletKey ?? ssWalletKey ?? '';
    }, [lsWalletKey, ssWalletKey]);

    const [createWalletModal, setCreateWalletModal] = useState(false);
    const [passworPromptModal, setPassworPromptModal] = useState(false);

    const walletAddress = useMemo(() => {
        return walletInfo ? walletInfo.address : null;
    }, [walletInfo]);

    const walletEncryptedSeed = useMemo(() => {
        return walletInfo ? walletInfo.seed : '';
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
        setIsLoading(true);
        api.request('/wallets/key').then(res => {
            setServerKey(res.data.key);
            updateWalletData();
        });
    }, [updateWalletData]);

    const decryptWalletLocal = useCallback((key?: string) => {
        try {
            const realKey = key ?? walletKey ?? '';
            const nanoSeed = AES.decrypt(realKey, serverKey).toString(Utf8);
            const nanoPrivateKey = nanocurrency.deriveSecretKey(nanoSeed, 0);
            const publicKey = nanocurrency.derivePublicKey(nanoPrivateKey);
            const address = nanocurrency.deriveAddress(publicKey, { useNanoPrefix: true });
            if (address === walletAddress) {
                return nanoPrivateKey.toString();
            }
            return false;
        } catch {
            return false;
        }
    }, [serverKey, walletAddress, walletKey]);

    const decryptWalletServer = useCallback((password: string) => {
        return new Promise<string>((resolve, reject) => {
            const encryptedObj = JSON.parse(atob(walletEncryptedSeed));
            if (encryptedObj.salt === undefined || encryptedObj.encryptedSeed === undefined) {
                reject();
            }
            const { encryptedSeed, salt } = encryptedObj;
            pbkdf2(password ?? '', salt, 10000000, 32, (_err, res) => {
                try {
                    const decryptedSeed = AES.decrypt(encryptedSeed, res.toString()).toString(Utf8);
                    const encryptedKey = AES.encrypt(decryptedSeed, serverKey);
                    const privateKey = decryptWalletLocal(encryptedKey.toString());
                    if (privateKey !== false) {
                        resolve(encryptedKey.toString());
                    }
                    reject();
                }
                catch {
                    reject();
                }
            });
        });

    }, [walletEncryptedSeed, serverKey]);

    useEffect(() => {
        fetchKeyAndData();

        const timer = setInterval(() => {
            updateWalletData();
        }, 10 * 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, [updateWalletData, fetchKeyAndData, walletKey]);

    useEffect(() => {
        if (isLoading) return;
        if (walletAddress === null) {
            setCreateWalletModal(true);
        }
        else {
            setCreateWalletModal(false);
            if (decryptWalletLocal() === false) {
                setPassworPromptModal(true);
            }
            else {
                setPassworPromptModal(false);
                // check and send transactions
            }
        }

    }, [isLoading, walletAddress, decryptWalletLocal]);

    return (
        <>
            <CreateWalletModal open={createWalletModal} serverKey={serverKey} setLsWalletKey={setLsWalletKey} setSsWalletKey={setSsWalletKey} />
            <PassworPromptModal open={passworPromptModal} serverKey={serverKey} setLsWalletKey={setLsWalletKey} setSsWalletKey={setSsWalletKey} decryptWalletServer={decryptWalletServer}/>
        </>
    );
};

export default TransactionsWorker;
