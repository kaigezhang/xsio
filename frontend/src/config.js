/* eslint-disable */


const host = window.location.host.split(':')[0];
export const ROOT_URL = 'http://api.' + host + '/api/v1';

class Config {
    static get constants() {
        // return Object.freeze({API_URL: 'http://localhost:8090/api/v1'});
        return Object.freeze({API_URL: ROOT_URL});
    }

    static get notifications() {
        return {success: 'success', failure: 'failure'};
    }
}

export const constants = Config.constants;
export const notifications = Config.notifications;
