import { moveArrayElement } from '@utils';
import React, { useEffect, useState } from 'react';
import useFetch from './useFetch';
import useNotification from './useNotification';

const sortColumn = {
    key: 'sort',
    width: 30,
};

function useDrapDropTableItem({ data = [], apiConfig, setTableLoading, indexField, idField }) {
    const [sortedData, setSortedData] = useState(data || []);
    const { execute: executeOrdering } = useFetch(apiConfig);
    const notification = useNotification();

    const onDragEnd = ({ id: dragId }, { id: hoverId }) => {
        if (dragId == hoverId) return;

        const backupData = sortedData;
        setTableLoading(true);
        const dragIndex = sortedData.findIndex((item) => item.id == dragId);
        const hoverIndex = sortedData.findIndex((item) => item.id == hoverId);
        const movedData = moveArrayElement(sortedData, dragIndex, hoverIndex);
        const before = movedData[hoverIndex + 1]?.[indexField];
        const after = movedData[hoverIndex - 1]?.[indexField];
        setSortedData(movedData);

        executeOrdering({
            pathParams: {
                id: sortedData[dragIndex].id,
            },
            data: {
                ...data[dragIndex],
                rank: after,
                rankBehind: before,
                [idField]: data[dragIndex]._id,
            },
            onCompleted: () => {
                setTableLoading(false);
            },
            onError: (err) => {
                console.log(err);
                setTableLoading(false);
                setSortedData(backupData);
                notification({ type: 'error', message: 'Change order error!' });
            },
        });
    };

    useEffect(() => {
        if (data) setSortedData(data);
        else setSortedData([]);
    }, [data]);

    return { sortedData, onDragEnd, sortColumn };
}

export default useDrapDropTableItem;
