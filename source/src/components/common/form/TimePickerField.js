import { Form, TimePicker } from 'antd';
import React from 'react';
import useFormField from '@hooks/useFormField';
import { TIME_FORMAT_DISPLAY } from '@constants';
const TimePickerField = (props) => {
    const {
        width,
        size,
        format,
        label,
        name,
        disabled,
        disabledMinutes,
        disabledHours,
        onSelect,
        onChange,
        validateTrigger,
        style,
    } = props;

    const timeFormat = format || TIME_FORMAT_DISPLAY;

    const { rules, placeholder } = useFormField(props);

    return (
        <Form.Item style={style} shouldUpdate label={label} name={name} rules={rules} validateTrigger={validateTrigger}>
            <TimePicker
                placeholder={placeholder}
                onSelect={onSelect}
                size={size}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
                style={{ width: width || '60%' }}
                format={timeFormat}
                disabled={disabled}
                onChange={onChange}
                {...props}
                // hideDisabledOptions={true}
            />
        </Form.Item>
    );
};

export default TimePickerField;
