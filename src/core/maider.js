import { useSelector } from "react-redux";
import { includesArray } from "../store/input/input.js"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Result } from "../store/result/result.js";

function init(value){
    if (!includesArray(value, ["M", "L0", "k", "Начальное давление", "Начальная плотность", "AKR", "Условие по времени"])){
        return {isError:true, message: "Не полный ввод данных"}
    }
    return {isError:false, message: "Успешно"}
}

function CalculateMaider(input){
    const INIT_STATUS = init(Object.keys(input))

    if (INIT_STATUS.isError){
        return {
            "message": INIT_STATUS.message,
            "result": {}
        }
    }
    const E0 = input["Начальная энергия"],
        RO0 = input["Начальная плотность"],
        P0 = input["Начальное давление"],
        M = input["M"],
        k = input["k"],
        L0 = input["L0"],
        AKR = input["AKR"],
        TLIM = input["Условие по времени"]

    const U = [0],
        X = [0],
        P = [],
        E = [],
        Q = [],
        H = [],
        RO = [RO0]

    const DX = L0 / (M - 1),
        H0 = RO0 * DX

    
    for (let i = 1; i < (M); i++){
        U.push(0)
        X.push(DX*(i))
    }
    
    for (let i = 0; i < (M - 1); i++){
        RO.push(RO0)
        P.push(P0)
        E.push(E0)
    }
    
    for (let i = 0; i < (M); i++){
        Q.push(0)
        H.push(H0)
    }

    P[M - 1] = 0
    RO[M - 1] = 0

    const X0 = [...X]

    let DT = 10000,
        T = 0 
    
    while (true){
        const DTSEL = [],
            U1 = [0],
            C = [0]
 
        for (let i = 1; i < (M - 2); i++){
            C.push(Math.sqrt(Math.abs(P[i])/Math.abs(RO[i])))
            DTSEL.push(AKR*H0/(RO[i]*C[i]))
        }
        DT = Math.min.apply(null, DTSEL)
        T += DT

        if (!DT || DT <= 0){
            break
        }

        for (let i = 0; i < (M); i++){
            Q[i] = 0
        }

        for (let i = 1; i < (M); i++){
            U1.push((U[i] - DT * (P[i] + Q[i] - P[i-1] - Q[i-1])) / (0.5*(H[i] + H[i - 1])))
        }

        for (let i = 1; i < (M); i++){
            if (i === M - 1){
                const PRIGHT = 0,
                PLEFT = (P[i - 1]*H[i])/(H[i-1] + H[i]),
                QRIGHT = 0,
                QLEFT =  0,
                DPUDM = U[i]*(PLEFT + QLEFT)/H[i],
                UDKPR = Math.pow(0.5*((U[i])/2), 2),
                UDKPS =  Math.pow(0.5*((U1[i])/2), 2)
                //console.log(PRIGHT, PLEFT, QLEFT, QRIGHT, DPUDM, UDKPR, UDKPS)
                E[i] = -DT*DPUDM + E[i] + UDKPR - UDKPS
                continue
            }
            const PRIGHT = (P[i]*H[i+1] + P[i+1]*H[i])/(H[i+1] + H[i]) ,
                PLEFT = (P[i - 1]*H[i] + P[i]*H[i-1])/(H[i-1] + H[i]) ,
                QRIGHT = 0.5 * (Q[i] + Q[i+1]) ,
                QLEFT = 0.5 * (Q[i] + Q[i-1]) ,
                DPUDM = (U[i+1]*(PRIGHT + QRIGHT) - U[i]*(PLEFT + QLEFT))/H[i] ,
                UDKPR = Math.pow(0.5*((U[i+1] + U[i])/2), 2) ,
                UDKPS = Math.pow(0.5*((U1[i+1] + U1[i])/2), 2) 
                //console.log(PRIGHT, PLEFT, QLEFT, QRIGHT, DPUDM, UDKPR, UDKPS)
                E[i] = -DT*DPUDM + E[i] + UDKPR - UDKPS
        }

        for (let i = 0; i < (M); i++){
            X[i] = X[i] + DT * U1[i]
        }

        for (let i = 0; i < (M - 1); i++){
            RO[i] = H[i] / (X[i + 1] - X[i]) 
        }

        for (let i = 1; i < (M); i++){
            U[i] = U1[i]
        }

        for (let i = 0; i < (M - 1); i++){
            P[i] = RO[i]*E[i]*(k-1)
        }
        if (T > TLIM){
            break
        }
    }
    console.log(`X: ${X}`,`U: ${U}`,`P: ${P}`,`RO: ${RO}`,`H: ${H}`,`E: ${E}`)
    return {
            "message": "Успешно",
            "result": {
                "X": X,
                "U": U,
                "P": P,
                "RO": RO,
                "H": H,
                "E": E,
                "X0": X0
            }
        }
}

export function Maider(props){
    const [condition, setCondition] = useState(null),
        dispatch = useDispatch(),
        INPUT = useSelector((state) => state.Input.active)

    useEffect(() => {
        const result = CalculateMaider(INPUT)
        setCondition(result.message)
        Object.keys(result.result).forEach((key) => {
            dispatch(Result.actions.setValue({
                key: key,
                value: result.result[key]
            }))
        })
    }, [Object.values(INPUT)])
    
    return (
        <>
            {props.children.map((child) => React.cloneElement(child, {condition: condition}))}
        </>
        )
}