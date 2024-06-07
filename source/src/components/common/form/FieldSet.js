import classNames from 'classnames';
import React from 'react';

const FieldSet = ({ title, className, children }) => (
    <fieldset className={classNames(className,'custom-fieldset')}>
        <legend>
            <b>{title}</b>
        </legend>
        {children}
    </fieldset>
);

export default FieldSet;
