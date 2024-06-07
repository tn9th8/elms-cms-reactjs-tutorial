import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFormField from '@hooks/useFormField';
import { Button, Form, Upload, message } from 'antd';
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
    uploadSuccess: 'Upload success',
    uploadFail: 'Upload failed',
    uploadField: 'Click to Upload',
    wrongFileType: 'Wrong file type',
});

function FileUploadField({
    label,
    accept,
    name,
    rules,
    required,
    fileType,
    formItemProps,
    fieldProps,
    validateAccept,
    showUploadList,
    handleUploadFile,
    maxCount,
    fileList,
    onRemove,
}) {
    const { rules: fieldRules } = useFormField({ required, rules });

    return (
        <Form.Item {...formItemProps} label={label} name={name} rules={fieldRules} >
            <Implement
                {...fieldProps}
                showUploadList={showUploadList}
                validateAccept={validateAccept}
                accept={accept}
                fileType={fileType}
                maxCount={maxCount}
                fileList={fileList}
                handleUploadFile={handleUploadFile}
                onRemove={onRemove}
            />
        </Form.Item>
    );
}

function Implement({ value, onChange, fileType, accept, validateAccept, showUploadList, handleUploadFile, ...props }) {
    const intl = useIntl();
    const { execute: executeUpFile, loading } = useFetch(apiConfig.file.upload);

    // const handleUploadFile = ({ file, onSuccess, onError }) => {
    //     if (validateAccept && !validateAccept(file)) {
    //         message.error(intl.formatMessage(messages.wrongFileType));
    //         return;
    //     }

    //     executeUpFile({
    //         data: {
    //             type: fileType,
    //             file: file,
    //         },
    //         onCompleted: (response) => {
    //             if (response.result === true) {
    //                 onSuccess();
    //                 onChange(response.data.filePath);
    //                 message.success(intl.formatMessage(messages.uploadSuccess));
    //             }
    //         },
    //         onError: (error) => {
    //             onError();
    //             message.error(intl.formatMessage(messages.uploadFail));
    //         },
    //     });
    // };

    return (
        <Upload
            {...props}
            showUploadList={showUploadList}
            accept={accept}
            customRequest={handleUploadFile}
        >
            <Button loading={loading} icon={<UploadOutlined />}>
                {intl.formatMessage(messages.uploadField)}
            </Button>
        </Upload>
    );
}

export default FileUploadField;
