import plus from "../images/plus.svg";
import trash from "../images/del.svg";
import { useForm } from "react-hook-form";
import { client } from "../LIB";
import { useEffect, useState } from "react";



export default function TodoApp() {
  const { handleSubmit, register } = useForm();
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

  async function postTodos({ todo ,id   }) {
    try {
      const response = await client.post("/todos/add", {
        id,
        todo,
        completed : false,
        userId : 1
      });
      setTodos([...todos, response.data]);  
      console.log(response.data);
    } catch {
      console.log("error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[18px]">
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
        <button className="bg-black rounded-full p-3">
          <img src={plus} alt="plus icon" />
        </button>
      </form>
      <div className="flex flex-col gap-[8px]">
        {todos.slice(30 ,100).map((item) => (
          <div key={item.id} className="flex flex-row justify-between border-1 border-black rounded-[12px] p-3 gap-[8px] bg-[#B6DBE3] ">
            <input type="checkbox" checked={item.completed} readOnly />
            <p>{item.todo}</p>
            <button>
              <img src={trash} alt="trash icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
