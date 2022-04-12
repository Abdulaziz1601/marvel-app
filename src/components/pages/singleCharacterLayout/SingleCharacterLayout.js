import './singleCharacterLayout.scss';

const SingleCharacterLayout = ({ data }) => {
    const { name,  fullDescription, thumbnail} = data;

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

export default SingleCharacterLayout;
