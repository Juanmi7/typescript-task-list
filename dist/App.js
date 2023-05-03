var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Fetch } from "./Fetch.js";
/**
 * @class App
 * @description Clase principal de la aplicación
 * @method init() Inicializa la aplicación
 * @method generateRow(id, title, done) Genera una fila de la tabla
 * @method renderTasks(tasks) Renderiza todas las tareas
 * @method addTask(input, alert) Añade una nueva tarea
 * @method crossOut(e) Marca o desmarca una tarea realizada
 * @method editModeOn(e, fromTask) Activa el modo edición
 * @method editModeOff(e, fromTask) Desactiva el modo edición
 * @method removeRow(e) Elimina una tarea
 * @method clearWhitespaces(str) Elimina los espacios en blanco de la tarea en el modo edición
 * @method idGenerator() Genera un id aleatorio hexadecimal
 * @property alert Alerta de error
 * @property close Botón para cerrar la alerta
 * @property input Input para añadir una nueva tarea
 * @property arrow Botón para guardar una nueva tarea
 * @property table Tabla de tareas
 * @throws Error
 * @returns {Promise} Promise
 *
 */
export class App {
    constructor() {
        var _a;
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            //eventos
            //Cerrar la alerta en el botón con la X
            if (this.close !== null) {
                this.close.addEventListener("click", () => {
                    var _a;
                    (_a = this.alert) === null || _a === void 0 ? void 0 : _a.classList.remove("dismissible");
                });
            }
            //Impedir la recarga de la página y añadir una nueva tarea
            if (this.input !== null) {
                this.input.addEventListener("keydown", (e) => {
                    if (e.code == "Enter" || e.code == "NumpadEnter") {
                        e.preventDefault();
                        this.addTask(this.input, this.alert);
                    }
                });
                this.input.addEventListener("input", (e) => {
                    var _a, _b, _c;
                    if (((_a = this.input) === null || _a === void 0 ? void 0 : _a.value) !== "" &&
                        !((_b = this.alert) === null || _b === void 0 ? void 0 : _b.classList.contains("dismissible"))) {
                        (_c = this.alert) === null || _c === void 0 ? void 0 : _c.classList.add("dismissible");
                    }
                });
            }
            if (this.arrow !== null) {
                //Añadir una nueva tarea
                this.arrow.addEventListener("click", () => {
                    this.addTask(this.input, this.alert);
                });
            }
            // Fetch all tasks
            let tasks = yield Fetch.getAll();
            // Render all tasks
            this.renderTasks(tasks);
        });
        // //prepara una plantilla HTML, y la actualiza con contenido dinámico
        this.generateRow = (id, title, done) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            let newRow = document.createElement("tr");
            newRow.setAttribute("id", id);
            title = done ? `<del>${title}</del>` : title;
            newRow.innerHTML = `
<td>
  <i class="fa-solid fa-circle-check"></i>
  <span contenteditable="true" class="task">${title}</span>
</td>
<td>
  <span class="fa-stack fa-2x">
    <i class="fa-solid fa-square fa-stack-2x"></i>
    <i class="fa-solid fa-stack-1x fa-pencil fa-inverse"></i>
  </span>
</td>
<td>
  <span class="fa-stack fa-2x">
    <i class="fa-solid fa-square fa-stack-2x"></i>
    <i class="fa-solid fa-stack-1x fa-trash fa-inverse"></i>
  </span>
</td>
  `;
            //Tachar una tarea realizada
            (_b = (_a = newRow.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => this.crossOut(e));
            //Activar el modo edición desde la tarea
            (_d = (_c = newRow.firstElementChild) === null || _c === void 0 ? void 0 : _c.lastElementChild) === null || _d === void 0 ? void 0 : _d.addEventListener("focus", (e) => {
                let currentEvent = e;
                this.editModeOn(currentEvent, true);
            });
            //Desactivar el modo edición
            (_f = (_e = newRow.firstElementChild) === null || _e === void 0 ? void 0 : _e.lastElementChild) === null || _f === void 0 ? void 0 : _f.addEventListener("blur", (e) => {
                let currentEvent = e;
                this.editModeOff(currentEvent);
            });
            //Activar el modo edición desde el icono
            (_k = (_j = (_h = (_g = newRow.firstElementChild) === null || _g === void 0 ? void 0 : _g.nextElementSibling) === null || _h === void 0 ? void 0 : _h.firstElementChild) === null || _j === void 0 ? void 0 : _j.lastElementChild) === null || _k === void 0 ? void 0 : _k.addEventListener("click", (e) => {
                let currentEvent = e;
                this.editModeOn(currentEvent, false);
            });
            //Eliminar la fila
            (_o = (_m = (_l = newRow.lastElementChild) === null || _l === void 0 ? void 0 : _l.firstElementChild) === null || _m === void 0 ? void 0 : _m.lastElementChild) === null || _o === void 0 ? void 0 : _o.addEventListener("click", (e) => {
                let currentEvent = e;
                this.removeRow(currentEvent, false);
            });
            return newRow;
        };
        // Añade todas las tareas a la tabla
        this.renderTasks = (tasks) => {
            if (this.table !== null) {
                tasks.forEach((task) => {
                    var _a;
                    (_a = this.table) === null || _a === void 0 ? void 0 : _a.appendChild(this.generateRow(task.id, task.title, task.isDone));
                });
            }
        };
        // //Tachado de tarea
        this.crossOut = (e) => {
            var _a, _b, _c;
            let task = (_a = e.target) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
            let text = task === null || task === void 0 ? void 0 : task.innerHTML;
            const row = (_b = task === null || task === void 0 ? void 0 : task.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
            if (text === null || text === void 0 ? void 0 : text.includes("<del>")) {
                text = (_c = task === null || task === void 0 ? void 0 : task.firstElementChild) === null || _c === void 0 ? void 0 : _c.textContent;
                task.innerHTML = text;
                // Para validar que existe el elemento, antes de acceder a sus propiedades
                if (row instanceof HTMLElement) {
                    row.setAttribute("data-completed", "false");
                }
            }
            else {
                task.innerHTML = `<del>${text}</del>`;
                if (row instanceof HTMLElement) {
                    row.setAttribute("data-completed", "true");
                }
            }
        };
        //Añadir nueva tarea
        this.addTask = (input, alert) => {
            var _a;
            let text;
            if ((input === null || input === void 0 ? void 0 : input.value.trim()) === "") {
                input.value = "";
                alert === null || alert === void 0 ? void 0 : alert.classList.remove("dismissible");
            }
            else if (input !== null) {
                text = input === null || input === void 0 ? void 0 : input.value;
                (_a = document
                    .querySelector("tbody")) === null || _a === void 0 ? void 0 : _a.appendChild(this.generateRow(this.idGenerator(), text, false));
                input.value = "";
            }
        };
        //Activar el modo edición
        this.editModeOn = (e, onFocus) => {
            var _a, _b, _c, _d;
            let task;
            if (onFocus) {
                task = e.currentTarget;
            }
            else {
                task = (_d = (_c = (_b = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode) === null || _c === void 0 ? void 0 : _c.previousElementSibling) === null || _d === void 0 ? void 0 : _d.lastElementChild;
                task.focus();
            }
            task.classList.add("editable");
            document.addEventListener("keydown", (e) => {
                if (e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Escape") {
                    task.blur();
                }
            });
        };
        //Desactivar el modo edición
        this.editModeOff = (e) => {
            let task = e.currentTarget;
            if (task.innerHTML === "") {
                this.removeRow(e, true);
            }
            else {
                task.classList.remove("editable");
                task.innerHTML = this.clearWhitespaces(task.innerHTML);
                if (task.innerHTML === "") {
                    this.removeRow(e, true);
                }
            }
        };
        //Eliminación de tarea
        this.removeRow = (e, editionMode) => {
            var _a, _b, _c, _d, _e, _f;
            if (editionMode) {
                (_c = (_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode) === null || _c === void 0 ? void 0 : _c.remove();
            }
            else {
                ((_f = (_e = (_d = e.target) === null || _d === void 0 ? void 0 : _d.parentNode) === null || _e === void 0 ? void 0 : _e.parentNode) === null || _f === void 0 ? void 0 : _f.parentNode).remove();
            }
        };
        //Eliminación de espacios en blanco
        this.clearWhitespaces = (text) => {
            return text.replace(new RegExp(/&nbsp;/, "g"), "").trim();
        };
        this.idGenerator = () => {
            // generate random hex string
            return Math.floor(Math.random() * 16777215).toString(16);
        };
        this.alert = document.querySelector(".alert");
        this.close = (_a = this.alert) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        this.input = document.querySelector("input");
        this.arrow = document.querySelector(".arrow");
        this.table = document.querySelector("tbody");
    }
}
