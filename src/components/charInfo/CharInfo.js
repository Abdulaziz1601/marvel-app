import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

class CharInfo extends Component {

    state = {
		char: null,
        loading: false,
        error: false
	}

	marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }
    componentDidUpdate(prevProps, prevState) {
        // this.updateChar(); // when qw have new prop in our component, our component rerenders, and componentDIdUpd, is envoked
        // However here infinite loop happens 'cause we're updating state recursively
        // by accident when updateChar is invoked it invokes onCharLoading which means state is updated
        // that means our component will rerender 'cause of this.setState()
        // it leads to componendDidUpdate invoking, this means we are in a reacursive infinite loop -> ERROR
        if(this.props.charId !== prevProps.charId ) {
            this.updateChar();
        }

        console.log("Prevprop", prevProps, 'NewProps', this.props);

    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
        this.foo.bar = 0;
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        });
    }

    onError = () => {
        this.setState({
            error: true
        });
    }
    
    render() {
        const { char, loading, error} = this.state;
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
        )
    }
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

export default CharInfo;