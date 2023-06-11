import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles/style.css";
import svgIconsTemplate from "./templates/svgIcons.html";
import initialTemplate from "./templates/signIn.html";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import adminPageUsersTemplate from "./templates/adminPageUsers.html"
import adminPageUsersTasksTemplate from "./templates/adminPageUsersTasks.html"
import { User } from "./models/User";
import { Task } from "./models/Task";
import { 
  generateUsers, generateTestTasks, getFromStorage, renderTasks, addTask,
  renderAdminMenuItems, removeAdminMenuItems, changeTaskStatus, menuEventsHandler
} from "./utils";
import { State } from "./state";
import { authUser, logout } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");
const logoutForm = document.querySelector("#app-logout-form");
export const fieldHTMLContent = document.querySelector("#content");

document.querySelector('.svg-icons').innerHTML = svgIconsTemplate;
fieldHTMLContent.innerHTML = initialTemplate;
generateUsers();

menuEventsHandler();

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");
  const isLogedIn = authUser(login, password);

  if (isLogedIn) {
    appState.currentUser.login === "test" && !appState.currentUserTasks.length ? generateTestTasks(appState.currentUser.id) : false;
    appState.tasks = null;
    appState.tasks = getFromStorage("tasks");
    fieldHTMLContent.innerHTML = taskFieldTemplate;
    renderTasks(appState.currentUserTasks);
    if (appState.currentUser.role === "admin") {
      renderAdminMenuItems();
    }
    loginForm.classList.add('d-none');
    logoutForm.classList.remove('d-none');
    loginForm.childNodes[1].value = '';
    loginForm.childNodes[3].value = '';
  } else {
    fieldHTMLContent.innerHTML = noAccessTemplate;
    fieldHTMLContent.innerHTML += initialTemplate;
  }
  addTask();
  changeTaskStatus(appState.currentUserTasks);
});

logoutForm.addEventListener("submit", function(e) {
  e.preventDefault();
  removeAdminMenuItems();
  logout();
  fieldHTMLContent.innerHTML = initialTemplate;
  loginForm.classList.remove('d-none');
  logoutForm.classList.add('d-none');
  document.querySelector("span.active-tasks").innerText = "-";
  document.querySelector("span.finished-tasks").innerText = "-";
});


