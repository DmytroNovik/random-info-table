const info = (state = [], action) => {
    switch (action.type) {
      case 'UPDATE_INFO':
        return state.find(item => item.id === action.data.id) === undefined ? [...state, action.data] : state
      case 'SET_FAVORITE':
        return state.map(item => item.id === action.data.id ? Object.assign(item, { favorite: !action.data.favorite }) : item)
      default:
        return state
    }
  }
  
  export default info