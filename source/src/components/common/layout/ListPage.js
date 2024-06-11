import { Card, Flex, Spin } from 'antd';
import React from 'react';

import styles from './ListPage.module.scss';

function ListPage({ searchForm, actionBar, baseTable, loading = false, children, title, style, button, info }) {
    return (
        <Card className={styles.baseListPage} style={style}>
            <Spin spinning={loading}>
                <div className={styles.title}>{title}</div>
                <div className={styles.baseListPageList}>
                    {searchForm}
                    {/* <Flex justify="end">{button}</Flex> */}
                    <Flex justify="space-between" align="center">
                        <div className={styles.title}>{info}</div>
                        <div className={styles.actionBar}>{button}</div>
                    </Flex>
                    <div className={styles.actionBar}>{actionBar}</div>
                    <div className={styles.actionBar}>{baseTable}</div>
                </div>
                {children}
            </Spin>
        </Card>
    );
}

export default ListPage;
