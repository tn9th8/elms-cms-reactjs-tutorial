import { notification } from 'antd';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
    message: {
        success: {
            id: 'hooks.useNotification.message.success',
            defaultMessage: 'Success',
        },
        info: {
            id: 'hooks.useNotification.message.info',
            defaultMessage: 'Info',
        },
        error: {
            id: 'hooks.useNotification.message.error',
            defaultMessage: 'Error',
        },
        warning: {
            id: 'hooks.useNotification.message.warning',
            defaultMessage: 'Warning',
        },
    },
});

export default function useNotification({ placement = 'topRight', duration = 2 } = {}) {
    const intl = useIntl();

    return ({ type = 'success', message, title, onClose }) => {
        notification[type]({
            message: title || intl.formatMessage(messages.message[type]),
            description: message,
            placement,
            duration,
            onClose,
        });
    };
}
