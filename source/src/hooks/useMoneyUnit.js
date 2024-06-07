import { settingKeyName } from '@constants/masterData';
import { settingSystemSelector } from '@selectors/app';
import React from 'react';
import { useSelector } from 'react-redux';
const useMoneyUnit = () => {
    const settingSystem = useSelector(settingSystemSelector);
    const moneyUnit = settingSystem?.find((item) => item?.keyName === settingKeyName.MONEY_UNIT);
    return moneyUnit?.valueData;
};

export default useMoneyUnit;
