import React from 'react';

import { Form, Checkbox } from 'antd';

import useFormField from '@hooks/useFormField';

function CheckboxField({
    label,
    name,
    required,
    labelAlign,
    optionLabel,
    onChange,
    formItemProps,
    fieldProps,
    ...props
}) {
    const { rules } = useFormField(props);

    return (
        <Form.Item
            {...formItemProps}
            labelAlign={labelAlign}
            required={required}
            label={label}
            name={name}
            rules={rules}
            // valuePropName="checked"
            {...props}
        >
            <Checkbox {...fieldProps} onChange={onChange} {...props}>
                {optionLabel}
            </Checkbox>
        </Form.Item>
    );
}

export default CheckboxField;
