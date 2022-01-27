import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = ({charId}) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    
	const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, []);

    useEffect(() => {
        console.log(charId);
        updateChar();
    }, [charId]); // when charId will change our useEffect will be envoked 

    // componentDidUpdate(prevProps, prevState) {
    //     // updateChar(); // when we have new prop in our component, our component rerenders, and componentDIdUpd, is envoked
    //     // However here infinite loop happens 'cause we're updating state recursively
    //     // by accident when updateChar is invoked it invokes onCharLoading which means state is updated
    //     // that means our component will rerender 'cause of setState()
    //     // it leads to componendDidUpdate invoking, this means we are in a reacursive infinite loop -> ERROR
    //     if(props.charId !== prevProps.charId ) {
    //         updateChar();
    //     }

    //     // console.log("Prevprop", prevProps, 'NewProps', props);

    // }

    const updateChar = () => {
        if (!charId) {
            return;
        }

        setLoading(true);

        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
        
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false)
    }

    const onError = () => {
        setError(true);
    }
    
    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <Error/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;
    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );
}

const View = ({char}) => {
    const {thumbnail, name, homepage, wiki, description, comics} = char;

    const comicsItems = 
        typeof comics !== 'string' 
        ? comics.map((item, i) => {
                if (i >= 10) return null;
                const comicsId = item.resourceURI.match(/comics\/(\d+)/)[1];
                return (
                    <li 
                        className="char__comics-item"
                        key={comicsId}>
                            {item.name}
                    </li>
                )
        })
        : <li>{comics}</li>;
        
    const clazz = thumbnail.includes('not_available') ? 'img_fix' : null;
    
    return (
       <>
            <div className="char__basics">
                    <img 
                        src={thumbnail}
                        alt={name}
                        className={clazz}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comicsItems}
                </ul>
       </> 
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number 
    
}

export default CharInfo;