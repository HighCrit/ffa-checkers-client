import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Header from './components/header/Header';
import history from './history';
import GameRouterPage from './pages/game/GameRouterPage';

import Home from './pages/home/Home';

class App extends Component {
    render() {
        return (
            <Router history={history}>
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
