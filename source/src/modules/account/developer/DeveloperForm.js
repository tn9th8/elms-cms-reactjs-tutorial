import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { SalaryOptions, levelOptionSelect, sALARYOptions, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import ScheduleTable from '@components/common/table/ScheduleTable';
import { AppConstants, DATE_FORMAT_VALUE, TIME_FORMAT_DISPLAY, categoryKinds } from '@constants';
import dayjs from 'dayjs';
import { daysOfWeekSchedule as daysOfWeekScheduleOptions } from '@constants/masterData';
import NumericField from '@components/common/form/NumericField';
import CropImageField from '@components/common/form/CropImageField';
import DatePickerField from '@components/common/form/DatePickerField';
import { validateDate } from '@utils/dayHelper';
import { formatDateString } from '@utils';

const DeveloperForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const salaryValues = translate.formatKeys(SalaryOptions, ['label']);
    const daysOfWeekSchedule = translate.formatKeys(daysOfWeekScheduleOptions, ['label']);
    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const [imageUrl, setImageUrl] = useState(null);
    function formatTimeRange(timeArray) {
        return timeArray
            .map((time) => {
                if (time.from === '00H00' && time.to === '00H00') {
                    return '';
                } else {
                    return `${time.from}-${time.to}`;
                }
            })
            .filter((time) => time !== '')
            .join('|');
    }
    const handleSubmit = (values) => {
        if (isEditing) {
            delete values.roleName;
        }
        if (!values.level) {
            values.level = 1;
        }
        if (!values.status) {
            values.status = 0;
        }
        if (!values.salaryKind) {
            values.salaryKind = 0;
        }
        for (const day in values.schedule) {
            for (const timeRange of values.schedule[day]) {
                timeRange.from = timeRange.from.set({ hour: 0, minute: 0 }).format('HH[H]mm');
                timeRange.to = timeRange.to.set({ hour: 0, minute: 0 }).format('HH[H]mm');
            }
        }
        const newSchedule = {
            t2: formatTimeRange(values.schedule.monday),
            t3: formatTimeRange(values.schedule.tuesday),
            t4: formatTimeRange(values.schedule.wednesday),
            t5: formatTimeRange(values.schedule.thursday),
            t6: formatTimeRange(values.schedule.friday),
            t7: formatTimeRange(values.schedule.saturday),
            cn: formatTimeRange(values.schedule.sunday),
        };
        const filterNewSchedule = Object.entries(newSchedule)
            .filter(([key, value]) => value !== '')
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
        values.schedule = values.schedule && JSON.stringify(filterNewSchedule);
        values.birthday = formatDateString(values?.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl, developerRoleId: values.developerRole.id });
    };
    function addFrameTime(data) {
        const result = {};
        const keys = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

        keys.forEach((key) => {
            if (Object.hasOwnProperty.call(data, key)) {
                result[key] = data[key];
            } else {
                result[key] = '00H00-00H00|00H00-00H00|00H00-00H00';
            }
        });

        // Split time and update missing fields
        Object.keys(result).forEach((key) => {
            const timeArray = result[key].split('|');
            if (timeArray.length < 3) {
                while (timeArray.length < 3) {
                    timeArray.push('00H00-00H00');
                }
                result[key] = timeArray.join('|');
            }
        });

        return result;
    }

    const splitTime = (data) => {
        const result = {};
        const dataNew = {
            monday: data.t2,
            tuesday: data.t3,
            wednesday: data.t4,
            thursday: data.t5,
            friday: data.t6,
            saturday: data.t7,
            sunday: data.cn,
        };
        for (const key in dataNew) {
            if (Object.hasOwn(dataNew, key)) {
                const value = dataNew[key];
                if (value && value.length > 0) {
                    const timeRanges = value.split('|');
                    const fromTo = timeRanges.map((timeRange) => {
                        const [from, to] = timeRange.split('-');
                        return {
                            from,
                            to,
                        };
                    });
                    result[key] = fromTo;
                }
            }
        }
        return result;
    };

    useEffect(() => {
        let data = dataDetail?.schedule && JSON.parse(dataDetail?.schedule);
        if (data) {
            const dataFullFrame = addFrameTime(data);
            data = splitTime(dataFullFrame);
        }
        let dataDefault = {};
        daysOfWeekSchedule.map((day) => {
            dataDefault = {
                [day.value]: [
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                ],
                ...dataDefault,
            };
        });
        for (const day in data) {
            for (const timeRange of data[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }
        for (const day in dataDefault) {
            for (const timeRange of dataDefault[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }

        dataDetail.schedule = data || dataDefault;
        dataDetail.birthday =
            dataDetail?.accountDto?.birthday && dayjs(dataDetail?.accountDto?.birthday, DATE_FORMAT_VALUE);
        form.setFieldsValue({
            ...dataDetail,
            fullName: dataDetail?.accountDto?.fullName,
            phone: dataDetail?.accountDto?.phone,
            email: dataDetail?.accountDto?.email,
            leaderId: dataDetail?.leader?.accountDto?.id,
            studentId: dataDetail?.student?.account?.id,
        });

        setImageUrl(dataDetail.accountDto?.avatar);
    }, [dataDetail]);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                salaryKind: salaryValues[1].value,
            });
        }
    }, [isEditing]);
    const onSelectScheduleTabletRandom = (fieldName, value) => {
        try {
            const schedule = getFieldValue('schedule');
            const [dayKey, dayIndexKey, frameKey] = fieldName;
            if (frameKey === 'from') {
                const to = schedule[dayKey][dayIndexKey].to;
                if (to && to.format(TIME_FORMAT_DISPLAY) < value.format(TIME_FORMAT_DISPLAY)) {
                    // schedule[dayKey][dayIndexKey].to = value;
                }
            } else if (frameKey === 'to') {
                const from = schedule[dayKey][dayIndexKey].from;
                if (from && value.format(TIME_FORMAT_DISPLAY) < from.format(TIME_FORMAT_DISPLAY)) {
                    value = from;
                }
            }
            schedule[dayKey][dayIndexKey][frameKey] = value;
            setFieldValue('schedule', schedule);
            onValuesChange();
        } catch (error) {
            console.log(error);
        }
    };
    const handleOk = () => {
        document.activeElement.blur();
    };
    const handleTimeChange = (fieldName, value) => {
        if (!value) {
            try {
                const schedule = getFieldValue('schedule');
                const [dayKey, dayIndexKey, frameKey] = fieldName;
                if (frameKey === 'from') {
                    schedule[dayKey][dayIndexKey].from = dayjs('00:00', 'HH:mm');
                } else if (frameKey === 'to') {
                    schedule[dayKey][dayIndexKey].to = dayjs('00:00', 'HH:mm');
                    // schedule[dayKey][dayIndexKey].to = schedule[dayKey][dayIndexKey].from;
                }
                setFieldValue('schedule', schedule);
                onValuesChange();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const handleReset = (day) => {
        const schedule = getFieldValue('schedule');
        for (let dayIndexKey = 0; dayIndexKey < 3; dayIndexKey++) {
            schedule[day][dayIndexKey].from = dayjs('00:00', 'HH:mm');
            schedule[day][dayIndexKey].to = dayjs('00:00', 'HH:mm');
        }
        setFieldValue('schedule', schedule);
        onValuesChange();
    };
    const handleApplyAll = (e) => {
        e.preventDefault();
        const schedule = getFieldValue('schedule');
        const { monday = [] } = schedule;

        for (let { value } of daysOfWeekSchedule) {
            schedule[value] = monday.map((frame) => ({
                from: dayjs(frame.from, TIME_FORMAT_DISPLAY),
                to: dayjs(frame.to, TIME_FORMAT_DISPLAY),
            }));
        }
        // form.resetFields();
        setFieldValue('schedule', schedule);
        onValuesChange();
    };
    const onFieldsChange = () => {
        onValuesChange();
    };
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
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

    const checkPhone = (_, value) => {
        const phoneRegex = /^[0-9]{10}$/; // Regex để kiểm tra số điện thoại có 10 chữ số
        if (!phoneRegex.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ, vui lòng nhập lại');
        }
        return Promise.resolve();
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onFieldsChange={onFieldsChange} size="1100px">
            <Card className="card-form" bordered={false}>
                <div style={{ width: '980px' }}>
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
                                disabled={isEditing}
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
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.email)}
                                type="email"
                                name="email"
                                required={isEditing ? false : true}
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={translate.formatMessage(commonMessage.hourlySalary)}
                                name="hourlySalary"
                                min={0}
                                max={100000000000000}
                                addonAfter="$"
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={translate.formatMessage(commonMessage.salary)}
                                name="salary"
                                min={0}
                                max={100000000000000}
                                addonAfter="$"
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Leader" />}
                                name="leaderId"
                                apiConfig={apiConfig.developer.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                                // initialSearchParams={{ pageNumber: 0 }}
                                searchParams={(text) => ({ name: text })}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Vai trò dự án" />}
                                name={['developerRole', 'id']}
                                apiConfig={apiConfig.category.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                                initialSearchParams={{ kind: categoryKinds.CATEGORY_KIND_ROLE }}
                                searchParams={(text) => ({ categoryName: text })}
                                required={isEditing ? false : true}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Sinh viên" />}
                                name={['studentId']}
                                apiConfig={apiConfig.student.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                                // initialSearchParams={{ kind: categoryKinds.CATEGORY_KIND_ROLE }}
                                searchParams={(text) => ({ fullName: text })}
                                onChange={(value) => console.log(value)}
                            />
                        </Col>
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
                    </Row>
                    <ScheduleTable
                        handleOk={handleOk}
                        label={translate.formatMessage(commonMessage.schedule)}
                        onSelectScheduleTabletRandom={onSelectScheduleTabletRandom}
                        translate={translate}
                        handleApplyAll={handleApplyAll}
                        daysOfWeekSchedule={daysOfWeekSchedule}
                        handleTimeChange={handleTimeChange}
                        handleReset={handleReset}
                    />
                </div>
                <div className="footer-card-form" style={{ marginTop: '20px', marginRight: '69px' }}>
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
};

export default DeveloperForm;
