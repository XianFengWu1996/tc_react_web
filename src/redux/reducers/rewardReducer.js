const initState = {
    point: 0,
    pointDetails: [],
    pointApply: 0,
  };
  
  const rewardReducer = (state = initState, action) => {

      switch(action.type){
        case 'get_reward':
            return {
                ...action.reward
            } 
        case 'set_reward':
            return {
                ...state,
                point: action.reward.point,
                pointDetails: action.reward.pointDetails,
                pointApply: 0
            }
        case 'apply_point':
            return {
                ...state,
                pointApply: action.point
            }
        case 'reward_logout':
            return {
                ...initState
            }
        default: 
            return state;
      }
  }
  
  export default rewardReducer;