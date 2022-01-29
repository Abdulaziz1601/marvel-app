import { useEffect, useState } from 'react';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComiscList] = useState([]); 
    const [offset, setOffset] = useState(0);
    const [newComicsLoading, setNewComicsLoading] = useState(false);

    const {getAllComics, loading, error} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initital) => {
        initital ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded);
    }

    const onComicsLoaded = (newComics) => {
        setOffset(offset => offset + 8);
        setComiscList(comics => [...comics, ...newComics]);
        setNewComicsLoading(false);
    }

    const renderItems = (arr) => {
        const comicsList = arr.map((item, index) => {
            return (
                <li className="comics__item" key={index}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {comicsList}
            </ul>
        );
    }
    const content = renderItems(comicsList);
    const spinner = loading && !newComicsLoading ? <Spinner /> : null;
    const errorMessage = error ? <Error /> : null;
    const newComicsSpinner = newComicsLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
                {errorMessage}
                {spinner}
                {content}
                {newComicsSpinner}
            <button 
                className="button button__main button__long"
                onClick={() => onRequest(offset, false)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;