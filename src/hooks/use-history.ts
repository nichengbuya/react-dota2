import { useReducer } from "react";

const initialState = {count: 0};

function reducer(state: { count: number; }, action: { type: any; }) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

export default function useHistory() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
      state,
      dispatch
  };
}