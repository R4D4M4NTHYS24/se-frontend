const formulario = document.querySelector("form");
let form = document.querySelector("#formulario");

const nombreInput = document.getElementById("nombre");
const cedulaInput = document.getElementById("cedula");
const telefonoInput = document.getElementById("telefono");

const listaUsuarios = document.querySelector("#lista-usuarios");

let usuarios = [];

//////////Validacion de cada campo del formulario///////////////////////////////

// Agregar listener para validar el campo de nombre
nombreInput.addEventListener("invalid", () => {
  nombreInput.setCustomValidity("Por favor, ingresa tu nombre.");
});

nombreInput.addEventListener("input", () => {
  nombreInput.setCustomValidity("");
});

// Agregar listener para validar el campo de cédula
cedulaInput.addEventListener("invalid", () => {
  cedulaInput.setCustomValidity(
    "Solo se permite ingresar caracteres numéricos y un máximo de 10 dígitos"
  );
});

cedulaInput.addEventListener("input", () => {
  cedulaInput.setCustomValidity("");
});

// Agregar listener para validar el campo de Telefono
telefonoInput.addEventListener("input", function () {
  if (telefonoInput.value.length !== 10) {
    telefonoInput.setCustomValidity(
      "Solo se permite ingresar caracteres numéricos y el teléfono debe tener exactamente 10 dígitos"
    );
  } else {
    telefonoInput.setCustomValidity("");
  }
});

telefonoInput.addEventListener("invalid", function () {
  if (telefonoInput.value.length !== 10) {
    telefonoInput.setCustomValidity(
      "Solo se permite ingresar caracteres numéricos y el teléfono debe tener exactamente 10 dígitos"
    );
  } else {
    telefonoInput.setCustomValidity("");
  }
});

//////validacion del formulario completo///////////////

function validarFormularioCompleto() {
  let formularioValido = true;

  if (!formulario.checkValidity()) {
    formularioValido = false;
    // Mostrar los mensajes de error
    nombreInput.reportValidity();
    cedulaInput.reportValidity();
    telefonoInput.reportValidity();
  }

  if (telefonoInput.value.length !== 10) {
    formularioValido = false;
    telefonoInput.setCustomValidity(
      "El teléfono debe tener exactamente 10 dígitos"
    );
    telefonoInput.reportValidity();
  } else {
    telefonoInput.setCustomValidity("");
  }

  return formularioValido;
}

// Función para agregar un usuario a la lista
function agregarUsuario(usuario) {
  const nuevoUsuario = document.createElement("li");
  nuevoUsuario.innerText = `Nombre: ${usuario.nombre} | Cédula: ${usuario.cedula} | Teléfono: ${usuario.telefono}`;
  listaUsuarios.appendChild(nuevoUsuario);
}

// Función para guardar los datos del formulario en la API REST
function guardarUsuarioEnJSON(usuario) {
  usuarios.push(usuario);

  fetch("https://usuarios-se-production.up.railway.app/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}

// Evento para enviar el formulario
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("ejecute");
  if (validarFormularioCompleto()) {
    const usuario = {
      nombre: nombreInput.value.trim(),
      cedula: cedulaInput.value.trim(),
      telefono: telefonoInput.value.trim(),
    };

    guardarUsuarioEnJSON(usuario);
    agregarUsuario(usuario);
    formulario.reset();
  }
});

// Función para agregar un usuario a la tabla
function agregarUsuario(usuario) {
  const tbody = document.querySelector("#tablaUsuarios tbody");

  const nuevaFila = document.createElement("tr");
  nuevaFila.innerHTML = `<td>${usuario.nombre}</td><td>${usuario.cedula}</td><td>${usuario.telefono}</td>`;

  tbody.appendChild(nuevaFila);
}

document.getElementById("tablaUsuarios").addEventListener("click", function () {
  // Realizar una solicitud GET a tu servidor Express
  fetch("/usuarios")
    .then((response) => response.json())
    .then(function (usuarios) {
      // Crear una tabla para mostrar la lista de usuarios
      let tabla =
        "<table><thead><tr><th>Nombre</th><th>Cédula</th><th>Teléfono</th></tr></thead><tbody>";
      usuarios.forEach(function (usuario) {
        tabla +=
          "<tr><td>" +
          usuario.nombre +
          "</td><td>" +
          usuario.cedula +
          "</td><td>" +
          usuario.telefono +
          "</td></tr>";
      });
      tabla += "</tbody></table>";
      // Agregar la tabla al HTML
      document.getElementById("tablaUsuarios").innerHTML = tabla;
    });
});
