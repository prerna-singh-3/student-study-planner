import { useEffect, useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   DEFAULT TASKS
========================================================= */

const initialTasks = [
  {
    id: 1,
    title: "Revise Finite Automata",
    subject: "Theory of Computation",
    date: "2026-09-22",
    time: "07:00 PM",
    duration: 60,
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Practice DSA Arrays",
    subject: "DSA",
    date: "2026-09-22",
    time: "08:15 PM",
    duration: 90,
    priority: "High",
    completed: false,
  },
  {
    id: 3,
    title: "Social Network Assignment",
    subject: "Social Network Analysis",
    date: "2026-09-23",
    time: "05:30 PM",
    duration: 60,
    priority: "Medium",
    completed: false,
  },
  {
    id: 4,
    title: "Machine Learning Revision",
    subject: "Machine Learning",
    date: "2026-09-24",
    time: "06:00 PM",
    duration: 90,
    priority: "Medium",
    completed: false,
  },
  {
    id: 5,
    title: "Practice Binary Search",
    subject: "DSA",
    date: "2026-09-22",
    time: "08:00 PM",
    duration: 60,
    priority: "High",
    completed: false,
  },
];

/* =========================================================
   SUBJECTS
========================================================= */

const subjects = [
  {
    name: "DSA",
    color: "#7c3aed",
    hours: 12,
  },
  {
    name: "Machine Learning",
    color: "#2563eb",
    hours: 8,
  },
  {
    name: "Theory of Computation",
    color: "#059669",
    hours: 7,
  },
  {
    name: "Social Network Analysis",
    color: "#ea580c",
    hours: 5,
  },
  {
    name: "Computer Networks",
    color: "#db2777",
    hours: 4,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    return initialTasks;
  }

  return tasks.map((task, index) => ({
    id: task.id ?? Date.now() + index,
    title: task.title ?? "Untitled Task",
    subject: task.subject ?? "DSA",
    date: task.date ?? getToday(),
    time: task.time ?? "07:00 PM",
    duration: Number(task.duration) || 60,
    priority: task.priority ?? "Medium",
    completed: Boolean(task.completed),
  }));
};

/* =========================================================
   APP
========================================================= */

function App() {
  /* =======================================================
     STATE
  ======================================================= */

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("study-planner-tasks");

      if (saved) {
        return normalizeTasks(JSON.parse(saved));
      }

      return initialTasks;
    } catch (error) {
      console.error("Could not load saved tasks:", error);
      return initialTasks;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");

  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    subject: "DSA",
    date: getToday(),
    time: "07:00 PM",
    duration: 60,
    priority: "Medium",
  });

  /* =======================================================
     SAVE TASKS
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "study-planner-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.completed).length;
  }, [tasks]);

  const pendingTasks = useMemo(() => {
    return tasks.filter((task) => !task.completed).length;
  }, [tasks]);

  const totalHours = useMemo(() => {
    return (
      tasks.reduce(
        (sum, task) => sum + Number(task.duration || 0),
        0
      ) / 60
    );
  }, [tasks]);

  const completedHours = useMemo(() => {
    return (
      tasks
        .filter((task) => task.completed)
        .reduce(
          (sum, task) => sum + Number(task.duration || 0),
          0
        ) / 60
    );
  }, [tasks]);

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  /* =======================================================
     FILTERED TASKS
  ======================================================= */

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Completed"
          ? task.completed
          : !task.completed;

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        searchValue === ""
          ? true
          : task.title.toLowerCase().includes(searchValue) ||
            task.subject.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  /* =======================================================
     TODAY'S TASKS
  ======================================================= */

  const today = getToday();

  const todaysTasks = useMemo(() => {
    return tasks
      .filter((task) => task.date === today)
      .sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
  }, [tasks, today]);

  /* =======================================================
     ADD TASK
  ======================================================= */

  const addTask = (event) => {
    event.preventDefault();

    if (!newTask.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title.trim(),
      subject: newTask.subject,
      date: newTask.date,
      time: newTask.time,
      duration: Number(newTask.duration),
      priority: newTask.priority,
      completed: false,
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      task,
    ]);

    setNewTask({
      title: "",
      subject: "DSA",
      date: getToday(),
      time: "07:00 PM",
      duration: 60,
      priority: "Medium",
    });

    setShowModal(false);
  };

  /* =======================================================
     TOGGLE TASK
  ======================================================= */

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  /* =======================================================
     RESET ALL TASKS
  ======================================================= */

  const resetTasks = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all tasks?"
    );

    if (!confirmed) return;

    setTasks(initialTasks);
  };

  /* =======================================================
     SUBJECT HOURS
  ======================================================= */

  const getSubjectHours = (subjectName) => {
    const minutes = tasks
      .filter((task) => task.subject === subjectName)
      .reduce(
        (sum, task) => sum + Number(task.duration || 0),
        0
      );

    return minutes / 60;
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigationItems = [
    {
      name: "Dashboard",
      icon: "▦",
    },
    {
      name: "My Tasks",
      icon: "✓",
    },
    {
      name: "Schedule",
      icon: "◷",
    },
    {
      name: "Subjects",
      icon: "▤",
    },
    {
      name: "Progress",
      icon: "◉",
    },
  ];

  /* =======================================================
     TASK CARD
  ======================================================= */

  const TaskCard = ({ task }) => {
    return (
      <div
        className={`task-card ${
          task.completed ? "task-completed" : ""
        }`}
      >
        <div className="task-left">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />

          <div className="task-info">
            <h3
              className={
                task.completed ? "completed-title" : ""
              }
            >
              {task.title}
            </h3>

            <p>
              {task.subject} • {task.time} •{" "}
              {task.duration} min
            </p>
          </div>
        </div>

        <div className="task-right">
          <span
            className={`priority priority-${task.priority.toLowerCase()}`}
          >
            {task.priority}
          </span>

          <button
            className="delete-task"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  /* =======================================================
     DASHBOARD
  ======================================================= */

  const Dashboard = () => {
    return (
      <>
        <div className="top-header">
          <div>
            <p className="date-label">
              {formatDate(today)}
            </p>

            <h1>
              Good evening, Prerna 👋
            </h1>

            <p className="subtitle">
              Stay focused and make progress toward your
              goals.
            </p>
          </div>

          <button
            className="add-task-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Study Task
          </button>
        </div>

        {/* STAT CARDS */}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              ✓
            </div>

            <div>
              <span>Tasks Completed</span>

              <strong>
                {completedTasks}/{tasks.length}
              </strong>

              <small>
                {progress}% complete
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              ◷
            </div>

            <div>
              <span>Study Hours</span>

              <strong>
                {totalHours.toFixed(1)}h
              </strong>

              <small>
                of {Math.max(6, Math.ceil(totalHours))}h
                planned
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              🔥
            </div>

            <div>
              <span>Current Streak</span>

              <strong>7 Days</strong>

              <small>
                Personal best: 12 days
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ★
            </div>

            <div>
              <span>Weekly Goal</span>

              <strong>68%</strong>

              <small>17 of 25 hours</small>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* TODAY'S PLAN */}

          <section className="content-card study-plan">
            <div className="section-header">
              <div>
                <h2>Today's Study Plan</h2>

                <p>Manage your study tasks</p>
              </div>

              <div className="filter-tabs">
                {["All", "Pending", "Completed"].map(
                  (item) => (
                    <button
                      key={item}
                      className={
                        filter === item ? "selected" : ""
                      }
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* SEARCH */}

            <div className="search-box">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search tasks or subjects..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            {/* TASKS */}

            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div>📚</div>

                  <h3>No tasks found</h3>

                  <p>
                    Try changing your filter or add a new
                    study task.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                  />
                ))
              )}
            </div>
          </section>

          {/* TODAY'S PROGRESS */}

          <section className="right-column">
            <div className="content-card progress-card">
              <div className="section-header">
                <div>
                  <h2>Today's Progress</h2>

                  <p>Keep going!</p>
                </div>

                <strong className="progress-number">
                  {progress}%
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="progress-labels">
                <span>
                  {completedTasks} completed
                </span>

                <span>
                  {pendingTasks} remaining
                </span>
              </div>
            </div>

            {/* SUBJECTS */}

            <div className="content-card subjects-card">
              <div className="section-header">
                <div>
                  <h2>Subjects</h2>

                  <p>Your study focus</p>
                </div>

                <button
                  className="view-all-btn"
                  onClick={() =>
                    setActivePage("Subjects")
                  }
                >
                  View all
                </button>
              </div>

              <div className="subject-list">
                {subjects.map((subject) => {
                  const hours = getSubjectHours(
                    subject.name
                  );

                  const plannedPercentage = Math.min(
                    100,
                    Math.round(
                      (hours / subject.hours) * 100
                    )
                  );

                  return (
                    <div
                      className="subject-row"
                      key={subject.name}
                    >
                      <div className="subject-name">
                        <span
                          className="subject-dot"
                          style={{
                            backgroundColor:
                              subject.color,
                          }}
                        />

                        <div>
                          <strong>
                            {subject.name}
                          </strong>

                          <small>
                            {hours.toFixed(1)} hrs planned
                          </small>
                        </div>
                      </div>

                      <div className="subject-progress">
                        <div>
                          <span
                            style={{
                              width: `${plannedPercentage}%`,
                              backgroundColor:
                                subject.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </>
    );
  };

  /* =======================================================
     MY TASKS PAGE
  ======================================================= */

  const MyTasksPage = () => {
    return (
      <>
        <div className="top-header">
          <div>
            <p className="date-label">Study Planner</p>

            <h1>My Tasks</h1>

            <p className="subtitle">
              Manage all your study tasks in one place.
            </p>
          </div>

          <button
            className="add-task-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Study Task
          </button>
        </div>

        <div className="content-card full-width-card">
          <div className="section-header">
            <div>
              <h2>All Study Tasks</h2>

              <p>
                {completedTasks} completed •{" "}
                {pendingTasks} pending
              </p>
            </div>

            <div className="filter-tabs">
              {["All", "Pending", "Completed"].map(
                (item) => (
                  <button
                    key={item}
                    className={
                      filter === item ? "selected" : ""
                    }
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search tasks or subjects..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div>📚</div>

                <h3>No tasks found</h3>

                <p>
                  Add a new task to start building your
                  study plan.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  /* =======================================================
     SCHEDULE PAGE
  ======================================================= */

  const SchedulePage = () => {
    const groupedTasks = {};

    [...tasks]
      .sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }

        return a.date.localeCompare(b.date);
      })
      .forEach((task) => {
        if (!groupedTasks[task.date]) {
          groupedTasks[task.date] = [];
        }

        groupedTasks[task.date].push(task);
      });

    return (
      <>
        <div className="top-header">
          <div>
            <p className="date-label">Study Planner</p>

            <h1>Schedule</h1>

            <p className="subtitle">
              Your upcoming study schedule.
            </p>
          </div>

          <button
            className="add-task-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Study Task
          </button>
        </div>

        {Object.keys(groupedTasks).length === 0 ? (
          <div className="content-card empty-state">
            <div>📅</div>

            <h3>No scheduled tasks</h3>

            <p>
              Add a study task to create your schedule.
            </p>
          </div>
        ) : (
          <div className="schedule-list">
            {Object.entries(groupedTasks).map(
              ([date, dateTasks]) => (
                <div
                  className="content-card schedule-day"
                  key={date}
                >
                  <div className="schedule-date">
                    <div>
                      <h2>{formatDate(date)}</h2>

                      <p>
                        {dateTasks.length} task
                        {dateTasks.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="task-list">
                    {dateTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </>
    );
  };

  /* =======================================================
     SUBJECTS PAGE
  ======================================================= */

  const SubjectsPage = () => {
    return (
      <>
        <div className="top-header">
          <div>
            <p className="date-label">Study Planner</p>

            <h1>Subjects</h1>

            <p className="subtitle">
              Track your study focus by subject.
            </p>
          </div>
        </div>

        <div className="subject-page-grid">
          {subjects.map((subject) => {
            const subjectTasks = tasks.filter(
              (task) =>
                task.subject === subject.name
            );

            const subjectCompleted =
              subjectTasks.filter(
                (task) => task.completed
              ).length;

            const hours = getSubjectHours(
              subject.name
            );

            const percentage =
              subjectTasks.length === 0
                ? 0
                : Math.round(
                    (subjectCompleted /
                      subjectTasks.length) *
                      100
                  );

            return (
              <div
                className="content-card subject-large-card"
                key={subject.name}
              >
                <div className="subject-large-header">
                  <div
                    className="large-subject-icon"
                    style={{
                      backgroundColor: subject.color,
                    }}
                  >
                    {subject.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2>{subject.name}</h2>

                    <p>
                      {subjectTasks.length} task
                      {subjectTasks.length !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="subject-stat-row">
                  <span>Study Hours</span>

                  <strong>
                    {hours.toFixed(1)}h
                  </strong>
                </div>

                <div className="subject-stat-row">
                  <span>Completed</span>

                  <strong>
                    {subjectCompleted}/
                    {subjectTasks.length}
                  </strong>
                </div>

                <div className="subject-progress-large">
                  <div
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        subject.color,
                    }}
                  />
                </div>

                <small>{percentage}% completed</small>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* =======================================================
     PROGRESS PAGE
  ======================================================= */

  const ProgressPage = () => {
    return (
      <>
        <div className="top-header">
          <div>
            <p className="date-label">Study Planner</p>

            <h1>Your Progress</h1>

            <p className="subtitle">
              Keep track of your study progress.
            </p>
          </div>
        </div>

        <div className="stats-grid progress-stats">
          <div className="stat-card">
            <div className="stat-icon purple">
              ✓
            </div>

            <div>
              <span>Completed Tasks</span>

              <strong>{completedTasks}</strong>

              <small>
                out of {tasks.length} total
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              ◷
            </div>

            <div>
              <span>Total Study Hours</span>

              <strong>
                {totalHours.toFixed(1)}h
              </strong>

              <small>planned</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ★
            </div>

            <div>
              <span>Completed Hours</span>

              <strong>
                {completedHours.toFixed(1)}h
              </strong>

              <small>study completed</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              %
            </div>

            <div>
              <span>Overall Progress</span>

              <strong>{progress}%</strong>

              <small>completion rate</small>
            </div>
          </div>
        </div>

        <div className="content-card progress-overview">
          <div className="section-header">
            <div>
              <h2>Overall Progress</h2>

              <p>
                {completedTasks} of {tasks.length} tasks
                completed
              </p>
            </div>

            <strong className="progress-number">
              {progress}%
            </strong>
          </div>

          <div className="progress-bar large">
            <div
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="progress-labels">
            <span>Start</span>

            <span>Keep going!</span>

            <span>100%</span>
          </div>
        </div>

        <div className="content-card">
          <div className="section-header">
            <div>
              <h2>Subject Progress</h2>

              <p>Performance by subject</p>
            </div>
          </div>

          <div className="subject-list">
            {subjects.map((subject) => {
              const subjectTasks = tasks.filter(
                (task) =>
                  task.subject === subject.name
              );

              const completed =
                subjectTasks.filter(
                  (task) => task.completed
                ).length;

              const percentage =
                subjectTasks.length === 0
                  ? 0
                  : Math.round(
                      (completed /
                        subjectTasks.length) *
                        100
                    );

              return (
                <div
                  className="subject-row"
                  key={subject.name}
                >
                  <div className="subject-name">
                    <span
                      className="subject-dot"
                      style={{
                        backgroundColor:
                          subject.color,
                      }}
                    />

                    <div>
                      <strong>
                        {subject.name}
                      </strong>

                      <small>
                        {completed}/
                        {subjectTasks.length} completed
                      </small>
                    </div>
                  </div>

                  <div className="subject-progress">
                    <div>
                      <span
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            subject.color,
                        }}
                      />
                    </div>
                  </div>

                  <strong>{percentage}%</strong>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  /* =======================================================
     CURRENT PAGE
  ======================================================= */

  const renderPage = () => {
    switch (activePage) {
      case "My Tasks":
        return <MyTasksPage />;

      case "Schedule":
        return <SchedulePage />;

      case "Subjects":
        return <SubjectsPage />;

      case "Progress":
        return <ProgressPage />;

      case "Dashboard":
      default:
        return <Dashboard />;
    }
  };

  /* =======================================================
     APP UI
  ======================================================= */

  return (
    <div className="app">
      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="sidebar">
        {/* BRAND */}

        <div className="brand">
          <div className="brand-icon">SP</div>

          <div>
            <h2>StudyFlow</h2>

            <span>Student Planner</span>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav>
          {navigationItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(item.name)
              }
            >
              <span>{item.icon}</span>

              {item.name}
            </button>
          ))}
        </nav>

        {/* STREAK */}

        <div className="streak-card">
          <div className="streak-icon">🔥</div>

          <div>
            <strong>7 day streak!</strong>

            <span>Keep studying!</span>
          </div>
        </div>

        {/* PROFILE */}

        <div className="profile-card">
          <div className="profile-avatar">P</div>

          <div>
            <strong>Prerna</strong>

            <span>CSE • Data Science</span>
          </div>
        </div>
      </aside>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="main-content">
        {renderPage()}
      </main>

      {/* ===================================================
          ADD TASK MODAL
      =================================================== */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="modal-header">
              <div>
                <h2>Add Study Task</h2>

                <p>
                  Create a new task for your study plan.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={addTask}>
              {/* TITLE */}

              <label>
                Task title

                <input
                  type="text"
                  placeholder="e.g. Practice Binary Trees"
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      title: event.target.value,
                    })
                  }
                  required
                />
              </label>

              {/* SUBJECT */}

              <label>
                Subject

                <select
                  value={newTask.subject}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      subject:
                        event.target.value,
                    })
                  }
                >
                  {subjects.map((subject) => (
                    <option
                      key={subject.name}
                      value={subject.name}
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* DATE + TIME */}

              <div className="form-row">
                <label>
                  Date

                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        date: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Time

                  <input
                    type="text"
                    value={newTask.time}
                    placeholder="07:00 PM"
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        time: event.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>

              {/* DURATION + PRIORITY */}

              <div className="form-row">
                <label>
                  Duration (minutes)

                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newTask.duration}
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        duration:
                          Number(
                            event.target.value
                          ) || 15,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Priority

                  <select
                    value={newTask.priority}
                    onChange={(event) =>
                      setNewTask({
                        ...newTask,
                        priority:
                          event.target.value,
                      })
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>
                </label>
              </div>

              {/* BUTTONS */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                >
                  Add Study Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;