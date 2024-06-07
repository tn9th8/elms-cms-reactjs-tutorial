import { accountActions } from "@store/actions";
import useFetch from "./useFetch";

const useAccountInit = () => {
    const { handleAction: getUserXp } = useFetch(accountActions.getUserXp, {
        errorHandle: true,
        cache: useFetch.CACHE_TYPE.REDUX,
        prepareCache: response => response?.data,
    });
    const { handleAction: getProfile } = useFetch(accountActions.getProfile, {
        errorHandle: true,
        cache: useFetch.CACHE_TYPE.REDUX,
        prepareCache: response => response?.data,
    });

    const getUserInfo = async () => {
        await getUserXp();
        await getProfile();
    };

    return { getUserInfo };
};

export default useAccountInit;
