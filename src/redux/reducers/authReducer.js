const initState = {
    userId: '',
    email: '',
    cashReward: 0,
    cardReward: 0,
    requestKey: '',
    isAdmin: false,
    key: {}
}

const authReducer = (state = initState, action) => {
    switch(action.type){
        case 'get_user': 
            return {
                ...state,
                ...action.data
            }
        case 'auth_logout':
            return {
                ...initState,
            }

        default:
            return state;
    }
}

export default authReducer;