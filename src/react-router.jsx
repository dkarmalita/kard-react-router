/* eslint react/prop-types: "off" */
import { Component } from "react";

/**
 * 2. Location normilizer
 * ----------------------
 * Takes a location object (e.g. windows.location) and returns it's normilized value -
 * an object within only data properties and additionaly values: route (contains pathname
 * without trailing slash in any case)
 * -
 * @param  {Object} options - any object within location data properties
 * @return {Object}         - normilized location extanted with `route`
 */
export const normilizeLocation = ({
  hash,
  host,
  hostname,
  href,
  origin,
  pathname,
  port,
  protocol,
  search
}) => ({
  hash,
  host,
  hostname,
  href,
  origin,
  pathname,
  port,
  protocol,
  search,

  // the pathname can be obtained with and without trailing slash.
  // here we have to normilize it to the case without trailing slash.
  route: pathname.substr(-1) === '/' && pathname.length > 1
    ? pathname.slice(0,-1)
    : pathname,
})

/**
 * 3. URL parser
 * -------------
 * Takes a URL and returns the normilized location value.
 * -
 * @param  {String} url - URL to parse
 * @return {Object}     - normilized parsed location
 */
const parser = document.createElement('a');
export const parseUrl = (url) => {
  parser.href = url;
  return normilizeLocation(parser)
}

// =>> primary auth protection

let isAuthorized = () => true
let getAuthRedirect = (href) => href

/**
 * apqDelim - a prefix of protected path in query part of a location. Used for detection
 * of it's existance.
 * @type {String}
 */
const apqDelim = 'apx:'

/**
 * Test the given search part of a location if it contains a protected route in it.
 * @param  {String} search - search part of a location which starts from '?'
 * @return {Bool}          - the test result
 */
const hasProtectedRoute = (search) => search.startsWith(`?${apqDelim}`)

/**
 * Extracts protected route from the given search part
 * Note: the search is not tested for the path existance. Call the `hasProtectedRoute`
 * to make the preleminary chack if neccesary.
 * @param  {String} search - search part of a location which starts from '?'
 * @return {String}        - extracted route
 */
const getProtectedRoute = (search) => search.substring(apqDelim.length+1)

const createGetRedirect = ({
  loginRoute,   //
  defaultRoute, // default autorized route
  isPublicRoute=()=>false
}) => (xHref) => {
  const { route, href, search } = parseUrl(xHref)
  if( !isAuthorized() && route != loginRoute && !isPublicRoute(route) ){
    return (`${loginRoute}?${apqDelim}${href}`)
  }
  if( isAuthorized() && route == loginRoute && hasProtectedRoute(search)){
    return (getProtectedRoute(search))
  }
  if( isAuthorized() && route == loginRoute && !hasProtectedRoute(search)){
    return (defaultRoute)
  }
  return xHref
}

let forceUpdate = null

/**
 * 4. Route detector & renderer
 * ----------------------------
 * @param  {Object}   _location - normilized (within `route` property) location
 * @param  {Array}    config    - array of route config objects in shape of {route,render}
 * @return {DOM Node}           - result of a call of render with _location as props
 */
const renderLocation = (location, config) => {
  for (var i = 0; i <= config.length - 1; i++) {
    let { route, render } = config[i]
    if(route ===  location.route || route === '*'){
      // TODO: review the call, looks like we need to give a `router` instead `_location`
      return render(location)
    }
  }
  return null
}

export const navigate = (href) => {
  history.pushState({}, null, href)
  if( forceUpdate )( forceUpdate() )
}

export const replacePath = (href) => {
  history.replaceState({}, null, href)
}

export class Router extends Component {
  constructor(props){
    super(props)

    const { authConfig } = props

    isAuthorized = (authConfig || {}).isAuthorized || isAuthorized
    getAuthRedirect = createGetRedirect(authConfig)

    forceUpdate = ()=>this.forceUpdate()
  }

  protectCurrentRoute = () => {
    replacePath(
      getAuthRedirect(
        window.location.href,
      )
    )
  }

  render(){
    this.protectCurrentRoute()
    return renderLocation(parseUrl(window.location), this.props.routes)
  }
}

const handeWindowEvent = (eventName, handler) => {
  const oldHandler = window[eventName]
  window[eventName] = function(event){
    handler(event)
    if(!event.defaultPrevented && oldHandler){
      oldHandler(event)
    }
  }
}

handeWindowEvent('onpopstate', function() {
  forceUpdate()
})

handeWindowEvent('onclick', function(e) {

  const {
    // href,
    origin,
    tagName,
    target,
    pathname,
  } = e.target

  if(
    'A' === tagName
    && origin === window.location.origin
    && "_blank" !== target
  ){
    navigate(pathname)
    e.preventDefault()
  }
})
