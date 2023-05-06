/**
 * @class Fetch
 * @description Clase para realizar las peticiones a la API
 * @method getAll() Obtiene todas las tareas
 * @method create(task) Crea una tarea
 * @method update(task) Actualiza una tarea
 * @method delete(id) Elimina una tarea
 * @property BASE_URL URL base de la API
 * @static
 * @throws Error
 * @returns {Promise} Promise
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Fetch {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.BASE_URL);
            if (!response.ok) {
                throw new Error(`Error al obtener las tareas: ${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    static create(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error(`Error al crear la tarea: ${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    static update(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.BASE_URL}/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error(`Error al actualizar la tarea: ${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.BASE_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Error al eliminar la tarea: ${response.status} ${response.statusText}`);
            }
        });
    }
}
Fetch.BASE_URL = "http://localhost:8000/tasks";
export { Fetch };
