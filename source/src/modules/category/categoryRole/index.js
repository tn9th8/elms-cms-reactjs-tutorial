import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { useLocation } from 'react-router-dom';
import BaseTable from '@components/common/table/BaseTable';
import { categoryKinds } from '@constants';
import CategoryListPageCommon from '@components/common/page/category/CategoryListPageCommon';

const message = defineMessages({
    objectName: 'Loại',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
    home: 'Trang chủ',
    category: 'Vai trò dự án',
});

const CategoryListPage  = () => {
    const translate = useTranslate();
    const kindProjectRole = categoryKinds.CATEGORY_KIND_ROLE;

    return (
        <CategoryListPageCommon
            routes={[
                { breadcrumbName: translate.formatMessage(message.category) },
            ]}
            kind={kindProjectRole}
        />
    );
};
export default CategoryListPage;
