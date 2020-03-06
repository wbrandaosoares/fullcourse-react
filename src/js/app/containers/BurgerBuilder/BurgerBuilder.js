import React, {Component} from 'react';
import Auxiliar from '../../hoc/Auxiliar';
import Burger from '../../components/Burger/Burger';

class BurgerBuilder extends Component {
    
    state = {
        ingredients: {
            salad: 0,
            bacon: 1,
            cheese: 1,
            meat: 1
        }
    };

    render () {
        return (
            <Auxiliar>
                <Burger ingredients={this.state.ingredients} />
                <div>Build Controls</div>
            </Auxiliar>
        );
    }
}

export default BurgerBuilder;