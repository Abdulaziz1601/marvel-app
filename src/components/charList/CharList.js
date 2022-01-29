import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Error from '../error/Error'
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);

    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false); 

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded);
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }
        setCharList((chars) => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset+9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // THis method is created for optimisation, bad practice to junk
    // our code with big statement

    function renderItems (arr) {
        const items = arr.map(({name, thumbnail, id}, index) => {
            const clazz = thumbnail.includes('not_available') ? 'img_fix' : null;
            return (
                <li 
                    className="char__item"
                    key={id}
                    tabIndex={0}
                    ref={el => itemRefs.current[index] = el}
                    onClick={() => {
                        props.onCharSelected(id);
                        focusOnItem(index)
                    }}
                    onKeyPress={(e) => {
                        if(e.key === 'Enter' || e.key === ' ') {
                            props.onCharSelected(id);
                            focusOnItem(index)
                        }
                    }}>
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

    const items = renderItems(charList);

    const errorMessage = error ? <Error/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset, false)}
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