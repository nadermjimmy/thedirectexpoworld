import { createRoot } from "react-dom/client";

function Admin() {
  return <h1>Admin Panel</h1>;
}

createRoot(document.getElementById("root")!).render(<Admin />);
