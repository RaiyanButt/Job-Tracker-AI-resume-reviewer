import { Link, useNavigate } from "react-router";
import { PlusIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="test-3xl font-bold tex-primary font-mono tracking-tigher">
            TrackMyApps
          </h1>

          <div className="flex items-center gap-2">
            <Link to="/app/ai" className="btn btn-outline">
              AI Helper
            </Link>

            <Link to="/app/create" className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Application</span>
            </Link>

            <button onClick={onLogout} className="btn btn-ghost">
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
