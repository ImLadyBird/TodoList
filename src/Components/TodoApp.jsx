import plus from "../images/plus.svg";
import trash from "../images/del.svg";
import { useForm } from "react-hook-form";
import { client } from "../LIB";
import { useEffect, useState } from "react";

export default function TodoApp() {
  const { handleSubmit, register, reset } = useForm();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getTodos() {
      try {
        const response = await client.get("/todos");
        setTodos(response.data.todos);
        console.log(response.data.todos);
      } catch {
        console.log("error");
      }
    }
    getTodos();
  }, [setTodos]);

  async function postTodos({ todo }) {
    try {
      const response = await client.post("/todos/add", {
        todo,
        completed: false,
        userId: 1,
      });
      setTodos([...todos, response.data]);
      reset();
      console.log(response.data);
    } catch {
      console.log("error");
    }
  }

  async function deleteTodo(id) {
    try {
      await client.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch {
      console.log("error deleting todo");
    }
  }

  async function toggleCompleted(id, completed) {
    try {
      const response = await client.put(`/todos/${id}`, {
        completed: !completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? { ...todo, completed: response.data.completed }
            : todo
        )
      );
    } catch (error) {
      console.log("error updating todo:", error);
    }
  }

  return (
    <div className="flex flex-col items-center pt-5 h-screen gap-[18px]">
      <h1 className="text-4xl font-bold">
        Todo<span className="text-[#8DE0C8]">List</span>
      </h1>
      <form className="flex flex-row gap-2" onSubmit={handleSubmit(postTodos)}>
        <input
          {...register("todo")}
          type="text"
          className="border-1 border-black rounded-[21px] p-2 pl-5 flex items-center justify-center"
          placeholder="Enter your task"
        />
        <button className="bg-black rounded-full p-3" type="submit">
          <img src={plus} alt="plus icon" />
        </button>
      </form>
      <div className="flex flex-col gap-[8px]">
        {todos.map((item) => (
          <div
            key={item.id}
            className={`flex flex-row justify-between border-1 border-black rounded-[12px] p-3 gap-[8px]  ${
              item.completed ? "bg-[#F5D1D4]" : "bg-[#B6DBE3]"
            } ${item.completed ? "line-through" : "none"}`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleCompleted(item.id, item.completed)}
            />
            <p>{item.todo}</p>
            <button
              type="button"
              onClick={() => deleteTodo(item.id)}
              className="cursor-pointer"
            >
              <img src={trash} alt="trash icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
