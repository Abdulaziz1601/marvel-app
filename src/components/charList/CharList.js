import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error'
import Spinner from '../spinner/Spinner';
import './charList.scss';

class CharList extends Component {
    state = {
        chars:[],
        error: false,
        loading: true
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
        .then(this.onCharsLoaded)
        .catch(this.onError);
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars,
            loading: false
        });
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // THis method is created for optimisation, bad practice to junk
    // our code with big statement

    renderItems(arr) {
        const items = arr.map(({name, thumbnail, id}) => {
            const clazz = thumbnail.includes('not_available') ? 'img_fix' : null;
            return (
                <li 
                    className="char__item"
                    key={id}>
                        <img src={thumbnail} alt={`character of ${name}`} className={clazz}/>
                        <div className="char__name">{name}</div>
                </li>
            )
        });
        // THis construction to center our spinner and errorMEssage
        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    }

    render() {
        const {chars, error, loading} = this.state;

        let items = this.renderItems(chars);

        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;