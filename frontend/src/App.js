import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState([]);

  const handleSubmit = async () => {
    if (!query) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/ask?query=${query}`
      );
      setResponse(Array.isArray(res.data.response) ? res.data.response : [res.data.response]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>🧠 Multi-Agent Assistant</h1>

      <div className="input-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your request..."
        />
        <button onClick={handleSubmit}>Ask</button>
      </div>

      <div className="response">
        {Array.isArray(response) ? (
          response.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.agent?.toUpperCase() || "Agent"}</h3>
              {Array.isArray(item.result) ? (
                <ul>
                  {item.result.map((task, taskIndex) => (
                    <li key={taskIndex}>
                      {task.task ? (
                        <>
                          <strong>{task.task}</strong> - <span className={`status ${task.status}`}>{task.status}</span>
                        </>
                      ) : (
                        <>
                          <strong>{task.note}</strong>
                          {task.createdAt && <span className="timestamp"> ({new Date(task.createdAt._seconds * 1000).toLocaleString()})</span>}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{typeof item.result === "string" ? item.result : JSON.stringify(item.result)}</p>
              )}
              {item.notes && <p className="notes"><em>Notes: {item.notes}</em></p>}
            </div>
          ))
        ) : (
          <p>{typeof response === "string" ? response : JSON.stringify(response)}</p>
        )}
      </div>
    </div>
  );
}

export default App;