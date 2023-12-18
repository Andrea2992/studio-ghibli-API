import './App.css';
import './AppResponsive.css';
import { Layout, Tabs, ConfigProvider, Input } from 'antd';
import { BookOutlined, HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import FilmItem from '../film-item/FilmItem';
import { useEffect, useState } from 'react';
import { highlightSearchedText } from '../util/util';


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

function FilmList({ list, onFavoriteListUpdate, onFavoriteValueUpdate, onFavoriteDelete, tabIdName }) {
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
    <div id={tabIdName} className='flexible-container'>{filmItems}</div>
  )
}

const initialTabLabelWidth = () => {
  if (window.innerWidth >= 1400) {
    return 500;
  } else if (window.innerWidth >= 960 & window.innerWidth < 1399.98) {
    return 250;
  } else if (window.innerWidth < 959.98) {
    return 1;
  };
}

const initialTabContainerWidth = () => {
  if (window.innerWidth >= 1400) {
    return '0 50px';
  } else if (window.innerWidth >= 960 & window.innerWidth < 1399.98) {
    return '0 25px';
  } else if (window.innerWidth < 959.98) {
    return '0 10px';
  };
}

function App() {
  const [filmData, setFilmsData] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const [tabLabelWidth, setTabLabelWidth] = useState(initialTabLabelWidth());
  const [tabContainerWidth, setTabContainerWidth] = useState(initialTabContainerWidth());

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

  useEffect(() => {
    highlightSearchedText(searchedText);
  }, [searchedText]);

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1400) {
      setTabLabelWidth(500);
      setTabContainerWidth('0 50px');
    } else if (window.innerWidth > 960 & window.innerWidth < 1399.98) {
      setTabLabelWidth(250);
      setTabContainerWidth('0 25px');
    } else if (window.innerWidth < 959.98) {
      setTabLabelWidth(1);
      setTabContainerWidth('0 10px');
    }
  });

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
          tabIdName={"favoriteTab"}
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
      const isReleaseDateSearched = data.release_date.toLowerCase().includes(searchTextValue);
      const isVisible = isTitleSearched || isDescriptionSearched ||
        isDirectorSearched || isProducerSearched || isReleaseDateSearched;
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
    setSearchedText(searchTextValue);
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
            />
          </div>
          <FilmList
            list={filmData}
            onFavoriteListUpdate={updateFavoriteList}
            onFavoriteValueUpdate={updateFavoriteValue}
            onFavoriteDelete={favoriteDelete}
            tabIdName={"filmTab"}
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
          <p className='title-paragraph-style'>
            Studio Ghibli Search Films
          </p>
        </Header>
        <Content className='content-style'>
          <div style={{ "padding": tabContainerWidth }}>
            <Tabs
              centered={true}
              tabBarGutter={tabLabelWidth}
              defaultActiveKey="1"
              type="card"
              size={"medium"}
              items={tabs}
            />
          </div>
        </Content>
        <Footer className='footer-style'>
          <div className='content-divider'></div>
          <p className='footer-paragraph'>Demo site made by Andrea Cok</p>
          <p className='footer-paragraph'>Thanks to https://ghibliapi.vercel.app/ for API service</p>
          <p className='footer-paragraph'>All credits goes to © 2005-2023 STUDIO GHIBLI Inc.</p>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;