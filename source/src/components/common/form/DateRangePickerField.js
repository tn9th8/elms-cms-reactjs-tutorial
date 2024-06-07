import React from 'react';

import { Form, DatePicker } from 'antd';
import { DATE_SHORT_MONTH_FORMAT } from '@constants';
import useFormField from '@hooks/useFormField';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';

const { RangePicker } = DatePicker;

function DateRangePickerField({
    size,
    format = DATE_SHORT_MONTH_FORMAT,
    label,
    name,
    disabled,
    disabledDate,
    onCalendarChange,
    onChange,
    allowClear = true,
    formItemProps,
    fieldProps,
    onOpenChange,
    ref,
    placeholder,
    ...props
}) {
    const { rules } = useFormField(props);
    const translate = useTranslate();
    return (
        <Form.Item {...formItemProps} label={label} name={name} rules={rules} {...props}>
            <RangePicker
                size={size}
                disabledDate={disabledDate}
                allowClear={allowClear}
                style={{ ...fieldProps?.style }}
                format={format}
                disabled={disabled}
                onChange={onChange}
                onCalendarChange={onCalendarChange}
                onOpenChange={onOpenChange}
                ref={ref}
                placeholder={
                    placeholder || [
                        translate.formatMessage(commonMessage.fromDate),
                        translate.formatMessage(commonMessage.toDate),
                    ]
                }
            />
        </Form.Item>
    );
}

export default DateRangePickerField;
