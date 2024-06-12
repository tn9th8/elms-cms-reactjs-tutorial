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
import { lectureKindOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, categoryKinds } from '@constants';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';
import RichTextField from '@components/common/form/RichTextField';

const LectureForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const lectureKindValues = translate.formatKeys(lectureKindOptions, ['label']);
    const [extendForm, setExtendForm] = useState(1);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (!isEditing > 0) {
            // create => come into
            form.setFieldsValue({
                lectureKind: lectureKindValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        setExtendForm(dataDetail?.lectureKind);
        form.setFieldsValue({
            lectureName: dataDetail?.lectureName,
            urlDocument: dataDetail?.urlDocument,
            description: dataDetail?.description,
            shortDescription: dataDetail?.shortDescription,
            lectureKind: dataDetail?.lectureKind,
        });
    }, [dataDetail]);

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            ordering: dataDetail?.ordering,
            status: dataDetail?.status,
            subjectId: dataDetail?.subject?.id,
        });
    };

    const onChangeLectureKind = (e) => {
        setExtendForm(e);
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.lectureName)}
                            placeholder={translate.formatMessage(commonMessage.lectureName)}
                            rules={[{ required: true }]}
                            name="lectureName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            rules={[{ required: true }]}
                            label={translate.formatMessage(commonMessage.lectureKind)}
                            name="lectureKind"
                            options={lectureKindValues}
                            onChange={onChangeLectureKind}
                        />
                    </Col>
                </Row>
                {extendForm === 2 && (
                    <div>
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    rules={[{ required: true }]}
                                    label={translate.formatMessage(commonMessage.urlDocument)}
                                    placeholder={translate.formatMessage(commonMessage.urlDocument)}
                                    name="urlDocument"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <RichTextField
                                    rules={[{ required: true }]}
                                    label={translate.formatMessage(commonMessage.lectureContent)}
                                    placeholder={translate.formatMessage(commonMessage.lectureContent)}
                                    name="description"
                                    style={{ height: '530px', marginBottom: '70px' }}
                                    form={form}
                                    setIsChangedFormValues={setIsChangedFormValues}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    type="textarea"
                                    rules={[{ required: false }]}
                                    label={translate.formatMessage(commonMessage.shortDescription)}
                                    placeholder={translate.formatMessage(commonMessage.shortDescription)}
                                    name="shortDescription"
                                />
                            </Col>
                        </Row>
                    </div>
                )}
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LectureForm;
