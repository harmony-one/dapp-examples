import router from 'umi/router';
export { request } from './request';
export { connect } from 'dva';
export const createAction = type => payload => ({ type, payload });
export { router };
