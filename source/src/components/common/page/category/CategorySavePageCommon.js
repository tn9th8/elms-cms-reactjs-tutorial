import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import CategoryFormCommon from './CategoryFormCommon';

function CategorySavePageCommon({
    breadcrumb,
    apiConfig,
    getListUrl,
    kind,
    fieldsName = {
        image: 'categoryImage',
        name: 'categoryName',
        description: 'categoryDescription',
    },
}) {
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.getDetail,
            create: apiConfig.create,
            update: apiConfig.update,
        },
        options: {
            getListUrl,
            objectName: 'category',
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    parentId: null,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    categoryKind: kind,
                    categoryOrdering: 0,
                    parentId: null,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[ { breadcrumbName: title } ]}
            title={title}
        >
            <CategoryFormCommon
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
                fieldsName={fieldsName}
            />
        </PageWrapper>
    );
}

export default CategorySavePageCommon;
