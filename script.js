document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
    const noTasksMessage = document.getElementById("noTasksMessage");
    const searchBar = document.getElementById("searchBar");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    const renderTasks = (filter = "all", search = "") => {
      taskList.innerHTML = "";
      const filteredTasks = tasks.filter((task) => {
        const matchesFilter = filter === "all" || (filter === "completed" && task.completed) || (filter === "incomplete" && !task.completed);
        const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      });
      
      filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.draggable = true;
        li.dataset.id = task.id;
        li.className = task.completed ? "completed" : "";
  
        const taskName = document.createElement("span");
        taskName.textContent = task.name;
        taskName.contentEditable = task.isEditing;
        taskName.addEventListener("input", (e) => task.name = e.target.innerText);
  
        const editButton = document.createElement("button");
        editButton.textContent = task.isEditing ? "Save" : "Edit";
        editButton.onclick = () => toggleEditTask(task.id);
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTask(task.id);
  
        const completeButton = document.createElement("button");
        completeButton.textContent = "Mark Completed";
        completeButton.onclick = () => toggleTaskCompletion(task.id);
  
        li.append(taskName, editButton, completeButton, deleteButton);
        taskList.appendChild(li);
      });
      noTasksMessage.classList.toggle("hidden", filteredTasks.length > 0);
    };
  
    const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));
  
    const addTask = () => {
      if (!taskInput.value.trim()) return;
      tasks.push({ id: Date.now().toString(), name: taskInput.value, completed: false, isEditing: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    };
  
    const toggleTaskCompletion = (id) => {
      tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
      saveTasks();
      renderTasks();
    };
  
    const toggleEditTask = (id) => {
      tasks = tasks.map((task) => task.id === id ? { ...task, isEditing: !task.isEditing } : task);
      saveTasks();
      renderTasks();
    };
  
    const deleteTask = (id) => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    };
  
    const filterTasks = (filter) => renderTasks(filter, searchBar.value);
  
    const handleDragStart = (e) => e.dataTransfer.setData("text", e.target.dataset.id);
    const handleDrop = (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text");
      const droppedId = e.target.closest("li").dataset.id;
      const draggedIndex = tasks.findIndex((task) => task.id === draggedId);
      const droppedIndex = tasks.findIndex((task) => task.id === droppedId);
      tasks.splice(droppedIndex, 0, tasks.splice(draggedIndex, 1)[0]);
      saveTasks();
      renderTasks();
    };
  
    taskList.addEventListener("dragover", (e) => e.preventDefault());
    taskList.addEventListener("drop", handleDrop);
  
    addTaskButton.addEventListener("click", addTask);
    searchBar.addEventListener("input", () => renderTasks("all", searchBar.value));
    document.getElementById("showAll").onclick = () => filterTasks("all");
    document.getElementById("showCompleted").onclick = () => filterTasks("completed");
    document.getElementById("showIncomplete").onclick = () => filterTasks("incomplete");
  
    renderTasks();
  });
  