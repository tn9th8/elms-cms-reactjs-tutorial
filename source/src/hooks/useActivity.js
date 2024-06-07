import { useEffect, useState } from "react";
import { Dialog } from "antd-mobile";
import { useDispatch } from "react-redux";

import { accountActions, activityActions } from "@store/actions";
import useFetch from "./useFetch";

const useActivity = () => {
    const dispatch = useDispatch();
    const { handleAction } = useFetch(activityActions.updateActivity, { errorHandle: true });
    const [ newBadgeImageSrc, setNewBadgeImageSrc ] = useState('');
    const [ isOpenNewBadge, setIsOpenNewBadge ] = useState(false);

    const updateActivity = async (type, data) => {
        const res = await handleAction({
            pathParams: { type },
            data,
        });
        if (res?.data?.value) {
            Dialog.alert({
                content: `You have +${res.data.value} point in activity`,
                confirmText: 'OK',
                closeOnMaskClick: true,
                onConfirm: () => {
                    const newBadge = (res.data.badgesAchieve || []).slice(-1)[0];
                    if (newBadge) {
                        setNewBadgeImageSrc(newBadge.badgeLevelIconUrl);
                        setIsOpenNewBadge(true);
                    }
                },
            });
            dispatch(accountActions.updateUserXp({
                xp: res.data.xp,
                currentLevel: res.data.newLevel,
                nextLevel: res.data.nextLevel,
            }));
        }
    };

    useEffect(() => {
        return () => {
            Dialog.clear();
        };
    }, []);

    return { updateActivity, isOpenNewBadge, newBadgeImageSrc, setIsOpenNewBadge };
};

export default useActivity;
