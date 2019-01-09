import React from 'react';
import { Router, navigate } from '@kard/react-router';
import { Navbar } from './Navbar';

const authService = {
  authorize: () => {
    sessionStorage.setItem('isAuthorized', 'yes')
    navigate(window.location.href)
  },
  unAuthorize: () => {
    sessionStorage.setItem('isAuthorized', '')
    navigate(window.location.href)
  },
  isAuthorized: () => {
    return sessionStorage.getItem('isAuthorized')
  },
}

const RoutingStatePage = () => (
  <div>
    <h2>Authorized: { authService.isAuthorized() ? 'Yes' : 'No' }</h2>
    <h2>Route: { window.location.pathname }</h2>
  </div>
)

const LoginPage = () => (
  <div>
    <p>
      The login route is only available for the not authorized state.
      In the authorized state, this route is redirecting to the default one.
    </p>
    <p>
      In the not authorized state, any protected route is redirecting to the login one.
    </p>
    <p>
      The login route is alvays public even when the <i>isPublicRoute</i> test doesnt show it.
    </p>
    <p>
      When some protected route is redirecting here, it is stored in the query part of the URL.
      After the successful login, the user is redirected back to the protected route.
    </p>
    <button
      onClick={ authService.authorize }
    >Login</button>
    <RoutingStatePage/>
  </div>
)

const HomePage = () => (
  <div>
    <p>
      In the demo configuration, the home route is available for any (authorized or not) customers.
    </p>
    <RoutingStatePage/>
  </div>
)

const DefaultPage = () => (
  <div>
    <p>
      The default route is the one where the user is redirected just after its login succeed if there
      is no protected route in the URL is requested.
    </p>
    <RoutingStatePage/>
  </div>
)

const renderRoute = (Component) => (location) => {
  console.log('location', location)
  const navbarConfig = [
    { href: '/', title: 'Home' },
    { href: '/login', title: 'Login' },
    { href: '/test', title: 'Test' },
    { href: '/todo', title: 'To-Do (Animated)' },
    { href: '/default', title: 'Default' },
  ]
  return (
    <div>
      <Navbar config={ navbarConfig }/>
      <div style={{ minHeight: '100vh' }}>
        { authService.isAuthorized() &&
          <button
            onClick={ authService.unAuthorize }
          >Logout</button>
        }
        <Component/>
      </div>
    </div>
  )
}

const routsCfg = [
  { route: '/',
    render: renderRoute(HomePage),
  },
  { route: '/login',
    render: renderRoute(LoginPage),
  },
  { route: '/test',
    render: renderRoute(RoutingStatePage),
  },
  { route: '/todo',
    render: renderRoute(RoutingStatePage),
  },
  { route: '/default',
    render: renderRoute(DefaultPage),
  },
  { route: '*',
    render: renderRoute(RoutingStatePage),
  },
]

const authConfig = {
  isAuthorized: authService.isAuthorized,
  loginRoute: '/login',
  defaultRoute: '/default',
  isPublicRoute: (route)=>(route==='/'),
}

class App extends React.Component {
  render() {
    return (
      <Router
        routes={routsCfg}
        authConfig={authConfig}
      />
    )
  }
}

export default App;
