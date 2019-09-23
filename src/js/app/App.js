import React, {Component} from 'react';
import Person from './Person/Person';

class App extends Component {
    render() {
        return (
            <div className="app">
                <h1>React App</h1>
                <Person />
            </div>
        );
    }
}

export default App;
