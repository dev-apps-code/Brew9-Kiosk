export const KSERVERURL = 'https://app.brew9.co/api';
export const KURL_INFO = 'https://app.brew9.co/info';
//export const KSERVERURL ='http://localhost:3000/api'
//export const KURL_INFO ='http://localhost:3000/info'
// export const KSERVERURL ='https://3358a428.ngrok.io/api'
// export const KURL_INFO = 'https://3358a428.ngrok.io/info'

export const KURL_TERMS_OF_SERVICE = KURL_INFO + '?page=terms_conditions';
export const KURL_PRIVACY_POLICY = KURL_INFO + '?page=privacy';
export const KURL_EULA = KURL_INFO + '?page=eula';

export const KCURRENT_API_VERSION_HEADER = 'application/dc.v7';

export const KTIMEOUT = 3 * 1000;

export function encodeForFormData(details) {
  let formBody = [];
  for (const property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  }
  formBody = formBody.join('&');
  return formBody;
}
