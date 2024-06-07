import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';

const messages = defineMessages({
    id: 'Id',
    name: 'Tên',
    status: 'Trạng thái',
    description: 'Description',
    kind: 'kind',
});

const CategoryForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });


    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            // status: statusValues[0].value,
        });
    }, [dataDetail]);

    return (
        <BaseForm
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={translate.formatMessage(messages.name)} name="categoryName" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="status"
                            label={translate.formatMessage(messages.status)}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default CategoryForm;