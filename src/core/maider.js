"use strict";

import { useSelector } from "react-redux";
import { includesArray } from "../store/input/input.js"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Result } from "../store/result/result.js";

function EN(U, E, H, N1, N2){
    let ENT = 0,
        ENK = 0,
        ENV = 0

    for (let i = N1; i < N2; i++){
        ENK += 0.5*H[i]*Math.pow(((U[i+1] + U[i])/2), 2)
        ENV += H[i]*E[i]
        ENT = ENK + ENV
    }
    return {"ENK": ENK, "ENV": ENV, "ENT": ENT}
}
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
    const E0 = parseFloat(input["Начальная энергия"]),
        RO0 = parseFloat(input["Начальная плотность"]),
        P0 = parseFloat(input["Начальное давление"]),
        M = parseInt(input["M"]) > 50000 ? 50000 : parseInt(input["M"]),
        k = parseFloat(input["k"]),
        L0 = parseFloat(input["L0"]),
        AKR = parseFloat(input["AKR"]),
        TLIM = parseFloat(input["Условие по времени"]),
        border = M - 1,
        fictiv = M,
        preBorder = M - 2,
        AKV = 0.6,
        AKL = 0.3


        const U = [0],
        X = [0],
        P = [],
        E = [],
        Q = [],
        H = [],
        RO = [RO0],
        ENK = [],
        ENV = [],
        ENT = [],
        disb = [],
        time = [],
        last_M_V = [],
        P_0M = []

    const DX = L0 / (M - 2),
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
    E[M - 1] = 0
    const X0 = [...X]

    let DT = 10000,
        T = 0 
    
    while (true){
        const DTSEL = [],
            U1 = [0],
            C = [0]
 
        for (let i = 1; i < (M - 1); i++){
            C.push(Math.sqrt(k*P[i]/RO[i]))
            DTSEL.push(AKR*H0/(RO[i]*C[i]))
        }

        DT = Math.min.apply(null, DTSEL)
        T+=DT
        if (!DT || DT <= 0){
            break
        }

        for (let i = 0; i < (M - 1); i++){
            Q[i] = 0
            const deltu = U[i+1] - U[i]
            if (deltu < 0){
                Q[i] = AKV*RO[i]*Math.pow(deltu, 2) - AKL*RO[i]*C[i]*deltu
            }
        }
        
        for (let i = 1; i < (M); i++){
            
            if (X[i] <= L0*3){
                U1.push(U[i] - DT * (P[i] + Q[i] - P[i-1] - Q[i-1]) / (0.5*(H[i] + H[i - 1])))
            } else {
                U1.push(0)
            }
        }

        for (let i = 0; i < (M-1); i++){
            if(i === 0){
                const PRIGHT = (P[i]*H[i+1] + P[i+1]*H[i])/(H[i+1] + H[i]) ,
                PLEFT = 0 ,
                QRIGHT = 0.5 * (Q[i] + Q[i+1]) ,
                QLEFT = 0.5 * (Q[i] + 0) ,
                DPUDM = (U[i+1]*(PRIGHT + QRIGHT) - U[i]*(PLEFT + QLEFT))/H[i] ,
                UDKPR = 0.5*Math.pow(((U[i+1] + U[i])/2), 2) ,
                UDKPS = 0.5*Math.pow(((U1[i+1] + U1[i])/2), 2) 
                //console.log(PRIGHT, PLEFT, QLEFT, QRIGHT, DPUDM, UDKPR, UDKPS)
                E[i] = -DT*DPUDM + E[i] + UDKPR - UDKPS
                continue
            }
            const PRIGHT = (P[i]*H[i+1] + P[i+1]*H[i])/(H[i+1] + H[i]) ,
                PLEFT = (P[i - 1]*H[i] + P[i]*H[i-1])/(H[i-1] + H[i]) ,
                QRIGHT = 0.5 * (Q[i] + Q[i+1]) ,
                QLEFT = 0.5 * (Q[i] + Q[i-1]) ,
                DPUDM = (U[i+1]*(PRIGHT + QRIGHT) - U[i]*(PLEFT + QLEFT))/H[i] ,
                UDKPR = 0.5*Math.pow(((U[i+1] + U[i])/2), 2) ,
                UDKPS = 0.5*Math.pow(((U1[i+1] + U1[i])/2), 2) 
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
        let EnergyParameters = EN(U, E, H, 0, M-1)
        ENK.push(EnergyParameters["ENK"])
        ENV.push(EnergyParameters["ENV"])
        ENT.push(EnergyParameters["ENT"])
        disb.push((ENV[0] - (EnergyParameters["ENV"] + EnergyParameters["ENK"]))/ENV[0])
        time.push(T)
        last_M_V.push(U[U.length - 1])
        P_0M.push(P[0])
        if (T > TLIM){
            console.log(T)
            break
        }
    }
    console.log(`X: ${X}`,`U: ${U}`,`P: ${P}`,`RO: ${RO}`,`H: ${H}`,`E: ${E}`, `Q: ${Q}`)
    return {
            "message": "Успешно",
            "result": {
                "X": X,
                "U": U,
                "P": P,
                "RO": RO,
                "H": H,
                "E": E,
                "X0": X0,
                "Q":Q,
                "ENK": ENK,
                "ENT": ENT,
                "ENV": ENV,
                "disb": disb,
                "time":time,
                "last_M_V": last_M_V,
                "P_0M": P_0M
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