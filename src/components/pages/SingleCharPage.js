import { useParams } from 'react-router-dom';
import AppBanner from '../appBanner/AppBanner';
import { useState, useEffect } from 'react';

import img from '../../resources/img/thor.jpeg'
import './singleCharPage.scss';
import useMarvelService from '../../services/MarvelService';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';

function SingleCharPage() {
    const { charId }  = useParams();
    const [char, setChar] = useState(null);

    const {loading, error, clearError, getCharacter} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [charId])
    

    const onCharLoaded = (char) => {
        setChar(char);
    };
    
    const updateChar = () => {
        clearError();

        getCharacter(charId)
            .then(onCharLoaded);
    };
    const errorMessage = error ? <Error /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(error || loading || !char) ? <View char={char} /> : null;
    
    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    );
}

const View = ({ char }) => {
    const { name,  fullDescription, thumbnail} = char;

    return (
        <div className="single-char">
            <div className="single-char__img">
                <img src={thumbnail} alt={""} />
            </div>
            <div className="single-char__wrapper">
                <div className="single-char__name">{name}</div>
                <div className="single-char__descr">{fullDescription}</div>
            </div>
        </div>
    )
}

export default SingleCharPage;
