import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const Navbar = () =>{
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="test-3xl font-bold tex-primary font-mono tracking-tigher">TrackMyApps</h1> 
          
          <div className="flex items-center gap-2">
            <Link to="/ai" className="btn btn-outline">
              AI Helper
            </Link>

            <Link to="/create" className="btn btn-primary">
              <PlusIcon className="size-5"/>
              <span>New Application</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
};

export default Navbar;
