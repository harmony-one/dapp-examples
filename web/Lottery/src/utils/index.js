import router from 'umi/router';
export { connect } from 'dva';
export const createAction = type => payload => ({ type, payload });
export { router };
