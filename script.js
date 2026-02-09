const peluqueros = [
  { id: "ana", nombre: "Ana Ríos" },
  { id: "marcos", nombre: "Marcos Vidal" },
  { id: "lola", nombre: "Lola Benítez" },
];

const turnos = [];

const form = document.querySelector("#turno-form");
const agenda = document.querySelector("#agenda");
const peluqueroSelect = document.querySelector("#peluquero-select");
const filterSelect = document.querySelector("#filter-peluquero");
const totalTurnos = document.querySelector("#total-turnos");
const peluquerosActivos = document.querySelector("#peluqueros-activos");

const renderSelectOptions = () => {
  peluqueroSelect.innerHTML =
    '<option value="">Selecciona un peluquero</option>' +
    peluqueros
      .map(
        (peluquero) =>
          `<option value="${peluquero.id}">${peluquero.nombre}</option>`
      )
      .join("");

  filterSelect.innerHTML =
    '<option value="todos">Todos</option>' +
    peluqueros
      .map(
        (peluquero) =>
          `<option value="${peluquero.id}">${peluquero.nombre}</option>`
      )
      .join("");

  peluquerosActivos.textContent = peluqueros.length;
};

const renderAgenda = () => {
  const filtro = filterSelect.value;
  const turnosFiltrados =
    filtro === "todos"
      ? turnos
      : turnos.filter((turno) => turno.peluquero === filtro);

  agenda.innerHTML = "";

  if (!turnosFiltrados.length) {
    agenda.innerHTML =
      '<div class="empty">No hay turnos para mostrar. Agenda el primero 👋</div>';
    totalTurnos.textContent = turnos.length;
    return;
  }

  turnosFiltrados
    .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
    .forEach((turno) => {
      const card = document.createElement("article");
      card.className = "agenda-card";
      card.innerHTML = `
        <header>
          <h3>${turno.cliente}</h3>
          <span class="badge">${turno.servicio}</span>
        </header>
        <div class="agenda-meta">
          <span>📅 ${turno.fecha}</span>
          <span>⏰ ${turno.hora}</span>
          <span>💇 ${turno.peluqueroNombre}</span>
          ${turno.telefono ? `<span>📞 ${turno.telefono}</span>` : ""}
        </div>
        ${turno.notas ? `<p>${turno.notas}</p>` : ""}
      `;
      agenda.appendChild(card);
    });

  totalTurnos.textContent = turnos.length;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const peluqueroId = data.get("peluquero");
  const peluqueroNombre = peluqueros.find(
    (peluquero) => peluquero.id === peluqueroId
  )?.nombre;

  const turno = {
    cliente: data.get("cliente"),
    telefono: data.get("telefono"),
    fecha: data.get("fecha"),
    hora: data.get("hora"),
    servicio: data.get("servicio"),
    peluquero: peluqueroId,
    peluqueroNombre: peluqueroNombre || "Sin asignar",
    notas: data.get("notas"),
    fechaHora: `${data.get("fecha")}T${data.get("hora")}`,
  };

  turnos.push(turno);
  form.reset();
  peluqueroSelect.value = "";
  renderAgenda();
});

filterSelect.addEventListener("change", renderAgenda);

renderSelectOptions();
renderAgenda();
