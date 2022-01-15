import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error'
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    state = {
        chars:[],
        error: false,
        loading: true,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }
 
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }
        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false, 
            offset: offset + 9,
            charEnded: ended
        }));
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
                    key={id}
                    onClick={() => this.props.onCharSelected(id)} >
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

    // onNewCharsLoaded = () => {
    //     this.setState((state) => {
    //         return {
    //             limit: state.limit*2,
    //             loading: true
    //         }
    //     })
    // }

    // componentDidUpdate(_, prevState) {
    //     if(this.state.limit !== prevState.limit) {
    //         this.marvelService.getAllCharacters(this.state.limit)
    //         .then(this.onCharsLoaded)
    //         .catch(this.onError);
    //     }
    // }

    

    render() {
        const {chars, error, loading, newItemLoading, offset, charEnded} = this.state;

        let items = this.renderItems(chars);

        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;
        // const newContentSpinner = newItemLoading ? "Loading..." : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                {/* {newContentSpinner} */}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? "none": 'block'}}>
                        <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,

}
export default CharList;