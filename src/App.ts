import { Fetch, Data, ITask, PatchTask } from "./Fetch.js";

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
  alert: HTMLDivElement | null;
  close: HTMLSpanElement | null;
  input: HTMLInputElement | null;
  arrow: HTMLDivElement | null;
  table: HTMLTableSectionElement | null;
  text: string | null;
  allTasks: Data | null;
  buttons: NodeListOf<HTMLButtonElement> | null;
  constructor() {
    this.alert = document.querySelector(".alert");
    this.close = this.alert?.firstElementChild as HTMLElement;
    this.input = document.querySelector("input");
    this.arrow = document.querySelector(".arrow");
    this.table = document.querySelector("tbody");
    this.text = null;
    this.allTasks = null;
    this.buttons = document.querySelectorAll(".main .header button");
  }
  init = async () => {
    //eventos
    //Cerrar la alerta en el botón con la X
    if (this.close !== null) {
      this.close.addEventListener("click", () => {
        this.alert?.classList.remove("dismissible");
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
        if (
          this.input?.value !== "" &&
          !this.alert?.classList.contains("dismissible")
        ) {
          this.alert?.classList.add("dismissible");
        }
      });
    }
    //Añadir una nueva tarea
    if (this.arrow !== null) {
      this.arrow.addEventListener("click", (e: Event) => {
        e.preventDefault();
        this.addTask(this.input, this.alert);
      });
    }
    // Filtrar las tareas
    if (this.buttons !== null) {
      this.buttons.forEach((button, _, allButtons) => {
        button.addEventListener("click", () => {
          allButtons.forEach((button) => {
            if (button.classList.contains("active")) {
              button.classList.remove("active");
            }
          });
          button.classList.add("active");
          this.filterTasks(button.textContent as string);
        });
      });
    }
    // Fetch all tasks
    this.allTasks = await Fetch.getAll();
    // Render all tasks
    this.renderTasks(this.allTasks as Data);
  };
  filterTasks = async (filter: string) => {
    switch (filter) {
      case "All":
        if (this.allTasks !== null && this.table !== null) {
          this.table.innerHTML = "";
          this.renderTasks(this.allTasks as Data);
        }
        break;
      case "Completed":
        if (this.allTasks !== null && this.table !== null) {
          let completedTasks: Data = this.allTasks?.filter(
            (task: ITask) => task.isDone
          );
          this.table.innerHTML = "";
          this.renderTasks(completedTasks);
        }
        break;
      case "Uncompleted":
        if (this.allTasks !== null && this.table !== null) {
          let uncompletedTasks: Data = this.allTasks?.filter(
            (task: ITask) => !task.isDone
          );
          this.table.innerHTML = "";
          this.renderTasks(uncompletedTasks);
        }
        break;
      default:
        throw new Error("Filter not found");
    }
  };
  // //prepara una plantilla HTML, y la actualiza con contenido dinámico
  generateRow = (id: string, title: string, done: boolean) => {
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
    newRow.firstElementChild?.firstElementChild?.addEventListener(
      "click",
      (e: Event) => this.crossOut(e)
    );
    //Activar el modo edición desde la tarea
    newRow.firstElementChild?.lastElementChild?.addEventListener(
      "focus",
      (e: Event) => {
        let currentEvent = e as Event & { currentTarget: HTMLElement };
        this.editModeOn(currentEvent, true);
      }
    );
    //Desactivar el modo edición
    newRow.firstElementChild?.lastElementChild?.addEventListener(
      "blur",
      (e) => {
        let currentEvent = e as Event & {
          currentTarget: HTMLElement;
          target: HTMLElement;
        };
        this.editModeOff(currentEvent);
      }
    );
    //Activar el modo edición desde el icono
    newRow.firstElementChild?.nextElementSibling?.firstElementChild?.lastElementChild?.addEventListener(
      "click",
      (e) => {
        let currentEvent = e as Event & { currentTarget: HTMLElement };
        this.editModeOn(currentEvent, false);
      }
    );
    //Eliminar la fila
    newRow.lastElementChild?.firstElementChild?.lastElementChild?.addEventListener(
      "click",
      (e) => {
        let currentEvent = e as Event & { target: HTMLElement };
        this.removeRow(currentEvent, false);
      }
    );
    return newRow;
  };
  // Añade todas las tareas a la tabla
  renderTasks = (tasks: Data) => {
    if (this.table !== null) {
      tasks.forEach((task) => {
        this.table?.appendChild(
          this.generateRow(task.id, task.title, task.isDone)
        );
      });
    }
  };
  // //Tachado de tarea
  crossOut = (e: Event) => {
    let task: HTMLElement | null = (e.target as HTMLElement)
      ?.nextElementSibling as HTMLElement;
    let text: string | null = task?.innerHTML as string | null;
    const row = (task as HTMLElement)?.parentNode?.parentNode;
    // if (text?.includes("<del>")) {
    //   text = task?.firstElementChild?.textContent as string;
    //   task.innerHTML = text;
    //   // Para validar que existe el elemento, antes de acceder a sus propiedades
    //   if (row instanceof HTMLElement) {
    //     row.setAttribute("data-completed", "false");
    //   }
    // } else {
    //   task.innerHTML = `<del>${text}</del>`;
    //   if (row instanceof HTMLElement) {
    //     row.setAttribute("data-completed", "true");
    //   }
    // }
    // en lugar de tachar la tarea en el html, la tachamos/destachamos en la base de datos
    if (row instanceof HTMLElement) {
      let id = row.getAttribute("id");
      if (id !== null) {
        let task: PatchTask = {
          id: id,
          isDone: !text?.includes("<del>"),
        };
        Fetch.update(task);
      }
    }
  };
  //Añadir nueva tarea
  addTask = async (
    input: HTMLInputElement | null,
    alert: HTMLDivElement | null
  ) => {
    let text: string;
    if (input?.value.trim() === "") {
      input.value = "";
      alert?.classList.remove("dismissible");
    } else if (input !== null) {
      text = input?.value;
      // document
      //   .querySelector("tbody")
      //   ?.appendChild(this.generateRow(this.idGenerator(), text, false));
      // input.value = "";
      // en lugar de añadir directamente la tarea al html, la añadimos a la base de datos
      // y luego la renderizamos
      let task: ITask = {
        id: this.idGenerator(),
        title: text,
        isDone: false,
      };
      try {
        let result = await Fetch.create(task);
        if (result) {
          // Fetch all tasks
          this.allTasks = await Fetch.getAll();
          // Render all tasks
          this.renderTasks(this.allTasks);
        } else {
          throw new Error("No se ha podido añadir la tarea");
        }
      } catch (error: any) {
        if (alert) {
          alert.textContent = error.message;
          alert.classList.remove("dismissible");
        }
      }
    }
  };
  //Activar el modo edición
  editModeOn = (
    e: Event & { currentTarget: HTMLElement },
    onFocus: boolean
  ) => {
    let task: HTMLElement;
    if (onFocus) {
      task = e.currentTarget;
    } else {
      task = (
        (e.currentTarget?.parentNode as HTMLElement)?.parentNode as HTMLElement
      )?.previousElementSibling?.lastElementChild as HTMLElement;
      task.focus();
    }

    // Comprobar si la tarea está tachada, antes de guardar el texto
    if (task.innerHTML.includes("<del>")) {
      this.text = task?.firstElementChild?.textContent as string;
    } else {
      this.text = task?.textContent as string;
    }
    task.classList.add("editable");
    document.addEventListener("keydown", (e) => {
      if (e.code == "Enter" || e.code == "NumpadEnter" || e.code == "Escape") {
        task.blur();
      }
    });
  };
  //Desactivar el modo edición
  editModeOff = async (
    e: Event & { currentTarget: HTMLElement; target: HTMLElement }
  ) => {
    let task = e.currentTarget;
    if (task.innerHTML === "") {
      this.removeRow(e, true);
    } else {
      task.classList.remove("editable");
      // task.innerHTML = this.clearWhitespaces(task.innerHTML);
      let text: string = this.clearWhitespaces(task.innerHTML);
      // eliminar las etiquetas <del> y </del> del texto antes de compararlo con el texto original
      const regex = /<\/?del>/g;
      const textWithoutDelTags = text.replace(regex, "");
      if (text === "") {
        this.removeRow(e, true);
      } else if (textWithoutDelTags !== this.text) {
        let id: string | null = (
          (task.parentNode as HTMLElement)?.parentNode as HTMLElement
        )?.getAttribute("id");
        if (id !== null) {
          let newTask: PatchTask = {
            id: id,
            title: text,
          };
          try {
            let result = await Fetch.update(newTask);
            if (result) {
              // Fetch all tasks
              this.allTasks = await Fetch.getAll();
              // Render all tasks
              this.renderTasks(this.allTasks);
            } else {
              throw new Error("No se ha podido actualizar la tarea");
            }
          } catch (error: any) {
            if (this.alert) {
              this.alert.textContent = error.message;
              this.alert.classList.remove("dismissible");
            }
          }
        }
      }
    }
  };
  //Eliminación de tarea
  removeRow = async (
    e: Event & { target: HTMLElement },
    editionMode: boolean
  ) => {
    let rowId: string | null;
    if (editionMode) {
      // (
      //   (e.target?.parentNode as HTMLElement)?.parentNode as HTMLElement
      // )?.remove();
      rowId = (
        (e.target?.parentNode as HTMLElement)?.parentNode as HTMLElement
      )?.getAttribute("id");
    } else {
      // (
      //   ((e.target?.parentNode as HTMLElement)?.parentNode as HTMLElement)
      //     ?.parentNode as HTMLElement
      // ).remove();
      rowId = (
        ((e.target?.parentNode as HTMLElement)?.parentNode as HTMLElement)
          ?.parentNode as HTMLElement
      )?.getAttribute("id");
    }
    try {
      if (rowId !== null) {
        await Fetch.delete(rowId);
        // Fetch all tasks
        this.allTasks = await Fetch.getAll();
        // Render all tasks
        this.renderTasks(this.allTasks);
      } else {
        throw new Error("No se ha podido eliminar la tarea, id no encontrado");
      }
    } catch (error: any) {
      if (this.alert) {
        this.alert.textContent = error.message;
        this.alert.classList.remove("dismissible");
      }
    }
  };
  //Eliminación de espacios en blanco
  clearWhitespaces = (text: string): string => {
    return text.replace(new RegExp(/&nbsp;/, "g"), "").trim();
  };
  idGenerator = (): string => {
    // generate random hex string
    return Math.floor(Math.random() * 16777215).toString(16);
  };
}
