import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useFetch from '@hooks/useFetch';
import { FormattedMessage, defineMessages } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, categoryKinds } from '@constants';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';

const StudentForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const kindOfEdu = categoryKinds.CATEGORY_KIND_EDUCATION;
    const kindOfGen = categoryKinds.CATEGORY_KIND_GENERATION;
    const [currentKindOfEdu, setCurrentKindOfEdu] = useState(kindOfEdu);
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const {
        data: categorys,
        loading: getCategorysLoading,
        execute: executeGetCategorys,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.categoryName })),
    });
    // useEffect(() => {
    //     executeGetCategorys({
    //         params: {},
    //     });
    // }, []);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        dataDetail.birthday = dataDetail?.account?.birthday && dayjs(dataDetail?.account?.birthday, DATE_FORMAT_VALUE);
        setImageUrl(dataDetail.account?.avatar);
        dataDetail.fromDate = dataDetail.fromDate && dayjs(dataDetail.fromDate, DEFAULT_FORMAT);
        dataDetail.endDate = dataDetail.endDate && dayjs(dataDetail.endDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            // university: dataDetail?.category?.categoryName,
            fullName : dataDetail?.account?.fullName,
            phone : dataDetail?.account?.phone,
            email: dataDetail?.account?.email,
            universityId: dataDetail?.university?.id,
            studyClassId: dataDetail?.studyClass?.id,
        });
        setImageUrl(dataDetail?.account?.avatar);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        values.birthday = formatDateString(values?.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
        values.fromDate = formatDateString(values.fromDate, DEFAULT_FORMAT);
        values.endDate = formatDateString(values.endDate, DEFAULT_FORMAT);
        
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    const validateDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isAfter(date)) {
            return Promise.reject('Ngày sinh phải nhỏ hơn ngày hiện tại');
        }
        return Promise.resolve();
    };

    const checkPhone = (_, value) => {
        const phoneRegex = /^[0-9]{10}$/; // Regex để kiểm tra số điện thoại có 10 chữ số
        if (!phoneRegex.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ, vui lòng nhập lại');
        }
        return Promise.resolve();
    };
    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.name)}
                            required={isEditing ? false : true}
                            name="fullName"
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="birthday"
                            label="Ngày sinh"
                            placeholder="Ngày sinh"
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                            required={isEditing ? false : true}
                            rules={[
                                {
                                    validator: validateDate,
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.mssv)}
                            disabled={isEditing}
                            // required={isEditing ? false : true}
                            name="mssv"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            type="phone"
                            name="phone"
                            required={isEditing ? false : true}
                            rules={[
                                {
                                    validator: checkPhone,
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.password)}
                            rules={[
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 kí tự!',
                                },
                            ]}
                            required={isEditing ? false : true}
                            name="password"
                            type="password"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.email)}
                            type="email"
                            name="email"
                            required={isEditing ? false : true}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Trường" />}
                            name="universityId"
                            disabled={isEditing}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{
                                kind: kindOfEdu,
                            }}
                            optionsParams={{ kind: kindOfEdu }}
                            searchParams={(text) => ({ name: text })}
                            onFocus={handleFocus}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Hệ" />}
                            name="studyClassId"
                            disabled={isEditing}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{
                                kind: kindOfGen,
                            }}
                            optionsParams={{ kind: kindOfGen }}
                            searchParams={(text) => ({ name: text })}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="fromDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu training" />}
                            placeholder="Ngày bắt đầu training"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                                
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc training" />}
                            name="endDate"
                            placeholder="Ngày kết thúc training"
                        
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                    
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default StudentForm;
