import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="h-[90px] z-10 fixed left-0 top-0 w-full bg-neutral-content flex justify-between items-center px-4">
      <div className="text-2xl font-semibold">
        <Link to="/">Boatlink</Link>
      </div>
      <DynamicWidget />
    </div>
  );
}
