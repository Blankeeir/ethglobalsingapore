import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <Link to="/" className="text-lg font-bold">
        Attornato
      </Link>
        <>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/marketplace" className="hover:underline">
            Marketplace
          </Link>
          <Link to="/sell" className="hover:underline">
            Sell Asset
          </Link>
        </>
    </div>
    <div>
    <DynamicWidget />
    </div>
  </header>

    // <div className="h-[90px] z-10 fixed left-0 top-0 w-full bg-neutral-content flex justify-between items-center px-4">
    //   <div className="text-2xl font-semibold">
    //     <Link to="/">Boatlink</Link>
    //   </div>
    //   <DynamicWidget />
    // </div>
  );
}

