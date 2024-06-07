import { Button, Col, Modal, Row } from 'antd';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import styles from './ActionBar.module.scss';
import HasPermission from './HasPermission';
//import HasPermission from './HasPermission';

const message = defineMessages({
    create: {
        id: 'components.common.elements.actionBar.create',
        defaultMessage: 'Add new',
    },
    bulkDelete: {
        title: {
            id: 'components.common.elements.actionBar.bulkDelete.title',
            defaultMessage: 'Are you sure you want to delete selected {objectName}?',
        },
        okText: {
            id: 'components.common.elements.actionBar.bulkDelete.okText',
            defaultMessage: 'Yes',
        },
        noText: {
            id: 'components.common.elements.actionBar.bulkDelete.noText',
            defaultMessage: 'No',
        },
    },
});

function ActionBar({
    createLink,
    createPermission,
    selectedRows = [],
    onBulkDelete,
    objectName,
    location,
    type,
    style,
}) {
    const intl = useIntl();
    const onBulkDeleteButtonClick = () => {
        Modal.confirm({
            title: intl.formatMessage(message.bulkDelete.title, { objectName }),
            centered: true,
            okText: intl.formatMessage(message.bulkDelete.okText),
            okType: 'danger',
            cancelText: intl.formatMessage(message.bulkDelete.noText),
            onOk: () => {
                onBulkDelete();
            },
        });
    };

    return (
        <Row wrap justify="space-between" className={styles.actionBar}>
            <Col>
                {selectedRows.length > 0 && (
                    <HasPermission>
                        <Button icon={<DeleteOutlined />} onClick={onBulkDeleteButtonClick}>
                            Delete selected ({selectedRows.length})
                        </Button>
                    </HasPermission>
                )}
            </Col>
            <Col>
                <Link to={createLink} state={{ action: 'create', prevPath: location.pathname }}>
                    <HasPermission requiredPermissions={createPermission}>
                        <Button type="primary" style={style}>
                            <PlusOutlined /> {intl.formatMessage(message.create, { objectName })}
                        </Button>
                    </HasPermission>
                </Link>
            </Col>
        </Row>
    );
}

export default ActionBar;
