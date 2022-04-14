import { Banner } from 'types';

const INITIAL_STATE = {
  show: false,
  point: '',
  text: '',
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case Banner.SHOW:
      return {
        ...state,
        show: action.payload,
      };
    case Banner.TEXT:
      return {
        ...state,
        text: action.payload,
      };
    case Banner.POINT:
      return {
        ...state,
        point: action.payload,
      };
    case Banner.EMPTY:
      return {
        ...state,
        show: false,
        text: '',
        point: '',
      };
    default:
      return state;
  }
};
