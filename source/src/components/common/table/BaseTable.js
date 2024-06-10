import React from 'react';
import { Table } from 'antd';

import styles from './BaseTable.module.scss';
import classNames from 'classnames';

const BaseTable = ({
    dataSource,
    className,
    onChange,
    rowSelection,
    columns = [],
    loading,
    pagination,
    rowKey = (record) => record.id,
    components,
    ...props
}) => (
    <Table
        onChange={onChange}
        scroll={{ x: true }}
        columns={columns.filter(Boolean)}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey.id}
        components={components}
        rowSelection={rowSelection}
        rowHoverable={false}
        // scroll={{ x: 'max-content' }}
        {...props}
        className={classNames(styles.baseTable, className)}
        pagination={pagination ? { ...pagination, showSizeChanger: false, hideOnSinglePage: true } : false}
    />
);

export default BaseTable;
