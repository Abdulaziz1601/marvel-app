import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error'
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

    // state = {
    //     chars:[],
    //     error: false,
    //     loading: true,
    //     newItemLoading: false,
    //     offset: 210,
    //     charEnded: false
    // }

    const [chars, setChars] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false); 

    const marvelService = new MarvelService();

    // componentDidMount() {
    //     this.onRequest();
    // }
    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError);
    }
 
    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }
        setChars((chars) => [...chars, ...newChars]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset+9);
        setCharEnded(ended);
        // this.setState(({chars, offset}) => ({
        //     chars: [...chars, ...newChars],
        //     loading: false,
        //     newItemLoading: false, 
        //     offset: offset + 9,
        //     charEnded: ended
        // }));
    }

    const onError = () => {
        setError(true);
        setLoading(false)
    }

    const handleSelect = (e, id) => {
        props.onCharSelected(id);
        document.querySelectorAll('.char__item').forEach(item => {
            if (item.classList.contains('char__item_selected')) {
                item.classList.remove('char__item_selected');
            }
        });
        
        if (e.target.parentElement.classList.contains('char__item') && !e.target.parentElement.classList.contains('char__item_selected') ) {
            e.target.parentElement.classList.add('char__item_selected');
        }
    }

    // THis method is created for optimisation, bad practice to junk
    // our code with big statement

    const renderItems = (arr) => {
        const items = arr.map(({name, thumbnail, id}, index) => {
            const clazz = thumbnail.includes('not_available') ? 'img_fix' : null;
            return (
                <li 
                    className="char__item"
                    key={id}
                    onClick={(e) => handleSelect(e, id)}
                    tabindex={index}>
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
    let items = renderItems(chars);

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
                onClick={() => onRequest(offset)}
                style={{'display': charEnded ? "none": 'block'}}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}
export default CharList;