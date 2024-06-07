import { Button, Form, Space } from 'antd';
import React from 'react';
import TimePickerField from '../form/TimePickerField';
import { defineMessages } from 'react-intl';
import { ReloadOutlined } from '@ant-design/icons';
import { BaseTooltip } from '../form/BaseTooltip';
const messages = defineMessages({
    dayOfWeek: 'Thứ',
    timeFrame: 'Khung giờ',
    applyAll: 'Áp dụng tất cả',
    frame: 'Khung',
    reset: 'Đặt lại khung giờ',
});
function ScheduleTable({
    label,
    onSelectScheduleTabletRandom,
    translate,
    daysOfWeekSchedule,
    canApplyAll = true,
    handleApplyAll,
    handleOk,
    handleTimeChange,
    handleReset,
}) {
    return (
        <div>
            <div style={{ padding: '10px' }}>{label}</div>
            <table className="happy-hours-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th width="14%">{translate.formatMessage(messages.dayOfWeek)}</th>
                        <th>{translate.formatMessage(messages.timeFrame)}</th>
                    </tr>
                </thead>
                <tbody>
                    {daysOfWeekSchedule.map((day, dayIndex) => (
                        <tr key={day.value}>
                            <td>{day.label}</td>
                            <td style={{ padding: '10px' }}>
                                <Form.List name={['schedule', day.value]}>
                                    {(fields) => {
                                        return (
                                            <div className="no-margin-form-item" style={{ display: 'flex', alignItems: 'end' }}>
                                                <Space className="box-flex" size={24}>
                                                    {fields.map((field, index) => (
                                                        <div key={field.key}>
                                                            <div className="frame-label">
                                                                {translate.formatMessage(messages.frame)} {index + 1}
                                                            </div>
                                                            <Space className="box-flex">
                                                                <TimePickerField
                                                                    onChange={(value) =>
                                                                        handleTimeChange(
                                                                            [day.value, field.name, 'from'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    onOk={handleOk}
                                                                    style={{ width: '76px' }}
                                                                    size="small"
                                                                    name={[field.name, 'from']}
                                                                    onSelect={(value) =>
                                                                        onSelectScheduleTabletRandom(
                                                                            [day.value, field.name, 'from'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    width="100%"
                                                                    placeholder="From"
                                                                />
                                                                <TimePickerField
                                                                    onOk={handleOk}
                                                                    style={{ width: '76px' }}
                                                                    size="small"
                                                                    name={[field.name, 'to']}
                                                                    onSelect={(value) =>
                                                                        onSelectScheduleTabletRandom(
                                                                            [day.value, field.name, 'to'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    onChange={(value) =>
                                                                        handleTimeChange(
                                                                            [day.value, field.name, 'to'],
                                                                            value,
                                                                        )
                                                                    }
                                                                    width="100%"
                                                                    required
                                                                    placeholder="to"
                                                                    requiredMsg="Enter to"
                                                                    validateTrigger={['onBlur']}
                                                                />
                                                            </Space>
                                                        </div>
                                                    ))}
                                                </Space>
                                                <div className="wrap-btn-apply-all">
                                                    <BaseTooltip title={translate.formatMessage(messages.reset)}>
                                                        <Button
                                                            type="default"
                                                            size="middle"
                                                            style={{ marginRight: '30px' }}
                                                            onClick={() => handleReset(day.value)}
                                                        >
                                                            <ReloadOutlined />
                                                        </Button>
                                                    </BaseTooltip>
                                                    {!dayIndex && (
                                                        <Button
                                                            disabled={!canApplyAll}
                                                            type="primary"
                                                            size="middle"
                                                            onClick={handleApplyAll}
                                                        >
                                                            {translate.formatMessage(messages.applyAll)}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }}
                                </Form.List>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ScheduleTable;
