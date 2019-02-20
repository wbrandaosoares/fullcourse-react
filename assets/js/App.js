import React, { Component } from 'react';
import Person from './components/Person/Person';

class App extends Component {
    state = {
        persons: [
            {name: "Max", age: 28},
            {name: "Manu", age: 26},
            {name: "Stephanie", age: 29}
        ]
    }

    switchNameHandler = () => {
        this.setState({
            persons: [
                {name: "Maximilian", age: 28},
                {name: "Manu", age: 26},
                {name: "Stephanie", age: 27}
            ]
        });
    }

    render() {
        return (
            <div className="App">
                <h1>Hi, I'm a React App!!</h1>
                <p>This is really working!</p>
                <button onClick={this.switchNameHandler}>Switch Name</button>
                <Person name={this.state.persons[0].name} age={this.state.persons[0].age}/>
                <Person name={this.state.persons[1].name} age={this.state.persons[1].age}>My work is done.</Person>
                <Person name={this.state.persons[2].name} age={this.state.persons[2].age}/>
            </div>
        );
    }
}

export default App;