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

    switchNameHandler = (name) => {
        this.setState({
            persons: [
                {name: name, age: 28},
                {name: "Manu", age: 29},
                {name: "Stephanie", age: 27}
            ]
        });
    }

    nameChangeHandler = (event) => {
        this.setState({
            persons: [
                {name: "Maxi", age: 28},
                {name: event.target.value, age: 26},
                {name: "Stephanie", age: 27}
            ]
        });
    }

    render() {
        const style = {
            backgroundColor: 'white',
            font: 'inherit',
            border: '1px solid blue',
            padding: '8px'
        };

        return (
            <div className="App">
                <h1>Hi, I'm a React App!!</h1>
                <p>This is really working!</p>
                <button style={style} onClick={() => this.switchNameHandler("Maximilian!!")}>Switch Name</button>
                <Person
                    name={this.state.persons[0].name}
                    age={this.state.persons[0].age}/>
                <Person
                    name={this.state.persons[1].name}
                    age={this.state.persons[1].age}
                    click={this.switchNameHandler.bind(this, "Max!!")}
                    changed={this.nameChangeHandler}>My work is done.</Person>
                <Person
                    name={this.state.persons[2].name}
                    age={this.state.persons[2].age}/>
            </div>
        );
    }
}

export default App;