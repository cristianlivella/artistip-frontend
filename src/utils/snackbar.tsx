// Source: https://github.com/iamhosseindhv/notistack/issues/30#issuecomment-542863653

import React from 'react';

import { OptionsObject, useSnackbar, WithSnackbarProps } from 'notistack';

interface Props {
    setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void;
}

const InnerSnackbarUtilsConfigurator: React.FC<Props> = (props: Props) => {
    props.setUseSnackbarRef(useSnackbar());
    return null;
};

let useSnackbarRef: WithSnackbarProps;
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
    useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

const snackbar = {
    success(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'success' });
    },
    warning(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'warning' });
    },
    info(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'info' });
    },
    error(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'error' });
    },
    toast(msg: string, options: OptionsObject = {}) {
        useSnackbarRef.enqueueSnackbar(msg, options);
    }
};

export default snackbar;
