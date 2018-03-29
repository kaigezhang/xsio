import React from 'react';

export function trackError(error) {
    if (process.env.NODE_ENV === 'production') {
        // trackJsError(error);
        console.error(error);
    } else {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}

export function log(...args) {
    if (process.env.NODE_ENV === 'production') {
        // TODO add error log service
        console.log(...args);
    } else {
        // eslint-disable-next-line no-console
        console.log(...args);
    }
}
