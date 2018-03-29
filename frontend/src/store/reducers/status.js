const initialState = {
  isLoaded: false,
  isFetching: false,
  hasPendingChanges: false
};


const statusReducer = (state = initialState, action) => {
  switch (action.type) {
  default:
    return state;
  }
};

export default statusReducer;
