import React from 'react';
import "./charts.css"
import { useSelector } from 'react-redux';
import Line from '../line/lineChart.js';

function Charts(props){
    const VALUES = useSelector((state) => state.Result)
    
    return (
        <div className='charts-container'>
            {
                props.condition !== "Успешно" ?
                (
                    <h2 className='error-message'>
                        {props.condition}
                    </h2>
                )
                :
                Object.keys(VALUES).map((parameter) => {
                    const CFG = {"id": `#${parameter}`,
                        "colors": {[parameter]:{"color": "#5C67C8"}},
                        "legendHeight": 0,
                        "mt": 30,
                        "ml": 50,
                        "mr": 5,
                        "mb": 25,
                        "is_time": false,
                        "strokeWidth": 1.5,
                        "strokeColor": "#5E5C5C",
                    }
                    return (
                        <div className='chart'>
                            <h3>{parameter}</h3>
                            <div className='chart-container' id={parameter}>
                                <Line data={[{"key":parameter, "values": VALUES[parameter].map((value, idx) => {
                                    return {x: VALUES["X0"][idx], value: value}
                                })}]} conf={CFG} />
                            </div> 
                        </div>   
                    )
                })
            }
        </div>
        )
}

export default Charts
