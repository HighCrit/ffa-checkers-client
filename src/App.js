import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/header/Header';
import history from './history';
import GameRouterPage from './pages/game/GameRouterPage';
import Home from './pages/home/Home';

import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <ToastContainer draggable={false} pauseOnHover={false} closeOnClick={true}/>
                <Header/>
                <Switch>
                    <Route exact path={'/'} component={Home}/>
                    <Route exact path={'/game/:code'} component={GameRouterPage}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
