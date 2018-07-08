function updaterFactory(initialState, handlers) {
    return function reducer(state = initialState) {
      return (action) => {
        if (handlers.hasOwnProperty(action.type)) {
          return handlers[action.type](state, action)
        }
        return state
      }
    }
}

export default updaterFactory
