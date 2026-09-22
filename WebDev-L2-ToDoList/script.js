const STORAGE_KEY = "daymark-tasks";
const THEME_KEY = "daylist-theme";

const elements = {
	form: document.querySelector("#taskForm"),
	input: document.querySelector("#taskInput"),
	message: document.querySelector("#formMessage"),
	pending: document.querySelector("#pendingList"),
	completed: document.querySelector("#completedList"),
	pendingEmpty: document.querySelector("#pendingEmpty"),
	completedEmpty: document.querySelector("#completedEmpty"),
	pendingCount: document.querySelector("#pendingCount"),
	completedCount: document.querySelector("#completedCount"),
	totalCount: document.querySelector("#totalCount"),
	overviewPending: document.querySelector("#overviewPending"),
	overviewCompleted: document.querySelector("#overviewCompleted"),
	clearCompleted: document.querySelector("#clearCompleted"),
	todayLabel: document.querySelector("#todayLabel"),
	themeToggle: document.querySelector("#themeToggle")
};

let tasks = loadTasks();

document.body.dataset.theme = localStorage.getItem(THEME_KEY) || "dark";

function updateThemeToggle() {
	if (!elements.themeToggle) return;
	const lightMode = document.body.dataset.theme === "light";
	elements.themeToggle.innerHTML = `<span aria-hidden="true">${lightMode ? "&#9790;" : "&#9789;"}</span>`;
	elements.themeToggle.setAttribute("aria-label", lightMode ? "Switch to dark mode" : "Switch to light mode");
	elements.themeToggle.title = lightMode ? "Switch to dark mode" : "Switch to light mode";
}

if (elements.themeToggle) elements.themeToggle.addEventListener("click", () => {
	document.body.dataset.theme = document.body.dataset.theme === "light" ? "dark" : "light";
	localStorage.setItem(THEME_KEY, document.body.dataset.theme);
	updateThemeToggle();
});
updateThemeToggle();

if (elements.todayLabel) {
	elements.todayLabel.textContent = new Intl.DateTimeFormat("en-US", {
		weekday: "long", month: "short", day: "numeric"
	}).format(new Date());
}

function loadTasks() {
	try {
		const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
		return Array.isArray(savedTasks) ? savedTasks : [];
	} catch (error) {
		return [];
	}
}

function saveTasks() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
	return { id: Date.now(), title, completed: false, createdAt: new Date().toISOString() };
}

function formatTime(isoDate) {
	return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(isoDate));
}

function render() {
	const pendingTasks = tasks.filter((task) => !task.completed);
	const completedTasks = tasks.filter((task) => task.completed);

	if (elements.pending) {
		elements.pending.innerHTML = pendingTasks.map(taskTemplate).join("");
		elements.completed.innerHTML = completedTasks.map(taskTemplate).join("");
		elements.pendingEmpty.hidden = pendingTasks.length > 0;
		elements.completedEmpty.hidden = completedTasks.length > 0;
		elements.pendingCount.textContent = `${pendingTasks.length} remaining`;
		elements.completedCount.textContent = `${completedTasks.length} done`;
	}
	if (elements.totalCount) elements.totalCount.textContent = tasks.length;
	if (elements.overviewPending) elements.overviewPending.textContent = pendingTasks.length;
	if (elements.overviewCompleted) elements.overviewCompleted.textContent = completedTasks.length;

}

function taskTemplate(task) {
	return `<article class="task-item" data-id="${task.id}">
		<button class="task-check" type="button" data-action="toggle" aria-label="${task.completed ? "Mark as pending" : "Mark as complete"}">${task.completed ? "✓" : ""}</button>
		<div class="task-content"><div class="task-text">${escapeHtml(task.title)}</div><div class="task-time">${task.completed ? `Completed at ${formatTime(task.completedAt || task.createdAt)}` : `Added ${formatTime(task.createdAt)}`}</div></div>
		<div class="task-actions">
	      ${task.completed ? "" : '<button class="icon-button edit-button" type="button" data-action="edit" aria-label="Edit task" title="Edit task"><span aria-hidden="true">&#9998;</span></button>'}
	      <button class="icon-button delete-button" type="button" data-action="delete" aria-label="Delete task" title="Delete task"><span aria-hidden="true">&#128465;</span></button>
		</div>
	</article>`;
}

function escapeHtml(value) {
	return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function showMessage(message) {
	if (!elements.message) return;
	elements.message.textContent = message;
	window.setTimeout(() => { elements.message.textContent = ""; }, 2500);
}

if (elements.form) elements.form.addEventListener("submit", (event) => {
	event.preventDefault();
	const title = elements.input.value.trim();
	if (!title) return;
	tasks.unshift(createTask(title));
	saveTasks();
	render();
	elements.form.reset();
	elements.input.focus();
});

const lists = document.querySelector(".lists");
if (lists) lists.addEventListener("click", (event) => {
	const actionButton = event.target.closest("[data-action]");
	if (!actionButton) return;
	const item = actionButton.closest("[data-id]");
	const taskId = Number(item.dataset.id);
	const task = tasks.find((entry) => entry.id === taskId);
	if (!task) return;

	if (actionButton.dataset.action === "toggle") {
		task.completed = !task.completed;
		task.completedAt = task.completed ? new Date().toISOString() : null;
	}
	if (actionButton.dataset.action === "delete") tasks = tasks.filter((entry) => entry.id !== taskId);
	if (actionButton.dataset.action === "edit") beginEdit(item, task);
	if (actionButton.dataset.action !== "edit") { saveTasks(); render(); }
});

function beginEdit(item, task) {
	const content = item.querySelector(".task-content");
	content.innerHTML = `<input class="edit-input" type="text" maxlength="120" value="${escapeHtml(task.title)}" aria-label="Edit task title">`;
	const input = content.querySelector("input");
	input.focus();
	input.select();
	const finishEdit = () => {
		const title = input.value.trim();
		if (title) task.title = title;
		saveTasks();
		render();
	};
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") finishEdit();
		if (event.key === "Escape") render();
	});
	input.addEventListener("blur", finishEdit, { once: true });
}

if (elements.clearCompleted) elements.clearCompleted.addEventListener("click", () => {
	if (!tasks.some((task) => task.completed)) {
		showMessage("There are no completed tasks to clear.");
		return;
	}
	tasks = tasks.filter((task) => !task.completed);
	saveTasks();
	render();
});

render();
