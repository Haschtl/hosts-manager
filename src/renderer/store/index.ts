import { createStore } from 'redux';
import appReducer from './reducer';
// import * as actions from "./actions";

export default createStore(appReducer);

// export actions
