import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import React, { useEffect, useState } from 'react';

function useNationField({ form, initialData = { provinceId: null, districtId: null, wardId: null } }) {
    const [provincesOpts, setProvincesOpts] = useState([]);
    const [districtsOpts, setDistrictsOpts] = useState([]);
    const [wardsOpts, setWardsOpts] = useState([]);

    const { execute: executeGetNation, loading: getNationLoading } = useFetch(apiConfig.nation.autocomplete);

    const handleGetNation = (setOpts, id, parentId) => {
        executeGetNation({
            params: {
                id,
                parentId,
            },
            onCompleted: (res) => {
                setOpts(
                    res.data?.content?.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })),
                );
            },
        });
    };

    const handleGetProvinces = (id, clearChildOpts) => {
        handleGetNation(setProvincesOpts, id);
        if (clearChildOpts) {
            setDistrictsOpts([]);
            setWardsOpts([]);
        }
    };

    const handleGetWards = (id, parentId, clearChildOpts) => {
        handleGetNation(setWardsOpts, id, parentId);
        if (clearChildOpts) {
            setDistrictsOpts([]);
        }
    };

    const handleGetDistricts = (id, parentId) => {
        handleGetNation(setDistrictsOpts, id, parentId);
    };

    const baseFieldProps = {
        mappingOptions: (item) => ({
            label: item.name,
            value: item.id,
        }),
        apiConfig: apiConfig.nation.autocomplete,
        allowClear: false,
    };

    const provincesFieldProps = {
        ...baseFieldProps,
        searchParams: (text) => ({ name: text }),
        options: provincesOpts,
        onChange: (id) => {
            handleGetWards(null, id, true);
            form.setFieldsValue({
                districtId: undefined,
                wardId: undefined,
            });
        },
    };

    const wardsFieldProps = {
        ...baseFieldProps,
        options: wardsOpts,
        searchParams: (text) => ({ name: text, parentId: form.getFieldValue('provinceId') }),
        onChange: (id) => {
            handleGetDistricts(null, id);
            form.setFieldsValue({
                districtId: undefined,
            });
        },
    };

    const districtsFieldProps = {
        ...baseFieldProps,
        options: districtsOpts,
        searchParams: (text) => ({ name: text, parentId: form.getFieldValue('wardId') }),
    };

    useEffect(() => {
        handleGetProvinces(initialData?.provinceId);

        if (initialData?.wardId) {
            handleGetWards(initialData?.wardId, initialData?.provinceId);
        }
        if (initialData?.districtId) {
            handleGetDistricts(initialData?.districtId, initialData?.wardId);
        }
    }, [initialData]);

    return {
        provincesOpts,
        districtsOpts,
        wardsOpts,
        getNationLoading,
        handleGetProvinces,
        handleGetWards,
        handleGetDistricts,
        provincesFieldProps,
        wardsFieldProps,
        districtsFieldProps,
    };
}

export default useNationField;
