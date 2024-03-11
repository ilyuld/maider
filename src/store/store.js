import { combineReducers, configureStore } from "@reduxjs/toolkit";
import Input from './input/input.js'
import Result from "./result/result.js";
const rootReducers = combineReducers({
    Input,
    Result
})
const store = configureStore({
    reducer: rootReducers
});

export default store;