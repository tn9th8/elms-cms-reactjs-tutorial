import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { SketchPicker } from 'react-color';

import styles from './index.module.scss';
import useFormField from '@hooks/useFormField';

const ColorPickerField = ({
    label,
    name,
    formItemProps,
    fieldProps,
    ...props
}) => {
    const { rules } = useFormField(props);

    return (
        <Form.Item
            label={label}
            name={name}
            validateFirst
            rules={rules}
            {...formItemProps}
        >
            <SketchPickerWrapper {...fieldProps} />
        </Form.Item>
    );
};

function SketchPickerWrapper({ value = '#fff', onChange, onOpen, onClose, width, height, ...props }) {
    const [ displayColorPicker, setDisplayColorPicker ] = useState(false);

    const onOpenPopover = () => {
        setDisplayColorPicker(true);
        onOpen?.();
    };

    const onChangeColor = (color) => {
        onChange?.(color.hex);
    };

    const onClosePopover = () => {
        setDisplayColorPicker(false);
        onClose?.();
    };

    return (
        <div className={styles.colorPicker}>
            <div className={styles.swatch} onClick={onOpenPopover}>
                <div 
                    style={{ width: width || '100%', height: height ?? 16, backgroundColor: value }} 
                    className={styles.color} 
                />
            </div>
            {displayColorPicker ? (
                <div className={styles.popover}>
                    <div className={styles.cover} onClick={onClosePopover} />
                    <SketchPicker {...props} color={value} onChange={onChangeColor} />
                </div>
            ) : null}
        </div>
    );
}

export default ColorPickerField;
