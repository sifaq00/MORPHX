import { Hero } from '../components/Hero';
import { Route } from '../hooks/useHashRoute';

export function HomePage({ onNavigate }: { onNavigate: (r: Route) => void }) {
  return <Hero onNavigate={onNavigate} />;
}