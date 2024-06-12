import { BaseForm } from '@components/common/form/BaseForm';
import RichTextField from '@components/common/form/RichTextField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { lectureKindOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const LectureForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const lectureKindValues = translate.formatKeys(lectureKindOptions, ['label']);
    const [extendForm, setExtendForm] = useState(1);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (!isEditing) {
            setExtendForm(2);
            form.setFieldsValue({
                lectureKind: lectureKindValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        if (dataDetail.id) {
            setExtendForm(dataDetail.lectureKind);
            form.setFieldsValue({ ...dataDetail });
        }
    }, [dataDetail]);

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            ordering: dataDetail.ordering,
            status: dataDetail.status,
            subjectId: dataDetail.subject.id,
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
                            rules={[{ required: true, message: `${translate.formatMessage(commonMessage.required)}` }]}
                            name="lectureName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.lectureKind)}
                            rules={[{ required: true, message: `${translate.formatMessage(commonMessage.required)}` }]}
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
                                    rules={[
                                        {
                                            required: true,
                                            message: `${translate.formatMessage(commonMessage.required)}`,
                                        },
                                    ]}
                                    label={translate.formatMessage(commonMessage.urlDocument)}
                                    placeholder={translate.formatMessage(commonMessage.urlDocument)}
                                    name="urlDocument"
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <RichTextField
                                    rules={[
                                        {
                                            required: true,
                                            message: `${translate.formatMessage(commonMessage.required)}`,
                                        },
                                    ]}
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
