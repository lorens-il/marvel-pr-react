import { Component } from 'react/cjs/react.production.min';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


class RandomChar extends Component {

    state = { // поля классов, просто опускаем зис
        char: {},
        loading: true,
        error: false,
        imgNotFound: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    }

    marvelService = new MarvelService();

    onCharLoaded = (char) => {

        if(char.description.length >= 170) {
            char.description = `${char.description.slice(0, 170)}...`
        } else if (!char.description) {
            char.description = 'DESCRIPTION NOT FOUND';
        }

        this.setState({
            char,
            loading: false,
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });

    }

    updateChar = () => {
        this.setState({
            loading: true,
            error: false,
        })
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);  

    }

    componentDidMount() {
        this.updateChar();
    }

    render () {

        const {char, loading, error, imgNotFound} = this.state;
        const errorMessage = error ? <ErrorMessage/> : false;
        const spinner = loading ? <Spinner/> : false
        const content = !(loading || error) ? <View char={char} imgNotFound={imgNotFound}/> : false
        
        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={this.updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char, imgNotFound}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" style={thumbnail === imgNotFound ? {objectFit: 'fill'} : {}} className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;