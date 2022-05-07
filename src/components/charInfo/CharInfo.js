import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';
import { Link } from 'react-router-dom';

const CharInfo = ({charId}) => {

    const [char, setChar] = useState(null);
    
	const {loading, error, getCharacter, clearError, process} = useMarvelService();

    useEffect(() => {
        console.log(charId);
        updateChar();
    }, [charId]); // when charId will change our useEffect will be envoked 

    const updateChar = () => {
        if (!charId) {
            return;
        }

        clearError();   

        getCharacter(charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const setContent = (process, char) => {
        switch(process) {
            case 'waiting':
                return <Skeleton />
                break;
            case 'loading':
                return <Spinner />
                break;
            case 'confirmed':
                return <View char={char} />;
                break;
            case 'error':
                return <Error />;
                break;
            default:
                throw new Error("Unexpected process state");
        }
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
                            <Link to={`comics/${comicsId}`}>{item.name}</Link>
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