import React from 'react';
import ReactDOM from 'react-dom';
import D3Line from './D3Line.js'
import * as d3 from "d3";
import $ from 'jquery';
//{"id": "#common-oee-graph",
    //"colors": {"OEE":{"color": "#5C67C8"}},
    //"legendHeight": 0,
    //"mt": -10,
    //"ml": 0,
    //"is_time": false,
//}
class Line extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            chart: [],
            width: props.screenWidth
        }
    }
    componentDidMount() {
        this._chart = D3Line.create(
            this._rootNode,
            this.props.data,
            this.props.conf
        );
        if (typeof this._chart != "undefined"){
            this.setState({
                ...this.state,
                "chart": this._chart
                })
        }
    }

    componentDidUpdate() {
        if (this.props.screenWidth !== this.state.width){
            D3Line.destroy(this._rootNode);
            this._chart = D3Line.create(
                this._rootNode,
                this.props.data,
                this.props.conf
            );
            if (typeof this._chart != "undefined"){
                this.setState({
                    ...this.state,
                    "chart": this._chart})
            }
            this.setState({
                ...this.state,
                "width": this.props.screenWidth
            })
            return
        }
        D3Line.update(
           this._rootNode,
           this.props.data,
           this.props.conf,
           this.state.chart
        );

    }

    componentWillUnmount() {
        D3Line.destroy(this._rootNode);
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
    return <div className="line-chart-container" ref={this._setRef.bind(this)} />
    }
}

export default Line