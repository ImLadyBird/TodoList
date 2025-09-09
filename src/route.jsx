import { createBrowserRouter } from "react-router";
import TodoApp from "./Components/TodoApp";

export const router = createBrowserRouter([
    {
        path: "/",
        element : <TodoApp />
    }
])