function commonReducerFunc(identifier) {
  const commonReducer = (state = {
    type: '',
    error: '',
    isFetching: false,
    //didInvalidate: false,
    lookUpData: []
  }, action) => {
    switch (action.type) {
      case `${identifier}_INIT`:
        return Object.assign({}, state, {
          isFetching: true,
          type: action.type,
          lastUpdated: action.receivedAt,
        });
      case `${identifier}_SUCCESS`:
   
        return Object.assign({}, state, {
          error: '',
          isFetching: false,
          type: action.type,
          //didInvalidate: false,
          lookUpData: action.data,
          lastUpdated: action.receivedAt,
        });
      case `${identifier}_ERROR`:
        return Object.assign({}, state, {
          isFetching: false,
          type: action.type,
          error: action.error,
          lookUpData: [],
          lastUpdated: action.receivedAt
        });

    }
    return state;
  }
  return commonReducer
}

export default commonReducerFunc;