import { InternetBanner } from 'types';

const INITIAL_STATE = {
  show: false,
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case InternetBanner.SHOW:
      return {
        ...state,
        show: action.payload,
      };
    default:
      return state;
  }
};
