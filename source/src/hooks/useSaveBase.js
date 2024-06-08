import React, { useEffect, useMemo, useState } from 'react';
import useQueryParams from './useQueryParams';
import useFetch from './useFetch';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Col, Modal, Row } from 'antd';
import { SaveOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { showErrorMessage, showSucsessMessage } from '@services/notifyService';
import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import useNotification from './useNotification';
import useTranslate from './useTranslate';
import { getData } from '@utils/localStorage';
import { storageKeys } from '@constants';

const message = defineMessages({
    createSuccess: 'Tạo {objectName} thành công',
    updateSuccess: 'Cập nhật {objectName} thành công',
    new: 'New',
    edit: 'Edit',
    update: 'Update',
    create: 'Create',
    cancel: 'Cancel',
});

const closeFormMessage = defineMessages({
    closeSuccess: 'Close {objectName} successfully',
    closeTitle: 'Bạn có muốn đóng trang này?',
    ok: 'Có',
    cancel: 'Không',
});

const useSaveBase = ({
    apiConfig = {
        getById: null,
        create: null,
        update: null,
    },
    options = {
        objectName: '',
        getListUrl: '',
    },
    isProjectToken = false,
    override,
}) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { params: queryParams, setQueryParams } = useQueryParams();
    const [detail, setDetail] = useState({});
    const [detailId, setDetailId] = useState(params.id);
    const [isSubmitting, setSubmit] = useState(false);
    const [isChanged, setChange] = useState(false);
    const [isEditing, setEditing] = useState(params.id === 'create' ? false : true);
    const { execute: executeGet, loading } = useFetch(apiConfig.getById, {
        immediate: false,
    });
    const userTokenProject = getData(storageKeys.USER_PROJECT_ACCESS_TOKEN);
    const translate = useTranslate();
    const { execute: executeCreate, loading: loadingCreate } = useFetch(
        isProjectToken ? { ...apiConfig.create, authorization: `Bearer ${userTokenProject}` } : { ...apiConfig.create },
        { immediate: false },
    );
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(
        isProjectToken ? { ...apiConfig.create, authorization: `Bearer ${userTokenProject}` } : { ...apiConfig.update },
        { immediate: false },
    );
    const title =
        params.id === 'create'
            ? `${translate.formatMessage(message.new)} ${options.objectName}`
            : `${translate.formatMessage(message.edit)} ${options.objectName}`;
    const intl = useIntl();
    const notification = useNotification();
    const [shouldShowCloseFormConfirm, setShouldShowCloseFormConfirm] = useState(false);
    // const [ filter, setFilter ] = useState({});

    const mappingData = (response) => {
        if (response.result === true) return response.data;
    };

    // useEffect(() => {
    //     if (shouldShowCloseFormConfirm) {
    //         Modal.confirm({
    //             title: intl.formatMessage(closeFormMessage.closeTitle, { objectName: options.objectName }),
    //             content: '',
    //             okText: intl.formatMessage(closeFormMessage.ok),
    //             cancelText: intl.formatMessage(closeFormMessage.cancel),
    //             onOk: () => {
    //                 onBack();
    //             },
    //         });
    //         console.log(location);
    //         // setShouldShowCloseFormConfirm(false);
    //     } else {
    //         // Đánh dấu rằng lần thay đổi đầu tiên đã xảy ra
    //         setShouldShowCloseFormConfirm(true);
    //     }
    // }, [location, shouldShowCloseFormConfirm]);

    const handleGetDetailError = (error) => {
        // console.log({ error });
    };

    const handleFetchDetail = (params) => {
        executeGet({
            ...params,
            pathParams: { id: detailId },
            onCompleted: (response) => {
                setDetail(mixinFuncs.mappingData(response));
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };

    const getDetail = () => {
        mixinFuncs.handleFetchDetail(detailId);
    };

    const getFormId = () => {
        return `form-${location.pathname}`;
    };

    const onBack = () => {
        const doBack = () => {
            if (location?.state?.prevPath === options.getListUrl) {
                navigate(-1);
            } else {
                navigate(options.getListUrl);
            }
        };

        doBack();
    };

    const prepareCreateData = (data) => {
        return data;
    };

    const prepareUpdateData = (data) => {
        return {
            ...data,
            id: detail.id,
        };
    };

    const onSave = (values) => {
        setSubmit(true);
        if (isEditing) {
            executeUpdate({
                data: mixinFuncs.prepareUpdateData(values),
                onCompleted: mixinFuncs.onSaveCompleted,
                onError: mixinFuncs.onSaveError,
            });
        } else {
            executeCreate({
                data: mixinFuncs.prepareCreateData(values),
                onCompleted: mixinFuncs.onSaveCompleted,
                onError: mixinFuncs.onSaveError,
            });
        }
    };

    const onSaveCompleted = (responseData) => {
        setSubmit(false);
        if (responseData?.data?.errors?.length) {
            mixinFuncs.onSaveError();
        } else {
            if (isEditing) {
                mixinFuncs.onUpdateCompleted(responseData);
            } else {
                mixinFuncs.onInsertCompleted(responseData);
            }
        }
    };

    const getActionName = () => {
        return isEditing ? 'Update' : 'Create';
    };

    const onUpdateCompleted = (responseData) => {
        if (responseData.result === true) {
            notification({
                message: intl.formatMessage(message.updateSuccess, {
                    objectName: options.objectName,
                }),
            });
            onBack();
        }
    };

    const onInsertCompleted = (responseData) => {
        if (responseData.result === true) {
            notification({
                message: intl.formatMessage(message.createSuccess, {
                    objectName: options.objectName,
                }),
            });
            onBack();
        }
    };

    const handleShowErrorMessage = (err, showErrorMessage) => {
        if (err && err.message) showErrorMessage(err.message);
        else showErrorMessage(`${getActionName()} failed. Please try again!`);
    };

    const onSaveError = (err) => {
        mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
        setSubmit(false);
    };

    const setIsChangedFormValues = (flag) => {
        if (flag !== isChanged) {
            setChange(flag);
        }
    };

    const showCloseFormConfirm = (customDisabledSubmitValue, hiddenSubmit) => {
        const disabledSubmit = customDisabledSubmitValue !== undefined ? customDisabledSubmitValue : !isChanged;

        if (!disabledSubmit) {
            Modal.confirm({
                title: intl.formatMessage(closeFormMessage.closeTitle, { objectName: options.objectName }),
                content: '',
                okText: intl.formatMessage(closeFormMessage.ok),
                cancelText: intl.formatMessage(closeFormMessage.cancel),
                centered: true,
                onOk: () => {
                    onBack();
                },
            });
        } else {
            onBack();
        }
    };

    const renderActions = (customDisabledSubmitValue, hiddenSubmit) => {
        const disabledSubmit = customDisabledSubmitValue !== undefined ? customDisabledSubmitValue : !isChanged;
        return (
            <Row justify="end" gutter={12}>
                <Col>
                    <Button
                        danger
                        key="cancel"
                        onClick={(e) => {
                            e.stopPropagation();
                            mixinFuncs.showCloseFormConfirm();
                        }}
                        icon={<StopOutlined />}
                    >
                        {translate.formatMessage(message.cancel)}
                    </Button>
                </Col>
                {!hiddenSubmit && (
                    <Col>
                        <Button
                            key="submit"
                            htmlType="submit"
                            type="primary"
                            form={mixinFuncs.getFormId()}
                            loading={isSubmitting}
                            disabled={disabledSubmit}
                            icon={<SaveOutlined />}
                        >
                            {isEditing ? intl.formatMessage(message.update) : intl.formatMessage(message.create)}
                        </Button>
                    </Col>
                )}
            </Row>
        );
    };
    const overrideHandler = () => {
        const centralizedHandler = {
            getDetail,
            handleFetchDetail,
            mappingData,
            handleGetDetailError,
            getFormId,
            renderActions,
            prepareCreateData,
            prepareUpdateData,
            onSaveCompleted,
            onUpdateCompleted,
            onInsertCompleted,
            onSaveError,
            onSave,
            executeGet,
            executeCreate,
            executeUpdate,
            setDetail,
            setEditing,
            handleShowErrorMessage,
            getActionName,
            setSubmit,
            showCloseFormConfirm,
        };

        override?.(centralizedHandler);

        return centralizedHandler;
    };

    const mixinFuncs = overrideHandler();

    useEffect(() => {
        if (params.id) {
            if (params.id === 'create') setEditing(false);
            else mixinFuncs.getDetail();
        }
    }, []);

    return {
        detail,
        mixinFuncs,
        loading,
        onSave,
        setIsChangedFormValues,
        isEditing,
        title,
        setDetailId,
        setSubmit,
        loadingUpdate,
        loadingCreate,
    };
};

export default useSaveBase;
