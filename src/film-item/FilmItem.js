import './FilmItem.css';
import'./FilmItemResponsive.css';
import { deleteFavoriteToLocalStorage, saveFavoriteToLocalStorage } from '../util/util';
import { HeartTwoTone, HeartFilled } from '@ant-design/icons';


export default function FilmItem({ film, onFavoriteListUpdate, onFavoriteValueUpdate, onFavoriteDelete }) {

    const { id, title, image, description, director, producer, releaseDate, runningTime, score, heartIcon, visibility } = film;

    if (visibility === false) {
        return
    } else {
        return (
            <div className='card-properties-container'>
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
                            <li><b>Title:</b> <span data-searchable>{title}</span></li>
                            <li><b>Description:</b> <span data-searchable>{description}</span></li>
                            <li><b>Director:</b> <span data-searchable>{director}</span></li>
                            <li><b>Producer:</b> <span data-searchable>{producer}</span></li>
                            <li><b>Release Date:</b> <span data-searchable>{releaseDate}</span></li>
                            <li><b>Running Time:</b> {runningTime}</li>
                            <li><b>Score:</b> {score}</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}