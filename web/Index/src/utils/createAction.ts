interface Action {
  type: string;
  payload?: any;
  callback?: (payload: any) => void;
  [key: string]: any;
}

export const createAction = (type: string) => (
  payload?: any,
  callback?: (payload: any) => void,
): Action => ({
  type,
  payload,
  callback,
});
