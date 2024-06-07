import { ConfigProvider, Form, Progress } from 'antd';
import React, { useState } from 'react';

import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';

import { ReactComponent as Cloud } from '@assets/icons/upload.svg';
import { IconFileUpload } from '@tabler/icons-react';
import Dragger from 'antd/es/upload/Dragger';
import styles from './UploadVideoFIeldProcessBar.module.scss';
function UploadVideoProcessField({
    required,
    label,
    formItemProps,
    objectName = '',
    options = {},
    setIsChange,
    disabled,
    onChange,
    isEditing,
    name,
}) {
    const checkFileLink = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('This field is required!'));
    };

    return (
        <Form.Item
            {...formItemProps}
            rules={[{ validator: checkFileLink }]}
            required={required}
            label={label}
            name={name}
        >
            <VideoField
                disabled={disabled}
                objectName={objectName}
                options={options}
                setIsChange={setIsChange}
                onChange={onChange}
                isEditing={isEditing}
                name={name}
            />
        </Form.Item>
    );
}

function VideoField({ value = '', onChange, objectName = '', options = {}, setIsChange, disabled }) {
    const [showModal, setShowModal] = useState(false);
    const [fileLink, setFileLink] = useState(value);
    const { execute: executeUpFile } = useFetch(apiConfig.file.uploadCourseContent);
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [nameFile, setNameFile] = useState();
    const mixinFuncs = {
        mixinFuncs: {
            onUploadProgress: (event) => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
                if (percent === 100) {
                    setTimeout(() => setProgress(0), 1000);
                }
                console.log(event);
            },
        },
    };
    const uploadFile = ({ file, onSuccess, onError, options }) => {
        setUploadLoading(true);
        setIsChange(true);
        executeUpFile({
            data: {
                file: file,
                ...options,
            },
            ...mixinFuncs,
            onCompleted: (result) => {
                onChange(result.data.filePath);
                onSuccess();
                setUploadLoading(false);
                setIsChange(false);
            },
            onError: (error) => {
                onError();
                setErrorMessage('Không tải được video');
                setUploadLoading(false);
                setIsChange(false);
            },
        });
    };
    const renderContent = () => {
        if (uploadLoading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', flexDirection: 'column' }}>
                    {progress > 0 ? <div style={{ fontWeight : "bold" }}>{`Uploading...${progress} %`}</div> : null}
                    {progress > 0 ? (
                        <Progress
                            percent={progress}
                            strokeColor={'var(--primary-color)'}
                            showInfo={false}
                            style={{ marginBottom: '10px', padding: '0 20px' }}
                        />
                    ) : null}
                    {progress > 0 && nameFile && (
                        <div className={styles.box}>
                            <div className={styles.desc}>
                                <span className={styles.descTitle}>Tên file</span>
                                <p className={styles.descNameFile}>{nameFile}</p>
                            </div>
                        </div>
                    )}
                   
                    
                </div>
            );
        }
        if (errorMessage) {
            return <div style={{ color: 'red' }}>{errorMessage}</div>;
        }
        if (value) {
            return (
                <>
                    {nameFile && (
                       
                        <div style={{ display: 'block', margin: 'auto',marginBottom:"60px" }}>
                            <IconFileUpload stroke={1} color="gray" height={100} width={100} />
                        </div>
                        
                    )}

                    {nameFile && (
                        <div className={styles.box}>
                            <div className={styles.desc}>
                                <span className={styles.descTitle}>Tên file</span>
                                <p className={styles.descNameFile}>{nameFile}</p>
                            </div>
                        </div>
                    )}
                    {!nameFile && (
                        <div>
                            <div>
                                <Cloud />
                            </div>
                            <div style={{ fontSize: 12 }}>Upload {objectName}</div>
                        </div>
                    )}
                </>
            );
        }
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div>
                    <Cloud />
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: 'white',
                        background: 'var(--primary-color)',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    Upload {objectName}
                </div>
            </div>
        );
    };
    const handleFileUpload = (info) => {
        setNameFile(info.file.name);
        // Logic of action you want to perform on file upload
    };
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: 'cyan',
                        borderRadius: 2,

                        // Alias Token
                        colorBgContainer: '#f6ffed',
                        margin: 0,
                        padding: 0,
                    },
                }}
            >
                <Dragger
                    disabled={disabled}
                    accept=".mp4"
                    showUploadList={false}
                    customRequest={({ file, onSuccess, onError }) => {
                        uploadFile({ file, onSuccess, onError, options });
                    }}
                    height={250}
                    maxCount={1}
                    onChange={handleFileUpload}
                    style={{ position: 'relative' }}
                >
                    {renderContent()}
                </Dragger>
            </ConfigProvider>
        </>
    );
}

export default UploadVideoProcessField;
