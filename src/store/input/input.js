import { createSlice } from "@reduxjs/toolkit";

export function includesArray(array, checkArray){
    for (let checkValue of checkArray){
        if (!array.includes(checkValue)){
            return false
        }
    }
    return true
}

export const Input = createSlice({
    name: "Input",
    initialState: JSON.parse(localStorage.getItem('input')) || {"active": {}, "history": []},
    reducers: {
        setParameterValue: (state, action) => {
            state.history.push(state.active)
            if (state.history.length > 100){
                state.history.shift()
            }
            state.active[action.payload.name] = action.payload.value
            if (includesArray(Object.keys(state.active), ["Начальное давление", "Начальная плотность", "k"])){
                state.active["Начальная энергия"] = state.active["Начальное давление"] / 
                                                                            (state.active["Начальная плотность"]*(state.active["k"]-1))
            }
            localStorage.setItem("input", JSON.stringify(state))
        }
    }
})

export default Input.reducer