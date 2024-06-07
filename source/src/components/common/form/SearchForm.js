import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { FieldTypes } from '@constants/formConfig';
import { Button, Col, Form, Row } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import DatePickerField from './DatePickerField';
import DateRangePickerField from './DateRangePickerField';
import InputTextField from './InputTextField';
import SelectField from './SelectField';

import dayjs from 'dayjs';
import AutoCompleteField from './AutoCompleteField';
import styles from './SearchForm.module.scss';
import { isObject } from 'lodash';
// import InputPhoneField from './InputPhoneField';

const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
};

const searchFields = {
    [FieldTypes.SELECT]: SelectField,
    [FieldTypes.DATE]: DatePickerField,
    [FieldTypes.DATE_RANGE]: (props) => <DateRangePickerField disabledDate={disabledDate} {...props} />,
    [FieldTypes.AUTOCOMPLETE]: AutoCompleteField,
    // [FieldTypes.PHONE]: InputPhoneField,
    default: InputTextField,
};

const message = defineMessages({
    search: 'Tìm kiếm',
    clear: 'Xóa',
});

function SearchForm({
    fields = [],
    hiddenAction,
    onSearch,
    className,
    onReset,
    initialValues,
    width = 1100,
    alignSearchField,
    getFormInstance,
    searchParams,
}) {
    const [form] = Form.useForm();
    const intl = useIntl();
    const dateRangeKey = useRef({});

    const handleSearchSubmit = useCallback(
        (values) => {
            
            onSearch?.({ ...searchParams, ...values });
        },
        [form, onSearch],
    );

    const handleClearSearch = () => {
        form.resetFields();
        onReset?.();
    };

    const renderField = useCallback(
        ({ type, submitOnChanged, onChange, key, renderItem, style, component, ...props }) => {
            if (renderItem) {
                return (
                    <Form.Item {...props} name={key} style={{ marginBottom: '0px' }}>
                        {renderItem()}
                    </Form.Item>
                );
            }

            const Field = component || searchFields[type] || searchFields.default;
            return (
                <Field
                    {...props}
                    name={key}
                    fieldProps={{
                        style: { ...style, width: '100%', height: 32 },
                    }}
                    style={{ ...style, width: '100%', height: 32 }}
                    onChange={(e) => {
                        if (submitOnChanged) {
                            form.submit();
                        } else {
                            onChange?.(e);
                        }
                    }}
                />
            );
        },
        [handleSearchSubmit],
    );

    useEffect(() => {
        getFormInstance?.(form);
    }, [form]);

    useEffect(() => {
      
        const normalizeValues = { ...initialValues };
        
        Object.keys(normalizeValues).forEach((key) => {
          
            if (!isNaN(normalizeValues[key]) && !isObject(normalizeValues[key])) {
                normalizeValues[key] = Number(normalizeValues[key]);
            }
        });
        form.setFieldsValue(normalizeValues);
     
    }, [initialValues]);

    return (
        <Form form={form} layout="horizontal" className={className || styles.searchForm} onFinish={handleSearchSubmit}>
            <Row align={alignSearchField} gutter={10} style={{ maxWidth: width }}>
                {fields.map((field) => {
                    const { key, colSpan, className, ...props } = field;
                    return (
                        <Col key={key} span={colSpan || 3} className={className}>
                            {renderField({ ...props, key })}
                        </Col>
                    );
                })}
                {!hiddenAction && fields.length > 0 && (
                    <Col>
                        <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                            {intl.formatMessage(message.search)}
                        </Button>
                        <Button style={{ marginLeft: 8 }} icon={<ClearOutlined />} onClick={handleClearSearch}>
                            {intl.formatMessage(message.clear)}
                        </Button>
                    </Col>
                )}
            </Row>
        </Form>
    );
}

export default SearchForm;
