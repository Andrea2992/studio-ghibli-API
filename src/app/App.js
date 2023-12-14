import './App.css';
import { Layout, Tabs, ConfigProvider, Input } from 'antd';
import { BookOutlined, HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import FilmItem from '../film-item/FilmItem';
import { useEffect, useState } from 'react';


const { Header, Footer, Content } = Layout;

async function getFilmDataFromAPI() {
  var response = await fetch('https://ghibliapi.vercel.app/films/');
  var apiData = await response.json();
  return apiData.map((data) => {
    return {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      director: data.director,
      producer: data.producer,
      release_date: data.release_date,
      running_time: data.running_time,
      rt_score: data.rt_score,
      heart_icon: true,
      visibility: true
    }
  })
}

function FilmList({ list, onFavoriteListUpdate, onFavoriteValueUpdate, onFavoriteDelete }) {
  const films = list.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image: item.image,
      description: item.description,
      director: item.director,
      producer: item.producer,
      releaseDate: item.release_date,
      runningTime: item.running_time,
      score: item.rt_score,
      heartIcon: item.heart_icon,
      visibility: item.visibility
    }
  })
  const filmItems = films.map((f) =>
    <FilmItem
      key={f.id}
      film={f}
      onFavoriteListUpdate={onFavoriteListUpdate}
      onFavoriteValueUpdate={onFavoriteValueUpdate}
      onFavoriteDelete={onFavoriteDelete}
    />
  );
  return (
    <div className="flexible-container">{filmItems}</div>
  )
}

function App() {
  const [filmData, setFilmsData] = useState([])
  const [favoriteList, setFavoriteList] = useState([]);

  function compareApiAndLocalStorageData(apiResponse) {
    let localStorageData = localStorage.getItem("filmsIdArray");
    if (!localStorageData) {
      return
    } else {
      let favoritesId = JSON.parse(localStorageData);
      let favoritesFilmData = apiResponse.filter(film => favoritesId.includes(film.id));
      favoritesId.forEach(id => {
        updateFavoriteValue(id, apiResponse)
      });
      setFavoriteList(favoritesFilmData);
    }
  }

  useEffect(() => {
    getFilmDataFromAPI()
      .then((response) => {
        setFilmsData(response)
        return response
      })
      .then((response) => { compareApiAndLocalStorageData(response) })
  }, [])

  const updateFavoriteList = (id) => {
    const selectedFilm = filmData.find(function (film) {
      return film.id === id;
    });
    const copySelectedFilm = { ...selectedFilm }
    const newList = [
      ...favoriteList,
      copySelectedFilm
    ];
    setFavoriteList(newList);
  }

  const updateFavoriteValue = (id, response) => {
    const definedResponse = response ?? filmData
    const newList = [...definedResponse];
    const selectedFilm = newList.find(function (film) {
      return film.id === id;
    });
    if (selectedFilm['heart_icon'] === true) {
      selectedFilm['heart_icon'] = false;
    } else {
      selectedFilm['heart_icon'] = true;
    }
    setFilmsData(newList);
  }

  const favoriteDelete = (id) => {
    const favoriteIndex = favoriteList.findIndex((t) => t.id === id);
    const tmpFavoriteList = [...favoriteList];
    tmpFavoriteList.splice(favoriteIndex, 1);
    setFavoriteList(tmpFavoriteList);
  }

  function FavoriteList() {
    if (favoriteList.length === 0) {
      return (
        <>
          <InfoCircleOutlined className='select-a-favorite select-a-favorite-icon' />
          <span className='select-a-favorite select-a-favorite-text'>Select a favorite!</span>
        </>
      )
    } else {
      return (
        <FilmList
          list={favoriteList}
          onFavoriteDelete={favoriteDelete}
          onFavoriteValueUpdate={updateFavoriteValue}
        />
      )
    }
  }

  const onChange = (e) => {
    const searchTextValue = e.currentTarget.value.toLowerCase();
    const tempFilmData = [...filmData];
    const updatedFilmData = tempFilmData.map(data => {
      const isTitleSearched = data.title.toLowerCase().includes(searchTextValue);
      const isDescriptionSearched = data.description.toLowerCase().includes(searchTextValue);
      const isDirectorSearched = data.director.toLowerCase().includes(searchTextValue);
      const isProducerSearched = data.producer.toLowerCase().includes(searchTextValue);
      const isReleaseSearched = data.release_date.toLowerCase().includes(searchTextValue);
      const isVisible = isTitleSearched || isDescriptionSearched ||
        isDirectorSearched || isProducerSearched || isReleaseSearched;
      const visibility = searchTextValue == "" ? true : isVisible;
      return {
        id: data.id,
        title: data.title,
        image: data.image,
        description: data.description,
        director: data.director,
        producer: data.producer,
        release_date: data.release_date,
        running_time: data.running_time,
        rt_score: data.rt_score,
        heart_icon: data.heart_icon,
        visibility: visibility
      }
    });
    setFilmsData(updatedFilmData);
  }

  const tabs = [
    {
      label: <span><BookOutlined /> FILMS LIST</span>,
      key: '1',
      children:
        <>
          <div style={{ "display": "flex", "justifyContent": "center" }}>
            <Input
              placeholder="search for film..."
              allowClear
              size="medium"
              onChange={onChange}
              style={{
                minWidth: "300px",
                width: "400px",
              }}
            />
          </div>
          <FilmList
            list={filmData}
            onFavoriteListUpdate={updateFavoriteList}
            onFavoriteValueUpdate={updateFavoriteValue}
            onFavoriteDelete={favoriteDelete}
          />
        </>
    },
    {
      label: <span><HeartOutlined /> FAVORITES</span>,
      key: '2',
      children: <FavoriteList />
    },
  ];

  return (
    <ConfigProvider theme={{
      components: {
        Tabs: {
          colorBgContainer: '#ffffe0',
          itemSelectedColor: '#000',
          itemHoverColor: 'brown',
          cardBg: '#cbe79c'
        },
      },
    }}
    >
      <Layout>
        <Header className='header-style'>
          <div className='background-style'></div>
          <p className='paragraph-style'>
            Studio Ghibli Search Films
          </p>
        </Header>
        <Content className='content-style'>
          <div style={{ "padding": "0 50px" }}>
            <Tabs
              centered={true}
              tabBarGutter={500}
              defaultActiveKey="1"
              type="card"
              size={"medium"}
              items={tabs}
            />
          </div>
        </Content>
        <Footer className='footer-style'>Footer</Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
