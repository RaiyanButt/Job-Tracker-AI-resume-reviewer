import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <header className="bg-base-300 border-b border-base-content/10">
        <div className="mx-auto max-w-6xl px-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="test-3xl font-bold tex-primary font-mono tracking-tigher">
              TrackMyApps
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card bg-base-200 border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title">Track your applications</h2>
              <p className="opacity-80">
                Keep your pipeline organized, move stages fast, and stay consistent.
              </p>
              <div className="card-actions mt-2">
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Log in
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title">AI resume helper</h2>
              <p className="opacity-80">
                Get quick feedback and bullet rewrites to improve ATS + impact.
              </p>
              <div className="card-actions mt-2">
                <Link to="/login" className="btn btn-outline">
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
