const formulario = document.querySelector("form");
let form = document.querySelector("#formulario");

const nombreInput = document.querySelector("#nombre");
const cedulaInput = document.querySelector("#cedula");
const telefonoInput = document.querySelector("#telefono");
const listaUsuarios = document.querySelector("#lista-usuarios");

let usuarios = [];

// Función para validar el campo "Cédula"
function validarCedula(cedula) {
  const regex = /^[0-9]{9}$/;

  return regex.test(cedula);
}

// Función para validar el campo "Teléfono"
function validarTelefono(telefono) {
  const regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  return regex.test(telefono);
}

// Función para validar el formulario
function validarFormulario() {
  let errores = [];

  if (nombreInput.value.trim() === "") {
    errores.push('El campo "Nombre" es obligatorio');
  }

  if (!validarCedula(cedulaInput.value)) {
    errores.push('El campo "Cédula" debe tener 9 dígitos');
  }

  if (!validarTelefono(telefonoInput.value)) {
    errores.push('El campo "Teléfono" debe tener el formato XXX-XXX-XXXX');
  }

  if (errores.length > 0) {
    alert(errores.join("\n"));
    return false;
  }

  return true;
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

  fetch("http://localhost:3000/usuarios", {
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
  if (validarFormulario()) {
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
