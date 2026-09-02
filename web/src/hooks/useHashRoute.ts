import { useEffect, useState } from 'react';

export type Route =
  | 'home'
  | 'generate'
  | 'concepts'
  | 'leaderboard'
  | 'community'
  | 'how-it-works'
  | 'launcher';

const VALID_ROUTES: Route[] = ['home', 'generate', 'concepts', 'leaderboard', 'community', 'how-it-works', 'launcher'];

function readRoute(): Route {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  return (VALID_ROUTES as string[]).includes(hash) ? (hash as Route) : 'home';
}

/** Minimal hash router — keeps the app a single Vite build with shareable, refresh-safe URLs. */
export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRouteState] = useState<Route>(readRoute());

  useEffect(() => {
    const onHashChange = () => setRouteState(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function setRoute(next: Route) {
    window.location.hash = next === 'home' ? '/' : `/${next}`;
    setRouteState(next);
  }

  return [route, setRoute];
}