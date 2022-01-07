import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error'
import './charList.scss';

class CharList extends Component {

    state = {
        chars:[],
        error: false
    }
    marvelService = new MarvelService();

    onCharsLoaded = (chars) => {
        this.setState({chars});
    }
    onError = () => {
        this.setState({
            error: true
        })
    }
    updateAllChars = () => {
        this.marvelService.getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }
    componentDidMount() {
        this.updateAllChars(); // getting all chars right after coponent creation
    }
    render() {
        const {chars, error} = this.state;
        if(error) {
            return <Error/>
        }
        const charItems = chars.map(({name, thumbnail}, i) => {
                const clazz = thumbnail.includes('not_available') ? 'img_fix' : null;
                return (
                    <li className="char__item" key={i}>
                        <img src={thumbnail} alt={`character of ${name}`} className={clazz}/>
                        <div className="char__name">{name}</div>
                    </li>
                )
            });
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {charItems}
                    {/* <li className="char__item">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li>
                    <li className="char__item char__item_selected">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li> */}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;