import { browserName, fullBrowserVersion, osName, osVersion, deviceType, mobileVendor, mobileModel } from 'react-device-detect';

const { userAgent } = navigator as NavigatorID;
/* eslint-disable */
export const CLIENT_SYSTEM_INFO = {
    browser: browserName,
    browser_version: fullBrowserVersion,
    os: osName,
    os_version: osVersion,
    device: deviceType,
    mobile_vendor: mobileVendor,
    mobile_model: mobileModel,
    user_agent: userAgent,
};
/* eslint-enable */
