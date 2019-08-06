import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './css/style.scss';
import Index from './pages/index.js';
import Blog from './pages/blog.js';
import Post from './pages/post.js';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-44283857-10');
ReactGA.pageview(window.location.pathname + window.location.search);

const AppRouter = () => (
    <Router>
        <div>
            <Switch>
                <Route path="/" exact component={Index} />
                <Route path="/blog" exact component={Blog} />
                <Route path="/blog/page/:pageNum" exact component={Blog} />
                <Route path="/blog/:slug" component={Post} />
            </Switch>
        </div>
    </Router>
);

export default AppRouter;
