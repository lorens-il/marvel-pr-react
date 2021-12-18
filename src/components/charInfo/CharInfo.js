import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

class CharInfo extends Component {
    
    state = { // поля классов, просто опускаем зис
        char: '',
        loading: false,
        error: false,
        imgNotFound: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });

    }

    onCharLoaded = (char) => {

        this.setState({
            char,
            loading: false,
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
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
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    render() {
        const {char, loading, error, imgNotFound} = this.state;
        const skeleton = char || loading || error ? false : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : false;
        const spinner = loading ? <Spinner/> : false
        const content = !(loading || error || !char) ? <View char={char} imgNotFound={imgNotFound}/> : false

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

const View = ({char, imgNotFound}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={thumbnail === imgNotFound ? {objectFit: 'fill'} : {objectFit: 'cover'}}/>
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
                {comics.length === 0 ?  
                    <li key={0} className="char__comics-item">
                        <a href=' '>Comics not found with this character</a>
                    </li>
                        :
                    comics.map((item, i) => { 
                        if (i >= 10) return;    // если много объектов лучше использовать обычный цикл с break
                        return (<li key={i} className="char__comics-item">
                                <a href=' '>{item.name}</a>
                                </li>)
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number.isRequired
}

CharInfo.defaultProps = {
    charId: 1009227
}

export default CharInfo;