import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";

import decoration from '../../resources/img/vision.png';

class App extends Component {
    state = {
        exist: true
    }
    onComponentToggle = () => {
        this.setState((state) => {
            return {
                exist: !state.exist
            }
        })
    }
    render() {
        const {exist} = this.state;
        return (
            <div className="app">
                <AppHeader/>
                <main>
                    {exist ? <RandomChar/>  : null}
                    <button onClick={this.onComponentToggle}> Kill Component</button>
                    <div className="char__content">
                        <CharList/>
                        <CharInfo/>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }
}

export default App;