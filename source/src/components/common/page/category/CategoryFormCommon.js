import CropImageField from '@components/common/form/CropImageField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { formSize, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';

function CategoryFormCommon({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, fieldsName, size='small' }) {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [ imageUrl, setImageUrl ] = useState(null);
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, [ 'label' ]);

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

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, categoryImage: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.categoryImage);
    }, [ dataDetail ]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            initialValues={{ status: STATUS_ACTIVE }}
        >
            <Card className="card-form" bordered={false}>
                <CropImageField
                    label="Image"
                    name={fieldsName.image}
                    imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                    aspect={1 / 1}
                    uploadFile={uploadFile}
                />
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label="Name" name={fieldsName.name} />
                    </Col>
                    <Col span={12}>
                        <SelectField name="status" label="Status" allowClear={false} options={statusValues} />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label="Description" name={fieldsName.description} type="textarea" />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
}

export default CategoryFormCommon;
