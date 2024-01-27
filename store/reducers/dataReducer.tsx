import { GET_SAMPLE, SAMPLE_ERROR } from "../types";
interface initialState{
   data:Array<string>;
   loading:boolean;
}

const initialState = {
  data: [],
  loading: true,
};

const dataReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case GET_SAMPLE:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    case SAMPLE_ERROR:
      return {
        data: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dataReducer;