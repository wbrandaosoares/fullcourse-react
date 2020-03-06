import React from 'react';
import buildControls from '../BuildControls';

const buildControl = (props) => (
    <div className="build-control">
        <div className="label">{props.label}</div>
        <button className="less">Less</button>
        <button className="more">More</button>
    </div>
);

export default buildControl;