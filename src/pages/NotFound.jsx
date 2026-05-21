import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => (
  <section className="min-h-[60vh] flex items-center justify-center pt-32 pb-24">
    <div className="container-x text-center">
      <p className="font-mono text-xs text-fg-subtle tracking-widest uppercase">404</p>
      <h1 className="mt-3 font-display font-extrabold tracking-tight text-5xl sm:text-6xl">
        lost in the <span className="text-accent">void</span>
      </h1>
      <p className="mt-4 text-fg-muted">This page never compiled. Try one of these:</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition"
        >
          <Home className="h-4 w-4" /> Home
        </Link>
        <Link
          to="/lab"
          className="inline-flex items-center px-4 py-2 rounded-full border border-border text-sm hover:bg-bg-card transition"
        >
          Lab
        </Link>
      </div>
    </div>
  </section>
);

export default NotFound;
