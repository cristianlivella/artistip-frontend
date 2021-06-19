import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useStorageState } from 'react-storage-hooks';

import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import * as nanocurrency from 'nanocurrency';
import { pbkdf2 } from 'pbkdf2';

import WalletAddressModal from '../../common/components/WalletAddressModal/WalletAddressModal';
import { ReduxState } from '../../redux/types';
import { setFromApi } from '../../redux/user/userSlice';
import api from '../../utils/api';
import CreateWalletModal from './components/CreateWalletModal/CreateWalletModal';
import PasswordPromptModal from './components/PasswordPromptModal/PasswordPromptModal';
import { WalletInfo } from './types';

const TransactionsWorker = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
    const [serverKey, setServerKey] = useState('');
    const [userWantsNewWallet, setUserWantsNewWallet] = useState(false);

    const reduxWalletAddress = useSelector((state: ReduxState) => state.user.wallet);

    const [lsWalletKey, setLsWalletKey] = useStorageState<string | null>(localStorage, 'wallet_key', null);
    const [ssWalletKey, setSsWalletKey] = useStorageState<string | null>(sessionStorage, 'wallet_key', null);

    const walletKey = useMemo(() => {
        return lsWalletKey ?? ssWalletKey ?? '';
    }, [lsWalletKey, ssWalletKey]);

    const [createWalletModal, setCreateWalletModal] = useState(false);
    const [passwordPromptModal, setPassworPromptModal] = useState(false);
    const [walletModal, setWalletModal] = useState(false);

    const [walletAddressForModal, setWalletAddressForModal] = useState('');

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
            pbkdf2(password ?? '', salt, 5000000, 32, (err, res) => {
                if (err) reject();
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

    }, [decryptWalletLocal, walletEncryptedSeed, serverKey]);

    const handleWalletGenerated = useCallback((address: string) => {
        setUserWantsNewWallet(false);
        setWalletAddressForModal(address);
        setWalletModal(true);
    }, []);

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
        if (walletAddress === null || userWantsNewWallet) {
            setCreateWalletModal(true);
            setPassworPromptModal(false);
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

    }, [isLoading, walletAddress, decryptWalletLocal, userWantsNewWallet]);

    useEffect(() => {
        if (!isLoading && walletAddress !== reduxWalletAddress) {
            api.request('/users/me', 'GET', null, false).then((res) => {
                const { data } = res;
                dispatch(setFromApi(data));
            });
        }
    }, [dispatch, walletAddress, reduxWalletAddress, isLoading]);

    return (
        <>
            <CreateWalletModal open={createWalletModal} serverKey={serverKey} isFirstWallet={walletAddress === null}
                                setLsWalletKey={setLsWalletKey} setSsWalletKey={setSsWalletKey}
                                onClose={() => setUserWantsNewWallet(false)} onWalletGenerated={handleWalletGenerated} />
            <PasswordPromptModal open={passwordPromptModal} setLsWalletKey={setLsWalletKey} setSsWalletKey={setSsWalletKey}
                                decryptWalletServer={decryptWalletServer} createNewWallet={() => setUserWantsNewWallet(true)} />
            <WalletAddressModal open={walletModal} onClose={() => setWalletModal(false)} address={walletAddressForModal} isWalletNew={true} />
        </>
    );
};

export default TransactionsWorker;
