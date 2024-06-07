import { useCurrency } from '@components/common/elements/Currency';
import { UserTypes, storageKeys } from '@constants';
import useNotification from '@hooks/useNotification';
import routes from '@routes';
import { selectRestaurantList } from '@selectors/app';
import { removeCacheToken } from '@services/userService';
import { accountActions, appActions } from '@store/actions';
import { createPathWithData } from '@utils';
import { getData } from '@utils/localStorage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const userKind = getData(storageKeys.USER_KIND);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notification = useNotification();
    const { fetchCurrency } = useCurrency();
    useEffect(() => {
        if (userKind == UserTypes.ADMIN) {
            removeCacheToken();
            dispatch(accountActions.logout());
            notification({ type: 'error', message: 'Loại tài khoản không phù hợp để đăng nhập vô trang này !!!' });
        } else if (userKind == UserTypes.STUDENT) {
            navigate(routes.courseStudentListPage.path);
        } else if (userKind == UserTypes.LEADER) {
            navigate(routes.projectLeaderListPage.path);
        } else if (userKind == UserTypes.COMPANY) {
            navigate(routes.companyRequestListPage.path);
        } else {
            navigate(routes.studentListPage.path);
        }
    }, []);

    return null;
};

export default Dashboard;
