import  React from 'react';

import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Auth from 'components/Auth';
import Layout from 'components/Layout';

import Home from 'scenes/Home';
import Dashboard from 'scenes/Dashboard';
import { Login, Register } from 'scenes/Auth';

import Starred from 'scenes/Starred';
import Drafts from 'scenes/Drafts';
import Collection from 'scenes/Collection';
import Search from 'scenes/Search';
import Document from 'scenes/Document';
import Settings from 'scenes/Settings';

import Library from 'scenes/Library';
import Pdf from 'scenes/Pdf';


import ErrorBoundary from 'components/ErrorBoundary';
import ScrollToTop from 'components/ScrollToTop';
import Error404 from 'scenes/Error404';
import ErrorAuth from 'scenes/ErrorAuth';

import RouteSidebarHidden from 'components/RouteSidebarHidden';

import { matchDocumentSlug } from 'utils/routeHelpers';

import globalStyles from 'shared/styles/globals';
import 'shared/styles/prism.css';

import I18n from './I18n';
import { translations } from './translations';

const notFoundSearch = () => <Search notFound />;
const DocumentNew = () => <Document newDocument />;
const RedirectDocument = ({ match }) => (
  <Redirect to={`/doc/${match.params.documentSlug}`} />
);

globalStyles();

const App = ({ store }) => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router>
        <ScrollToTop>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />

            <RouteSidebarHidden
              eaact
              path="/files/:id"
              component={Pdf}
            />
            <Auth>
              <Layout>
                <Switch>

                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/starred" component={Starred} />
                  <Route exact path="/drafts" component={Drafts} />
                  <Route exact path="/settings" component={Settings} />

                  <Route
                    exact
                    path="/collections/:id"
                    component={Collection}
                  />
                  <Route
                    exact
                    path={`/d/${matchDocumentSlug}`}
                    component={RedirectDocument}
                  />
                  <Route
                    exact
                    path={`/doc/${matchDocumentSlug}`}
                    component={Document}
                  />
                  <Route
                    exact
                    path={`/doc/${matchDocumentSlug}/move`}
                    component={Document}
                  />

                  <Route exact path="/search" component={Search} />
                  <Route exact path="/search/:query" component={Search} />
                  <Route path="/404" component={Error404} />

                  <RouteSidebarHidden
                    exact
                    path={`/doc/${matchDocumentSlug}/edit`}
                    component={Document}
                  />
                  <RouteSidebarHidden
                    exact
                    path="/collections/:id/new"
                    component={DocumentNew}
                  />

                  <Route
                    exact
                    path="/libraries/:id"
                    component={Library}
                  />

                  <Route component={notFoundSearch} />


                </Switch>
              </Layout>
            </Auth>

          </Switch>

        </ScrollToTop>
      </Router>
    </Provider>
  </ErrorBoundary>
);


export default App;
