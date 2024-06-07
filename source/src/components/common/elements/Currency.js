import { CurrentcyPositions } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { selectCurrency } from '@selectors/currency';
import { setCurrency } from '@store/actions/currency';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Currency({ asChild = false, value, isPoint, ...props }) {
    const { format } = useCurrency(isPoint);

    return asChild ? format(value) : <div {...props}>{format(value)}</div>;
}

export function useCurrency(isPoint = false) {
    const currency = useSelector(selectCurrency);
    const dispatch = useDispatch();
    const format = useCallback(
        (value, symbol, symbolPosition, decimal, separator, decimalRound, currencyRatio) => {
            const format = isPoint ? formatPoint : formatCurrency;
            return format(
                value,
                decimal != undefined ? decimal : currency.decimal,
                currency.separator,
                symbol != undefined ? symbol : currency.symbol,
                (symbolPosition = currency.position),
                decimalRound != undefined ? decimalRound : currency.decimalRound,
                currency.currencyRatio,
            );
        },
        [currency],
    );

    // const { execute } = useFetch(apiConfig.restaurant.getById);
    // const fetchCurrency = useCallback(
    //     ({ pathParams }) => {
    //         execute({
    //             // params,
    //             pathParams,
    //             onCompleted: ({ data }) => {
    //                 const content = JSON.parse(data?.settings || {});
    //                 if (!content) return {};
    //                 let symbol = content.currentcy,
    //                     decimal = content.decimal_separator,
    //                     separator = content.group_separator,
    //                     position = content.currentcy_position,
    //                     currencyRatio = content.currency_ratio,
    //                     dateFormat = content.date_time_format,
    //                     decimalRound = content.decimal_round;

    //                 dispatch(
    //                     setCurrency({ symbol, decimal, separator, position, dateFormat, decimalRound, currencyRatio }),
    //                 );
    //             },
    //         });
    //     },
    //     [currency],
    // );

    return {
        // fetchCurrency,
        format,
        symbol: currency.symbol,
        decimal: currency.decimal,
        separator: currency.separator,
    };
}

export function formatCurrency(
    value,
    decimal = '.',
    separator = ',',
    symbol = '',
    symbolPosition,
    decimalRound = 2,
    currencyRatio = 1,
) {
    if (!value) return '';
    const [integerPart, decimalPart] = (value / currencyRatio).toFixed(decimalRound).toString().split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    const formattedNumber = decimalPart ? `${formattedIntegerPart}${decimal}${decimalPart}` : formattedIntegerPart;

    if (!symbol) return formattedNumber;

    return symbolPosition === CurrentcyPositions.BACK ? `${formattedNumber} ${symbol}` : `${symbol} ${formattedNumber}`;
}

export function formatPoint(value, decimal = '.', separator = ',', symbol = '', symbolPosition) {
    if (!value) return '';

    const [integerPart, decimalPart] = value.toString().split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    const formattedNumber = decimalPart ? `${formattedIntegerPart}${decimal}${decimalPart}` : formattedIntegerPart;

    return formattedNumber;
}

export default Currency;