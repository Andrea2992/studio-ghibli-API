import TextLimiter from '../text-limiter/TextLimiter';
import { deleteFavoriteToLocalStorage, saveFavoriteToLocalStorage } from '../util/util';
import './FilmItem.css';
import { HeartTwoTone, HeartFilled } from '@ant-design/icons';


export default function FilmItem({ film, onFavoriteListUpdate, onFavoriteValueUpdate, onFavoriteDelete }) {

    const { id, title, image, description, director, producer, releaseDate, runningTime, score, heartIcon, visibility } = film;

    if (visibility === false) {
        return
    } else {
        return (

            <div className='card-properties'>
                <div className='heart-position'>
                    {heartIcon === true ? (
                        <HeartTwoTone
                            style={{ fontSize: '30px' }}
                            onClick={() => {
                                onFavoriteValueUpdate(id)
                                onFavoriteListUpdate(id)
                                saveFavoriteToLocalStorage(id)
                            }}
                        />
                    ) : <HeartFilled
                        style={{ fontSize: '30px' }}
                        onClick={() => {
                            onFavoriteValueUpdate(id)
                            onFavoriteDelete(id)
                            deleteFavoriteToLocalStorage(id)
                        }}
                    />
                    }
                </div>
                <div className='card-image-container'>
                    <img className='card-image' alt={title} src={image}></img>
                </div>
                <div className='card-text-container'>
                    <ul className='card-content-container'>
                        <li><b>Title:</b> {title}</li>
                        <li><b>Description:</b> <TextLimiter text={description} /></li>
                        <li><b>Director:</b> {director}</li>
                        <li><b>Producer:</b> {producer}</li>
                        <li><b>Release Date:</b> {releaseDate}</li>
                        <li><b>Running Time:</b> {runningTime}</li>
                        <li><b>Score:</b> {score}</li>
                    </ul>
                </div>
            </div>

        );
    }
}