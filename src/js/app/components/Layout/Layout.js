import React from 'react';
import Auxiliar from '../../hoc/Auxiliar';

const layout = (props) => (
    <Auxiliar>
        <main className="content">
            {props.children}
        </main>
    </Auxiliar>
);

export default layout;