import plus from "../images/plus.svg";
import trash from "../images/del.svg";
import edit from "../images/edit.svg";
import loadingimg from "../images/loading.svg";
import { useForm } from "react-hook-form";
import { client } from "../LIB";
import { useEffect, useState } from "react";

export default function TodoApp() {
  const { handleSubmit, register, reset } = useForm();
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getTodos() {
      setLoading(true);
      try {
        const response = await client.get("/todos");
        setTodos(response.data.todos);
        console.log(response.data.todos);
      } catch {
        console.log("error");
      }
      setLoading(false);
    }
    getTodos();
  }, []);

  async function postTodos({ todo }) {
    try {
      const response = await client.post("/todos/add", {
        id: Date.now(),
        todo,
        completed: false,
        userId: 2,
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

  function editTodo(id, currentText) {
    setEditingId(id);
    setEditText(currentText);
  }

  async function saveEdit(id) {
    try {
      const response = await client.put(`/todos/${id}`, {
        todo: editText,
      });
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, todo: response.data.todo } : t))
      );
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.log("error editing todo:", error);
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
      {loading ? (
        <div className="flex position-absolute justify-center items-center w-screen h-screen">
          <img src={loadingimg} alt="loading" className="w-[50px] h-[50px]" />
        </div>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {todos.map((item) => (
            <div
              key={item.id}
              className={`flex flex-row justify-between border-1 border-black rounded-[12px] p-3 gap-[8px]  
              ${item.completed ? "bg-[#F5D1D4]" : "bg-[#B6DBE3]"}
              ${item.completed ? "line-through" : "none"}`}
            >
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleCompleted(item.id, item.completed)}
              />

              {editingId === item.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 rounded flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(item.id)}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="bg-gray-400 text-white px-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="flex-1">{item.todo}</p>
                  <div className="flex gap-[8px]">
                    <button
                      type="button"
                      onClick={() => deleteTodo(item.id)}
                      className="cursor-pointer"
                    >
                      <img src={trash} alt="trash icon" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editTodo(item.id, item.todo)}
                      className="cursor-pointer"
                    >
                      <img src={edit} alt="edit icon" className="w-[20px]" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
