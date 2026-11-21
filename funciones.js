const contenedorTareas = document.querySelector("#contenedorTareas");
const divContadoresTareas = document.querySelector("#contadoresTareas");
const contTotalTareas = document.querySelector("#contTotalTareas");
const contTareasCompletadas = document.querySelector("#contTareasCompletadas");


let bAgregandoTarea = false;
let tareas = [];

function agregarTarea() {
    if (bAgregandoTarea == false) {
        bAgregandoTarea = true;

        const uniqueId = crypto.randomUUID();
        contenedorTareas.insertAdjacentHTML("afterbegin", `
            <div class="card text-dark mb-3 shadow-sm" id="tarea-${uniqueId}">
                <div class="card-body" id="tareaBody-${uniqueId}">
                    <h5 class="card-title d-flex align-items-center gap-2">
                                <label id="lbTarea-${uniqueId}" class="text-nowrap">Nueva tarea:</label>
                                <input type="text" id="inputNuevaTarea-${uniqueId}" class="form-control" placeholder="Nombre de la tarea..." />
                     </h5>
                    <div class="d-flex gap-2">
                        <button class="btnCancelar" data-id="${uniqueId}" class="btnCancelar" >Cancelar</button>
                        <button class="btnAgregar" data-id="${uniqueId}">Agregar</button>
                    </div>
                </div>
            </div>
        `);
    }
}

// Evento para agregar una nueva tarea
document.querySelector("#btnNewTarea").addEventListener("click", () => {
    agregarTarea();
});

// Detector de eventos en el contenedor de tareas (Guardar/Editar/Cancelar/Eliminar)
contenedorTareas.addEventListener("click", (e) => {
    const element = e.target;

    if (element.classList.contains("btnAgregar")) {
        const id = element.dataset.id;
        const input = document.querySelector(`#inputNuevaTarea-${id}`);
        if (input.value.trim() !== "") {
            tareas.push({ id: id, nombre: input.value.trim(), completada: false });
            bAgregandoTarea = false;
            const titleTarea = document.querySelector(`#lbTarea-${id}`);
            titleTarea.textContent = "Tarea:";

            element.remove(); // como ya he guardado la tarea, elimino el botón de agregar

            mostrarListaDeTareas();
            mostrarContadoresTareas();
        }
    }
    else if (element.classList.contains("btnCancelar")) {
        const id = element.dataset.id;

        document.querySelector(`#tarea-${id}`).remove();
        bAgregandoTarea = false;
    }
    else if (element.classList.contains("btnEditar")) {
        editarTarea(element);
    }
    else if (element.classList.contains("btnGuardar")) {
        guardarCambios(element);
    }
    else if (element.classList.contains("btnEliminar")) {
        eliminarTarea(element);
    }
});

// Evento para detectar si un checkbox ha sido presionado
contenedorTareas.addEventListener('change', (e) => {
    const element = e.target;

    if (element.type === "checkbox") {
        const id = element.dataset.id;

        const tarea = tareas.find(t => t.id == id);

        if (tarea) {
            tarea.completada = element.checked;
            mostrarContadoresTareas();

            // Estilo visual de tarea completada
            const card = document.querySelector(`#tarea-${id}`);
            const input = document.querySelector(`#inputNuevaTarea-${id}`);
            card.classList.toggle("bg-success-subtle", element.checked);
            card.classList.toggle("border-success-subtle", element.checked);
            //input.classList.toggle("text-decoration-line-through", element.checked);
            //input.classList.toggle("text-body-secondary", element.checked);
        } 
    }
});


function mostrarListaDeTareas() {
    contenedorTareas.innerHTML = "";
    tareas.forEach(({ id, nombre, completada }) => {
        contenedorTareas.insertAdjacentHTML("beforeend", `
        <div class="card text-dark mb-3 shadow-sm ${completada ? "bg-success-subtle border-success-subtle" : ""}" id="tarea-${id}">
            <div class="card-body" id="tareaBody-${id}">
                <h5 class="card-title d-flex align-items-center gap-2">
                            <label id="lbTarea-${id}">Tarea:</label>
                            <input type="text" id="inputNuevaTarea-${id}" placeholder="Nombre de la tarea..." value="${nombre}" readonly />
                 </h5>
                 <div class="form-check mb-3">
                    <input id="chk-${id}" type="checkbox" class="form-check-input" data-id="${id}" ${completada ? "checked" : ""}/>
                    <label class="form-check-label" for="chk-${id}">Completada</label>
                </div>
                <div class="d-flex gap-2">
                    <button class="btnEliminar btn btn-danger btn-sm" data-id="${id}">Eliminar</button>
                    <button class="btnEditar btn btn-primary btn-sm" data-id="${id}">Editar</button>
                </div>
            </div>
        </div>
        `);
    });
}

function editarTarea(element) {
    const id = element.dataset.id;
    const input = document.querySelector(`#inputNuevaTarea-${id}`);
    input.readOnly = false;
    input.classList.replace("form-control-plaintext", "form-control");
    input.focus();

    element.classList.remove("btnEditar");
    element.classList.add("btnGuardar");
    element.classList.replace("btn-primary", "btn-success");
    element.textContent = "Guardar";
}

function guardarCambios(element) {
    const idElement = element.dataset.id;
    const inputTarea = document.querySelector(`#inputNuevaTarea-${idElement}`);
    const valorInputTarea = inputTarea.value.trim();

    if (valorInputTarea === "") return;

    const tarea = tareas.find(t => t.id === idElement);

    if (tarea) {
        tarea.nombre = valorInputTarea;
        inputTarea.readOnly = true;
        element.classList.remove("btnGuardar");
        element.classList.add("btnEditar");
        element.textContent = "Editar";
        inputTarea.classList.replace("form-control", "form-control-plaintext");
        element.classList.replace("btn-success", "btn-primary");
    }        
}

function eliminarTarea(element) {
    const id = element.dataset.id;

    document.querySelector(`#tarea-${id}`).remove();
    tareas = tareas.filter(t => t.id !== id);
}

function mostrarContadoresTareas() {
    const totalTareas = tareas.length;
    const tareasCompletadas = tareas.reduce((total, t) => total + (t.completada ? 1 : 0), 0);

    contTotalTareas.innerHTML = `Total tareas: ${totalTareas}`;
    contTareasCompletadas.innerHTML = `Tareas completadas: ${tareasCompletadas}`;
        
}