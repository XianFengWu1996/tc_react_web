const initState = {
    lunch: [],
    fullday: [],
    expiration: 0,
    storeTime: {
        lunchStart: 0,
        lunchEnds: 0,
        storeOpen: 0,
        storeClose: 0,
      }
}

const menuReducer = (state = initState, action) => {
    switch(action.type){
        case 'get_menu':
            return {
                ...action.menu
            }
        case 'reset_menu':
            return {
                ...initState
            }
        default:
            return state;
    }
}

export default menuReducer