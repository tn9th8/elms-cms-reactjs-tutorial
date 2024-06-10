import { moveArrayElement } from '@utils';
import React, { createContext, useContext, useEffect, useState } from 'react';
import useFetch from './useFetch';
import useNotification from './useNotification';

const sortColumn = {
    key: 'sort',
    align: 'center',
    width: 30,
};

function useDragDrop({ data = [], apiConfig, setTableLoading, indexField }) {
    const [sortedData, setSortedData] = useState(
        (data.length > 0 && data.sort((a, b) => a?.[indexField] - b?.[indexField])) || [],
    );
    const { execute: executeOrdering } = useFetch(apiConfig);
    const notification = useNotification();
    const onDragEnd = ({ id: dragId }, { id: hoverId }) => {
        if (dragId == hoverId) return;
        const dragIndex = sortedData.findIndex((item) => item.id == dragId);
        const hoverIndex = sortedData.findIndex((item) => item.id == hoverId);
        const movedData = moveArrayElement(sortedData, dragIndex, hoverIndex);
        setSortedData(movedData);
    };
    const handleUpdate = () => {
        let dataUpdate = [];
        sortedData.map((item, index) => {
            dataUpdate.push({
                id: item.id,
                [indexField]: index,
            });
        });
        executeOrdering({
            data: dataUpdate,
            onCompleted: () => {
                notification({ type: 'success', message: 'Update success!' });
            },
            onError: (err) => {
                console.log(err);
                notification({ type: 'error', message: 'Update error!' });
            },
        });
    };

    useEffect(() => {
        if (data) setSortedData(data);
        else setSortedData([]);
    }, [data]);

    return { sortedData, onDragEnd, sortColumn, handleUpdate };
}

export default useDragDrop;
