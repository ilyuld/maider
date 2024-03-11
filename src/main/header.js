import React from 'react';
import './header.css';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '../store/input/input.js';

function Header(props){
    return(
        <div className='header-container'>
            <InputField name="L0" type="number" restrictions={{min: 0}}/>
            <InputField name="M" type="number" restrictions={{min: 0}}/>
            <InputField name="k" type="number" />
            <InputField name="Начальное давление" type="number" />
            <InputField name="Начальная плотность" type="number" />
            <InputField name="AKR" type="number" />
            <InputField name="Условие по времени" type="number" />
        </div>
    )
}

function InputField(props){
    const INPUT = useSelector((state) => state.Input.active), 
        dispatch = useDispatch(),
        dispatchInput = Input.actions,
        recordChangeParameters = (event) => {
            if (!event.target.value){
                return
            }
            dispatch(dispatchInput.setParameterValue({
                name: props.name,
                value: event.target.value
            }))
        }
    return (
        <div className='input-field-container'>
            <span>
                {`${props.name}: `}
            </span>
            <input type={props.type} value={INPUT?.[props.name] || 0} min={props?.restrictions?.min} max={props?.restrictions?.max} onChange={(e) => recordChangeParameters(e)}>
            </input>
        </div>
    )
}
export default Header
