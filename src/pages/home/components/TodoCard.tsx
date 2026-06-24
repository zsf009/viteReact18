import { memo, useState } from "react";
import { useTodoStore } from "../../../store/useTodoStore";
import Card from "./Card";

type Priority = "high" | "normal" | "low";

// 对照 react17 的 RtkTodoCard：
// RTK：dispatch(addTodo({ text, priority })) / dispatch(setFilter(...))
// zustand：addTodo(text, priority) 等普通方法；筛选逻辑同样在组件内 computed
const TodoCard = () => {
  const list = useTodoStore((s) => s.list);
  const filter = useTodoStore((s) => s.filter);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const setPriority = useTodoStore((s) => s.setPriority);
  const setFilter = useTodoStore((s) => s.setFilter);

  const [todoInput, setTodoInput] = useState("");
  const [priority, setPriorityLocal] = useState<Priority>("normal");

  console.log("zustand TodoCard render");

  const filteredTodos = list.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const handleAdd = () => {
    if (todoInput) {
      addTodo(todoInput, priority);
      setTodoInput("");
    }
  };

  const priorityColor = (p: Priority) =>
    p === "high" ? "red" : p === "normal" ? "#1677ff" : "green";

  return (
    <Card title="Todo (zustand)">
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={todoInput}
          placeholder="输入待办"
          onChange={(e) => setTodoInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <select
          value={priority}
          onChange={(e) => setPriorityLocal(e.target.value as Priority)}
        >
          <option value="high">高</option>
          <option value="normal">中</option>
          <option value="low">低</option>
        </select>
        <button onClick={handleAdd}>添加</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? 700 : 400 }}
          >
            {f === "all" ? "全部" : f === "active" ? "未完成" : "已完成"}
          </button>
        ))}
      </div>

      <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
        {filteredTodos.map((item) => (
          <li
            key={item.id}
            style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}
          >
            <span
              style={{ textDecoration: item.done ? "line-through" : "none" }}
            >
              {item.text}
            </span>
            <span style={{ color: priorityColor(item.priority) }}>
              [{item.priority}]
            </span>
            <select
              disabled={item.done}
              value={item.priority}
              onChange={(e) => setPriority(item.id, e.target.value as Priority)}
            >
              <option value="high">高</option>
              <option value="normal">中</option>
              <option value="low">低</option>
            </select>
            <a onClick={() => toggleTodo(item.id)} style={{ cursor: "pointer" }}>
              {item.done ? "撤销" : "完成"}
            </a>
            <a onClick={() => deleteTodo(item.id)} style={{ cursor: "pointer" }}>
              删除
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default memo(TodoCard);
