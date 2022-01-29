import {useHttp} from '../components/hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public';
    const _apiKey = 'apikey=c5a7eac44dedf91b998fe8834a0c12fc';
    // _apiKey = 'apikey=c5d6fc8b83116d92ed468ce36bac6c62';
    const _baseOffset = 210; 

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}/characters?limit=9&offset=${offset}&${_apiKey}`);
            return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}/characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}... ` : 'Sorry, no description available 😬' ,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.length ? char.comics.items : 'Sorry, no comics available 😭'
        };  
    } 

    return {loading, error, getAllCharacters, getCharacter, clearError};
}

// const marvelService = new MarvelService();

// marvelService.getAllCharacters();

export default useMarvelService;
