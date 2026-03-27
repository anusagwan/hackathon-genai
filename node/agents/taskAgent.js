// agents/taskAgent.js
import db from "../db/firestore.js";

export async function handleTask(query) {
  let tasks = [];

  if (typeof query === "string") {
    const q = query.toLowerCase();
    // extract task from phrases like "add task ..."
    if (q.includes("add task")) {
      const taskText = query.split(/add task/i)[1]?.trim();
      if (taskText) tasks.push(taskText);
    }
  }

  if (typeof query === "object" && query !== null) {
    // If Gemini returns tasks as array of objects
    if (Array.isArray(query.tasks)) {
      tasks = query.tasks.map(t => t.title || JSON.stringify(t));
    } else if (query.task) {
      tasks = [query.task.title || JSON.stringify(query.task)];
    }
  }

  if (tasks.length === 0) return "Task agent couldn't understand";

  const savedTasks = [];
  for (const t of tasks) {
    await db.collection("tasks").add({ task: t });
    savedTasks.push(t);
  }

  return `Task${savedTasks.length > 1 ? "s" : ""} '${savedTasks.join(", ")}' added`;
}