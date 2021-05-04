import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import BottomNav from './Components/Navigation/BottomNav.jsx';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Home from './Components/Home/Home.jsx';
import Profile from './Components/Profile/Profile.jsx'
import Discovery from './Components/Discovery/Discovery.jsx'
import Alerts from './Components/Alerts/Alerts.jsx'
import PhotoUpload from './Components/PhotoUpload/PhotoUpload.jsx'
// import logo from './assets/LogoNoBack.png'
import AppBarHeader from './Components/Home/AppBarHeader.jsx';
import { Button } from '@material-ui/core'

import galaxy from './themes/space2.jpg';
import earth from './themes/earth.jpg';
import dinos from './themes/dinos.jpg';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  spaceTheme: {
    backgroundImage: `url(${galaxy})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    paddingBottom: '5rem',
  },
  earthTheme: {
    backgroundImage: `url(${earth})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    paddingBottom: '5rem',
  },
  historyTheme: {
    backgroundImage: `url(${dinos})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    paddingBottom: '5rem',
  },
}))



const App = () => {
  const classes = useStyles();
    const [user, setUser] = useState();
    const [stamps, setStamps] = useState([])
    const [discView, setDiscView] = useState('')
    const [theme, setTheme] = useState('headerDefault');
    const [alerts, setAlerts] = useState([])

    const currClass = classes[`${theme}`];

  const getUser = () => {
    if (!user) {
      axios
        .get('/user')
        .then(({ data }) => {
          setUser(data)
        })
        .catch();
    }
  };

  // // NO LOOP
  // const addResource = (resource) => {
  //   //post request to user table
  //   axios.post('/resource', {
  //     category: discView,
  //     date: Date.now,
  //     title: resource.title,
  //     author: resource.author,
  //     image: resource.urlToImage,
  //     url: resource.url,
  //     userId: user.id
  //   })
  //   .then(() => {
  //     getStamps()
  //   })
  //   .catch()
  // };

  //FIX THIS BEFORE IT LOOPS
  const addResource = (resource, resType) => {
    let pars = {};
    //if resource is article:
    if(resType === 'article'){
      pars= {
        category: discView,
        date: Date.now,
        title: resource.title,
        author: resource.author,
        image: resource.urlToImage,
        url: resource.url,
        userId: user.id,
        type: resType
      }
    } else if(resType === 'documentary'){
      pars= {
        category: discView,
        date: Date.now,
        title: resource.snippet.title,
        // author: null,
        image: resource.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/embed/${resource.id.videoId}`,
        userId: user.id,
        type: resType
      }
    }
    //post request to user table
    axios.post('/resource', pars)
    .then(() => {
      getStamps()
      console.log('add resources worked!', stamps)
    })
    .catch()
  };


   const getStamps = () => {
    //  debugger;
    if (user) {
      axios.get(`/user/${user.id}`)
        .then(({ data }) => {
          console.log('FROM STAMPS', data)
          setStamps(data);
          setAlerts(data);
        })
        .catch();
    }
  };

  //  const getAlerts = () => {
  //   //  debugger;
  //   if (user) {
  //     axios.get(`/user/${user.id}`)
  //       .then(({ data }) => {
  //         console.log('FROM Alerts', data)
  //         setAlerts(data);
  //       })
  //       .catch();
  //   }
  // };

  const logout = () => {
    axios.get('/logout').then(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    getUser();
    // getAlerts();
  }, [])

    return (
    <div className={currClass}>
      <AppBarHeader user={user} logout={logout} discView={discView} setDiscView={setDiscView} theme={theme} setTheme={setTheme}/>
      {!user
      ?(
        <div >
          <Home />
          <Button variant="contained">
          <a
            className="login-button"
            href="/auth/google"
          >
          LOGIN WITH GOOGLE
          </a>
          </Button>
        </div>
      )
      :(

        <Router>

            <BottomNav />
            <Switch>
              <Route exact path="/">
                  <Home user={user} logout={logout} getStamps={getStamps}/>
              </Route>
              <Route path="/profile">
                  <Profile user={user} logout={logout} stamps={stamps} getStamps={getStamps}/>
              </Route>
              <Route path="/discovery">
                  <Discovery addResource={addResource} discView={discView} setDiscView={setDiscView}/>
              </Route>
              <Route path="/alerts">
                  <Alerts user={user} alerts={alerts} />
              </Route>
              <Route path="/PhotoUpload">
                  <PhotoUpload />
              </Route>
            </Switch>

      </Router>
       )}
    </div>
    )
}

export default App;