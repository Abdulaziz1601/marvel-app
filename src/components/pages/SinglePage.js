import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ Component, dataType }) => {
    const {id} = useParams();
    const [data, setData] = useState(null);

    const {loading, error, clearError, getCharacter, getComic} = useMarvelService();

    useEffect(() => {
        updateData();
    }, [id]);

    const onDataLoaded = (data) => {
        setData(data);
    }   

    const updateData = () => {
        clearError();

        switch (dataType) {
            case 'comic':
                getComic(id).then(onDataLoaded);
                break;
            case 'character':
                getCharacter(id).then(onDataLoaded);
                break;
        };
    }
    
    const errorMessage = error ? <Error /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(error || loading || !data) ? <Component data={data} /> : null;

    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    );
};

export default SinglePage;