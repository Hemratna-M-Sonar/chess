import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import Landing from "./screens/Landing.jsx";
import Game from "./screens/Game.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/game",
      element: <Game />,
    },
  ]);
  return (
    <div className="h-screen bg-stone-700">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
