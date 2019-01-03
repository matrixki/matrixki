import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './css/style.scss';
import Index from './pages/index.js';
import Blog from './pages/blog.js';
import Post from './pages/post.js';

const AppRouter = () => (
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={Index} />
                    <Route path="/blog" exact component={Blog} />
                    <Route path="/blog/:slug" component={Post} />
                </Switch>
            </div>
        </Router>
);

export default AppRouter;

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

// export default App;
