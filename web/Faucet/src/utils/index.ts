import router from 'umi/router';
export { connect } from 'dva';
export const createAction = (type: any) => (payload?: any) => ({ type, payload });
export { router };
