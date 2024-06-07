import React from 'react';
import { Tooltip } from 'antd';

export const BaseTooltip = ({
    placement = 'bottom',
    type,
    objectName = '',
    title,
    toLowerCase = true,
    children,
    ...props
}) => {
    if (toLowerCase) {
        objectName = objectName.toLowerCase();
    }
    const titleMapping = {
        edit: `Sửa ${objectName}`,
        delete: `Xoá ${objectName}`,
    };

    title = titleMapping[type] || title;
    return (
        <Tooltip placement={placement} title={title} {...props}>
            {children}
        </Tooltip>
    );
};
