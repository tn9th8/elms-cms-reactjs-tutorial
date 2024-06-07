import React from 'react';
import { BaseTooltip } from '../form/BaseTooltip';

const ScheduleFile = ({ schedule }) => {
    if(!schedule){
        return <div></div>;
    }
    let check = JSON.parse(schedule);
    const newCheck = [
        { key: 'M', value: check.t2 },
        { key: 'T', value: check.t3 },
        { key: 'W', value: check.t4 },
        { key: 'T', value: check.t5 },
        { key: 'F', value: check.t6 },
        { key: 'S', value: check.t7 },
        { key: 'S', value: check.cn },
    ];

    let dateString = '';
    newCheck.map((item) => {
        if (item.value) {
            dateString += item.key;
        } else {
            dateString += ' ';
        }
    });
    let checkTime = false;
    const today = new Date();
    let dayOfWeek = today.getDay();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const totalMinutesToday = currentHour * 60 + currentMinute;
    if (dayOfWeek - 1 < 0) {
        dayOfWeek = 7;
    }
    function convertTimeStringToObject(timeString) {
        const timeArray = timeString.split('|');
        const timeObjects = [];
        timeArray.forEach((time) => {
            const [startHour, startMinute, endHour, endMinute] = time.match(/\d+/g);
            const startTime = parseInt(startHour) * 60 + parseInt(startMinute);
            const endTime = parseInt(endHour) * 60 + parseInt(endMinute);

            const timeObject = { startTime, endTime };
            timeObjects.push(timeObject);
        });

        return timeObjects;
    }
    newCheck.map((item, index) => {
        if (index === dayOfWeek - 1) {
            if (item.value) {
                const frameArray = convertTimeStringToObject(item.value);
                frameArray.map((frame) => {
                    if (frame?.startTime <= totalMinutesToday && totalMinutesToday <= frame?.endTime) {
                        checkTime = true;
                    }
                });
            }
        }
    });
    const arrayFromInput = dateString.split('');
    const resultArray = arrayFromInput.map((item, index) => (
        <div
            key={index}
            style={{
                height: '25px',
                width: '20px',
                textAlign: 'center',
                marginRight: '5px',
            }}
        >
            <BaseTooltip title={(newCheck[index].value || 'Không có lịch').split('|').join(' | ')}>
                {index === dayOfWeek - 1 ? (
                    <span
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            boxShadow: item !== ' ' && checkTime ? '0 0 2px 1px green' : '0 0 2px 1px red',
                            color: dayOfWeek - 1 === index && checkTime ? 'green' : 'red',
                            textAlign: 'center',
                            marginRight: '5px',
                        }}
                    >
                        {item}
                    </span>
                ) : (
                    <span
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            border: '1px solid #000',
                        }}
                    >
                        {item}
                    </span>
                )}
            </BaseTooltip>
        </div>
    ));
    return <div style={{ display: 'flex' }}>{resultArray}</div>;
};

export default ScheduleFile;
