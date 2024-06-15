import React, { useEffect, useMemo, useState } from 'react';
import useQueryParams from './useQueryParams';
import {
    commonStatus,
    commonStatusColor,
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_TABLE_PAGE_START,
    STATUS_INACTIVE,
    storageKeys,
} from '@constants';

import { Modal, Button, Divider, Tag } from 'antd';
import { DeleteOutlined, LockOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';

import { defineMessages, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ActionBar from '@components/common/elements/ActionBar';
import useFetch from './useFetch';
import useNotification from './useNotification';
import SearchForm from '@components/common/form/SearchForm';
import HasPermission from '@components/common/elements/HasPermission';
import useAuth from './useAuth';
import { validatePermission } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { getData } from '@utils/localStorage';

const message = defineMessages({
    deleteConfirm: {
        title: {
            id: 'hook.useListBase.deleteConfirm.title',
            defaultMessage: 'Bạn có chắc chắn muốn xóa {objectName} này không?',
        },
        ok: {
            id: 'hook.useListBase.deleteConfirm.ok',
            defaultMessage: 'Có',
        },
        cancel: {
            id: 'hook.useListBase.deleteConfirm.cancel',
            defaultMessage: 'Không',
        },
    },
    changeStatusConfirm: {
        title: {
            id: 'hook.useListBase.deleteConfirm.title',
            defaultMessage: 'Bạn có chắc chắn muốn khóa {objectName} này không?',
        },
        ok: {
            id: 'hook.useListBase.deleteConfirm.ok',
            defaultMessage: 'Có',
        },
        cancel: {
            id: 'hook.useListBase.deleteConfirm.cancel',
            defaultMessage: 'Không',
        },
    },
    tableColumn: {
        action: {
            id: 'hook.useListBase.tableColumn.action',
            defaultMessage: 'Hành động',
        },
        status: {
            title: {
                id: 'hook.useListBase.tableColumn.status.title',
                defaultMessage: 'Trạng thái',
            },
            [commonStatus.ACTIVE]: {
                id: 'hook.useListBase.tableColumn.status.active',
                defaultMessage: 'Hoạt động',
            },
            [commonStatus.PENDING]: {
                id: 'hook.useListBase.tableColumn.status.pending',
                defaultMessage: 'Đang chờ',
            },
            [commonStatus.INACTIVE]: {
                id: 'hook.useListBase.tableColumn.status.lock',
                defaultMessage: 'Khóa',
            },
        },
    },
    notification: {
        deleteSuccess: {
            id: 'hook.useListBase.notification.deleteSuccess',
            defaultMessage: 'Xóa {objectName} thành công',
        },
    },
});

const useListBase = ({
    apiConfig = {
        getList: null,
        delete: null,
        create: null,
        update: null,
        getById: null,
        changeStatus: null,
    },
    options = {
        objectName: '',
        pageSize: DEFAULT_TABLE_ITEM_SIZE,
    },
    tabOptions = {
        queryPage: {},
        isTab: false,
    },
    isProjectToken = false,
    override,
} = {}) => {
    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const [data, setData] = useState(0);
    const [loading, setLoading] = useState(false);
    const userTokenProject = getData(storageKeys.USER_PROJECT_ACCESS_TOKEN);
    const { execute: executeGetList } = useFetch(
        isProjectToken
            ? { ...apiConfig.getList, authorization: `Bearer ${userTokenProject}` }
            : { ...apiConfig.getList },
    );
    const { execute: executeDelete } = useFetch(
        isProjectToken ? { ...apiConfig.delete, authorization: `Bearer ${userTokenProject}` } : { ...apiConfig.delete },
    );
    const { execute: executeChangeStatus } = useFetch(
        isProjectToken
            ? { ...apiConfig.changeStatus, authorization: `Bearer ${userTokenProject}` }
            : { ...apiConfig.changeStatus },
    );
    const [currentPageTab, setCurrentPageTab] = useState(0);
    const [pagination, setPagination] = useState({
        pageSize: options.pageSize,
        total: 0,
        current: 1,
    });
    const notification = useNotification();
    const { pathname: pagePath } = useLocation();
    const { permissions } = useAuth();
    const navigate = useNavigate();
    const intl = useIntl();

    const queryFilter = useMemo(() => deserializeParams(queryParams), [queryParams]);

    const hasPermission = (requiredPermissions) => {
        return validatePermission(requiredPermissions, permissions);
    };

    const mappingData = (response) => {
        return {
            data: response.data.content,
            total: response.data.totalElements,
        };
    };

    const handleGetListError = (error) => {
        console.log(error);
        if (error?.response?.data?.code == '[Ex2]: Access is denied') {
            notification({ type: 'error', message: 'Access is denied' });
        } else {
            notification({ type: 'error', message: 'Lỗi' });
        }
    };

    const onCompletedGetList = (response) => {
        const { data, total } = mixinFuncs.mappingData(response);

        setData(data);
        setPagination((p) => ({ ...p, total }));
    };

    const prepareGetListPathParams = () => {
        return {};
    };

    const handleFetchList = (params) => {
        if (!apiConfig.getList) throw new Error('apiConfig.getList is not defined');
        setLoading(true);
        executeGetList({
            pathParams: mixinFuncs.prepareGetListPathParams(),
            params,
            onCompleted: (response) => {
                mixinFuncs.onCompletedGetList(response);
                setLoading(false);
            },
            onError: (error) => {
                mixinFuncs.handleGetListError(error);
                setLoading(false);
            },
        });
    };

    const prepareGetListParams = (filter) => {
        let copyFilter = { ...filter };
        let page = parseInt(queryParams.get('page'));
        if (tabOptions.isTab) {
            copyFilter = { ...filter, ...options.queryPage };
            page = parseInt(currentPageTab);
        }

        copyFilter.page = page > 0 ? page - 1 : DEFAULT_TABLE_PAGE_START;

        copyFilter.size = options.pageSize;
        return copyFilter;
    };

    const getList = (filter) => {
        let params = mixinFuncs.prepareGetListParams(queryFilter);
        if (tabOptions.isTab) {
            params = mixinFuncs.prepareGetListParams({ ...tabOptions.queryPage, ...filter });
        }
        mixinFuncs.handleFetchList({ ...params });
    };

    const changeFilter = (filter) => {
        if (tabOptions.isTab) {
            mixinFuncs.getList(filter);
        } else {
            setQueryParams(serializeParams(filter));
        }
    };

    function changePagination(page) {
        if (tabOptions.isTab) {
            setCurrentPageTab(page.current);
        } else {
            queryParams.set('page', page.current);
            setQueryParams(queryParams);
        }
    }

    const handleDeleteItemError = (error) => {
        notification({ type: 'error', message: error.message || `Delete ${options.objectName} failed` });
    };

    const onDeleteItemCompleted = (id) => {
        let currentPage = queryParams.get('page');
        if (tabOptions.isTab) {
            currentPage = currentPageTab;
        }
        if (data.length === 1 && currentPage > 1) {
            if (tabOptions.isTab.isTab) {
                setCurrentPageTab(currentPage - 1);
            } else {
                queryParams.set('page', currentPage - 1);
                setQueryParams(queryParams);
            }
        } else {
            mixinFuncs.getList();
            // setData((data) => data.filter((item) => item.id !== id));
        }
    };

    const handleDeleteItem = (id) => {
        setLoading(true);
        executeDelete({
            pathParams: { id },
            onCompleted: (response) => {
                mixinFuncs.onDeleteItemCompleted(id);

                notification({
                    message: intl.formatMessage(message.notification.deleteSuccess, {
                        objectName: options.objectName,
                    }),
                });
            },
            onError: (error) => {
                mixinFuncs.handleDeleteItemError(error);
                setLoading(false);
            },
        });
    };

    const showDeleteItemConfirm = (id) => {
        if (!apiConfig.delete) throw new Error('apiConfig.delete is not defined');

        Modal.confirm({
            title: intl.formatMessage(message.deleteConfirm.title, { objectName: options.objectName }),
            content: '',
            okText: intl.formatMessage(message.deleteConfirm.ok),
            cancelText: intl.formatMessage(message.deleteConfirm.cancel),
            onOk: () => {
                mixinFuncs.handleDeleteItem(id);
            },
        });
    };

    const handleChangeStatusError = (error) => {
        notification({ type: 'error', message: error.message });
    };

    // This function is currently not needed
    const handleChangeStatus = (id, status) => {
        executeChangeStatus({
            apiConfig: apiConfig.changeStatus,
            data: { status: STATUS_INACTIVE, id },
            onCompleted: (response) => {
                mixinFuncs.getList();
            },
            onError: mixinFuncs.handleChangeStatusError,
        });
    };

    const showChangeStatusConfirm = (id, status) => {
        if (!apiConfig.changeStatus) throw new Error('apiConfig.changeStatus is not defined');

        Modal.confirm({
            title: intl.formatMessage(message.changeStatusConfirm.title, { objectName: options.objectName }),
            content: '',
            okText: intl.formatMessage(message.changeStatusConfirm.ok),
            cancelText: intl.formatMessage(message.changeStatusConfirm.cancel),
            onOk: () => {
                mixinFuncs.handleChangeStatus(id, status);
            },
        });
    };

    const additionalActionColumnButtons = () => {
        return {};
    };

    const actionColumnButtons = (additionalButtons = {}) => ({
        delete: ({ id, buttonProps }) => {
            if (!isProjectToken && !mixinFuncs.hasPermission(apiConfig.delete?.baseURL)) return null;

            return (
                <BaseTooltip type="delete" objectName={options.objectName}>
                    <Button
                        {...buttonProps}
                        type="link"
                        onClick={(e) => {
                            e.stopPropagation();
                            mixinFuncs.showDeleteItemConfirm(id);
                        }}
                        style={{ padding: 0 }}
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Button>
                </BaseTooltip>
            );
        },
        changeStatus: ({ id, status, buttonProps }) => {
            return (
                <Button
                    {...buttonProps}
                    type="link"
                    onClick={(e) => {
                        e.stopPropagation();
                        mixinFuncs.showChangeStatusConfirm(id, !status);
                    }}
                    style={{ padding: 0 }}
                >
                    {status === commonStatus.ACTIVE ? <LockOutlined /> : <CheckOutlined />}
                </Button>
            );
        },
        edit: ({ buttonProps, ...dataRow }) => {
            if (!isProjectToken && !mixinFuncs.hasPermission([apiConfig.update?.baseURL, apiConfig.getById?.baseURL]))
                return null;

            return (
                <BaseTooltip type="edit" objectName={options.objectName}>
                    <Button
                        {...buttonProps}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(mixinFuncs.getItemDetailLink(dataRow), {
                                state: { action: 'edit', prevPath: location.pathname },
                            });
                        }}
                        type="link"
                        style={{ padding: 0 }}
                    >
                        <EditOutlined color="red" />
                    </Button>
                </BaseTooltip>
            );
        },
        ...additionalButtons,
    });

    const createActionColumnButtons = (actions, data) => {
        const actionButtons = [];
        const buttons = mixinFuncs.actionColumnButtons(mixinFuncs.additionalActionColumnButtons());

        Object.entries(actions).forEach(([key, value]) => {
            let _value = value;
            if (typeof value === 'function') {
                _value = value(data);
            }
            if (_value && buttons[key]) {
                actionButtons.push(buttons[key]);
            }
        });

        return actionButtons;
    };

    const checkPermission = (actions) => {
        let isShow = false;
        Object.entries(actions).forEach(([type, value]) => {
            if (value || value?.show) {
                switch (type) {
                                case 'delete':
                                    if (isProjectToken) {
                                        isShow = true;
                                    } else mixinFuncs.hasPermission([apiConfig.delete?.baseURL]);
                                    {
                                        isShow = true;
                                    }
                                    break;

                                case 'edit':
                                    if (isProjectToken) {
                                        isShow = true;
                                    } else mixinFuncs.hasPermission([apiConfig.update?.baseURL, apiConfig.getById?.baseURL]);
                                    {
                                        isShow = true;
                                    }

                                    break;
                                default:
                                    // if (mixinFuncs.hasPermission(value?.permissions)) isShow = true;
                                    isShow = true;
                                    break;
                }
                return;
            }
        });
        return isShow;
    };

    const renderActionColumn = (
        action = { edit: false, delete: false, changeStatus: false },
        columnsProps,
        buttonProps,
    ) => {
        const isRender = checkPermission(action);
        if (!isRender) return;
        return {
            align: 'center',
            title: intl.formatMessage(message.tableColumn.action),
            ...columnsProps,
            render: (data) => {
                const buttons = [];
                const actionButtons = mixinFuncs.createActionColumnButtons(action, data);
                actionButtons.forEach((ActionItem, index) => {
                    if (ActionItem({ ...data, ...buttonProps })) {
                        buttons.push(ActionItem);
                    }
                });

                return (
                    <span>
                        {buttons.map((ActionItem, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <Divider type="vertical" />}
                                <span>
                                    {ActionItem({ ...data, ...buttonProps }) ? (
                                        <ActionItem {...data} {...buttonProps} />
                                    ) : null}
                                </span>
                            </React.Fragment>
                        ))}
                    </span>
                );
            },
        };
    };

    const renderIdColumn = (columnsProps) => ({
        title: 'ID',
        dataIndex: 'id',
        width: '50px',
        align: 'left',
        ...columnsProps,
    });

    const renderStatusColumn = (columnsProps) => {
        return {
            title: intl.formatMessage(message.tableColumn.status.title),
            dataIndex: 'status',
            align: 'center',
            ...columnsProps,
            render: (status) => (
                <Tag color={commonStatusColor[status]}>
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {intl.formatMessage(message.tableColumn.status[status])}
                    </div>
                </Tag>
            ),
        };
    };

    const getItemDetailLink = (dataRow) => {
        return `${pagePath}/${dataRow.id}`;
    };

    const getCreateLink = () => {
        return `${pagePath}/create`;
    };

    const renderActionBar = ({ type, style, onBulkDelete, selectedRows = [] } = {}) => {
        return (
            <ActionBar
                createPermission={!isProjectToken && apiConfig.create?.baseURL}
                selectedRows={selectedRows}
                onBulkDelete={onBulkDelete}
                objectName={options.objectName}
                createLink={mixinFuncs.getCreateLink()}
                location={location}
                type={type}
                style={style}
            />
        );
    };

    const handleFilterSearchChange = (values) => {
        mixinFuncs.changeFilter(values);
    };

    const renderSearchForm = ({
        fields = [],
        getFormInstance,
        hiddenAction,
        className,
        initialValues,
        onSearch,
        onReset,
        alignSearchField = 'left',
        activeTab,
    }) => {
        return (
            <SearchForm
                activeTab={activeTab}
                getFormInstance={getFormInstance}
                alignSearchField={alignSearchField}
                fields={fields}
                initialValues={initialValues}
                onSearch={(values) => {
                    mixinFuncs.handleFilterSearchChange(values);
                    onSearch?.(values);
                }}
                hiddenAction={hiddenAction}
                className={className}
                onReset={() => {
                    mixinFuncs.changeFilter({});
                    onReset?.();
                }}
            />
        );
    };

    const filterLanguage = (dataRow = []) => {
        let renderItem;
        dataRow.filter((item) => {
            if (item.languageId === '1') renderItem = item;
        });
        return renderItem || {};
    };

    const overrideHandler = () => {
        const centralizedHandler = {
            hasPermission,
            mappingData,
            handleGetListError,
            handleFetchList,
            prepareGetListParams,
            getList,
            changeFilter,
            showDeleteItemConfirm,
            handleDeleteItem,
            handleDeleteItemError,
            createActionColumnButtons,
            showChangeStatusConfirm,
            handleChangeStatus,
            handleChangeStatusError,
            renderActionColumn,
            renderIdColumn,
            getItemDetailLink,
            getCreateLink,
            renderStatusColumn,
            changePagination,
            additionalActionColumnButtons,
            renderActionBar,
            onCompletedGetList,
            onDeleteItemCompleted,
            filterLanguage,
            renderSearchForm,
            handleFilterSearchChange,
            prepareGetListPathParams,
            actionColumnButtons,
            setQueryParams,
        };

        override?.(centralizedHandler);

        return centralizedHandler;
    };

    const mixinFuncs = overrideHandler();

    useEffect(() => {
        mixinFuncs.getList();

        let page = parseInt(queryFilter.page);
        if (tabOptions) {
            page = parseInt(currentPageTab);
        }
        if (page > 0 && page !== pagination.current) {
            setPagination((p) => ({ ...p, current: page }));
        } else if (page < 1) {
            setPagination((p) => ({ ...p, current: 1 }));
        }
    }, [queryParams, pagePath, currentPageTab]);

    return {
        loading,
        data,
        setData,
        queryFilter,
        actionColumnButtons,
        changeFilter,
        changePagination,
        pagination,
        mixinFuncs,
        getList,
        setLoading,
        pagePath,
        serializeParams,
        queryParams,
    };
};

export default useListBase;
