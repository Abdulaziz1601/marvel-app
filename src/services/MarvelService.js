class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public';
    _apiKey = 'apikey=c5a7eac44dedf91b998fe8834a0c12fc';
    // _apiKey = 'apikey=c5d6fc8b83116d92ed468ce36bac6c62';

    getResource = async (url) => {  
        let res = await fetch(url);

        if (!res.ok) throw new Error(`Could not fetch ${url}, status: ${res.status}`);

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}/characters?limit=9&offset=210&${this._apiKey}`);
            return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}/characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
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
}

// const marvelService = new MarvelService();

// marvelService.getAllCharacters();

export default MarvelService;
