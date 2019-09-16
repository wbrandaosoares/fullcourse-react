import axios from 'axios';
import '../css/main.scss';

class Api {
    static async getUserInfo(userName) {
        try {
            const response = await axios.get(`https://api.github.com/users/${userName}`);
            console.log(response);
            
        } catch(error) {
            console.warn('Erro na api');
        }
    }
}

Api.getUserInfo('diego3g');