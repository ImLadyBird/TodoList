import { RouterProvider } from "react-router";
import TodoApp from "./Components/TodoApp";
import { router } from "./route";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
