import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaTasks, FaClock, FaExclamationCircle, FaBell, FaHome, FaList, FaUser, FaCog, FaBars } from "react-icons/fa";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#6b7280"];

type TaskItem = {
  id: number;
  title: string;
  priority: string;
  status: string;
  dueDate: string;
};

const initialTasks: TaskItem[] = [];

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "Medium", status: "Open", dueDate: "" });
  const today = new Date().toISOString().split("T")[0];

  const sidebarItems = [
    { icon: <FaHome />, label: "Home", action: () => navigate("/") },
    { icon: <FaList />, label: "All Tasks", action: () => setActiveFilter("All") },
    { icon: <FaUser />, label: "Assigned To Me", action: () => setActiveFilter("All") },
    { icon: <FaExclamationCircle />, label: "Overdue", action: () => setActiveFilter("Overdue") },
    { icon: <FaBell />, label: "Due Today", action: () => setActiveFilter("Due Today") },
    { icon: <FaCog />, label: "Settings", action: () => navigate("/login") },
  ];

  const stats = [
    { label: "All Tasks", count: tasks.length, icon: <FaTasks />, color: "#4f46e5" },
    { label: "Incomplete", count: tasks.filter(t => t.status !== "Completed").length, icon: <FaClock />, color: "#10b981" },
    { label: "Overdue", count: tasks.filter(t => t.status === "Overdue").length, icon: <FaExclamationCircle />, color: "#ef4444" },
    { label: "Due Today", count: tasks.filter(t => t.status === "On Hold").length, icon: <FaBell />, color: "#f59e0b" },
  ];

  const chartData = [
    { name: "Open", value: tasks.filter(t => t.status === "Open").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "In Progress").length },
    { name: "Completed", value: tasks.filter(t => t.status === "Completed").length },
    { name: "On Hold", value: tasks.filter(t => t.status === "On Hold").length },
    { name: "Overdue", value: tasks.filter(t => t.status === "Overdue").length },
  ];

  const filters = ["All", "Incomplete", "Overdue", "Due Today", "Completed"];

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Incomplete") return t.status !== "Completed";
    if (activeFilter === "Overdue") return t.status === "Overdue";
    if (activeFilter === "Completed") return t.status === "Completed";
    if (activeFilter === "Due Today") return t.status === "On Hold";
    return true;
  });

  const handleDelete = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ title: "", priority: "Medium", status: "Open", dueDate: "" });
    setShowForm(false);
  };

  const statusColor: { [key: string]: string } = {
    "Open": "#4f46e5",
    "Overdue": "#ef4444",
    "On Hold": "#f59e0b",
    "Completed": "#10b981",
    "In Progress": "#3b82f6",
  };

  const priorityColor: { [key: string]: string } = {
    "High": "#ef4444",
    "Medium": "#f59e0b",
    "Low": "#10b981",
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "200px" : "60px", backgroundColor: "#1e293b", color: "white", transition: "width 0.3s", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #334155" }}>
          <FaBars style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setSidebarOpen(!sidebarOpen)} />
          {sidebarOpen && <span style={{ fontWeight: "bold", fontSize: "16px" }}>Task Tracker</span>}
        </div>
        {sidebarItems.map((item, i) => (
          <div key={i} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "background 0.2s" }}
            onClick={item.action}
            onMouseEnter={e => (e.currentTarget.style.background = "#334155")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            {sidebarOpen && <span style={{ fontSize: "14px" }}>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ backgroundColor: "#2563eb", color: "white", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Task Management Dashboard</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaUser />
            <span>Hello, {localStorage.getItem("name") || "User"}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f1f5f9" }}>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ backgroundColor: "white", borderRadius: "10px", padding: "20px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "28px", color: s.color }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: "13px", color: "#666" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Task Table + Chart */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>

            {/* Task Table */}
            <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>Latest Tasks</h3>
                <button onClick={() => setShowForm(!showForm)}
                  style={{ backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}>
                  + Create New Task
                </button>
              </div>

              {/* Add Task Form */}
              {showForm && (
                <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", marginBottom: "16px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <input placeholder="Task Title" value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd", minWidth: "200px" }} />
                  <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>On Hold</option>
                    <option>Overdue</option>
                  </select>
                  <input type="date" value={newTask.dueDate}
                    min={today}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
                  <button onClick={handleAddTask}
                    style={{ backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", cursor: "pointer" }}>
                    Add
                  </button>
                </div>
              )}

              {/* Filter Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                {filters.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    style={{ padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px",
                      backgroundColor: activeFilter === f ? "#2563eb" : "#e2e8f0",
                      color: activeFilter === f ? "white" : "#333" }}>
                    {f} ({f === "All" ? tasks.length : f === "Incomplete" ? tasks.filter(t => t.status !== "Completed").length :
                      f === "Overdue" ? tasks.filter(t => t.status === "Overdue").length :
                      f === "Completed" ? tasks.filter(t => t.status === "Completed").length :
                      tasks.filter(t => t.status === "On Hold").length})
                  </button>
                ))}
              </div>

              {/* Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Task ID</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Title</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Priority</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Due Date</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} style={{ borderBottom: "1px solid #e2e8f0" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <td style={{ padding: "10px", color: "#2563eb", fontWeight: "bold" }}>#{task.id}</td>
                      <td style={{ padding: "10px" }}>{task.title}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ backgroundColor: priorityColor[task.priority] + "20", color: priorityColor[task.priority], padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                          {task.priority}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ backgroundColor: (statusColor[task.status] || "#666") + "20", color: statusColor[task.status] || "#666", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px", color: "#666" }}>{task.dueDate}</td>
                      <td style={{ padding: "10px" }}>
                        <button onClick={() => handleDelete(task.id)}
                          style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart */}
            <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h3 style={{ margin: "0 0 16px 0" }}>Task Statistics</h3>
              <PieChart width={250} height={250}>
                <Pie data={chartData} cx={120} cy={110} innerRadius={60} outerRadius={100} dataKey="value">
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div style={{ marginTop: "10px" }}>
                {chartData.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: COLORS[i] }}></div>
                      <span>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: "bold" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;