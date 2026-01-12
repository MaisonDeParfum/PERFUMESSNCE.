/**************** FIREBASE ****************/
import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

/**************** ELEMENTOS ****************/
const loginDiv = document.getElementById("login");
const panelDiv = document.getElementById("panel");
const tabla = document.getElementById("tablaProductos");
const modal = document.getElementById("modalPerfume");

/**************** INPUTS ****************/
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");

const p_nombre = document.getElementById("p_nombre");
const p_marca = document.getElementById("p_marca");
const p_tipo = document.getElementById("p_tipo");
const p_genero = document.getElementById("p_genero");
const p_presentacion = document.getElementById("p_presentacion");
const p_precio = document.getElementById("p_precio");
const p_stock = document.getElementById("p_stock");
const p_imagen = document.getElementById("p_imagen");
const p_descripcion = document.getElementById("p_descripcion");
const p_salida = document.getElementById("p_salida");
const p_corazon = document.getElementById("p_corazon");
const p_fondo = document.getElementById("p_fondo");
const p_uso = document.getElementById("p_uso");
const p_estilo = document.getElementById("p_estilo");
const p_familia = document.getElementById("p_familia");
const p_activo = document.getElementById("p_activo");

/**************** ESTADO ****************/
let editId = null;

/**************** LOGIN ****************/
window.login = async function () {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
  } catch (e) {
    alert("❌ Correo o contraseña incorrectos");
  }
};

/**************** SESIÓN ****************/
onAuthStateChanged(auth, user => {
  if (user) {
    loginDiv.style.display = "none";
    panelDiv.style.display = "block";
    cargarProductos();
  } else {
    panelDiv.style.display = "none";
    loginDiv.style.display = "block";
  }
});

/**************** LOGOUT ****************/
window.logout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};

/**************** MODAL ****************/
window.abrirModal = function () {
  modal.style.display = "flex";
};

window.cerrarModal = function () {
  modal.style.display = "none";
  limpiarModal();
  editId = null;
  document.querySelector(".modal-footer .btn-primary").innerText = "Crear Perfume";
};

/**************** CREAR / EDITAR ****************/
window.crearPerfume = async function () {

  if (!p_nombre.value || !p_marca.value || !p_precio.value) {
    alert("Completa los campos obligatorios");
    return;
  }

  const data = {
    nombre: p_nombre.value,
    marca: p_marca.value,
    genero: p_genero.value,
    tipo: p_tipo.value,
    presentacion: Number(p_presentacion.value),
    precio: Number(p_precio.value),
    stock: Number(p_stock.value),
    imagen: p_imagen.value,
    descripcion: p_descripcion.value,
    salida: p_salida.value,
    corazon: p_corazon.value,
    fondo: p_fondo.value,
    uso: p_uso.value,
    estilo: p_estilo.value,
    familia: p_familia.value,
    activo: p_activo.checked
  };

  if (editId) {
    await updateDoc(doc(db, "productos", editId), data);
  } else {
    await addDoc(collection(db, "productos"), data);
  }

  cerrarModal();
  cargarProductos();
};

/**************** EDITAR ****************/
window.editarPerfume = async function (id) {
  const snapshot = await getDocs(collection(db, "productos"));

  snapshot.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      editId = id;

      p_nombre.value = p.nombre;
      p_marca.value = p.marca;
      p_genero.value = p.genero;
      p_tipo.value = p.tipo;
      p_presentacion.value = p.presentacion;
      p_precio.value = p.precio;
      p_stock.value = p.stock;
      p_imagen.value = p.imagen;
      p_descripcion.value = p.descripcion;
      p_salida.value = p.salida;
      p_corazon.value = p.corazon;
      p_fondo.value = p.fondo;
      p_uso.value = p.uso;
      p_estilo.value = p.estilo;
      p_familia.value = p.familia;
      p_activo.checked = p.activo;

      document.querySelector(".modal-footer .btn-primary").innerText = "Actualizar Perfume";
      abrirModal();
    }
  });
};

/**************** ELIMINAR ****************/
window.eliminarFirebase = async function (id) {
  if (confirm("¿Eliminar producto?")) {
    await deleteDoc(doc(db, "productos", id));
    cargarProductos();
  }
};

/**************** TABLA ****************/
async function cargarProductos() {
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db, "productos"));

  snapshot.forEach(d => {
    const p = d.data();

    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.marca}</td>
        <td>S/ ${p.precio}</td>
        <td>${p.stock}</td>
        <td>${p.activo ? "✅ Activo" : "❌ Inactivo"}</td>
        <td>
          <button onclick="editarPerfume('${d.id}')">✏️</button>
          <button onclick="eliminarFirebase('${d.id}')">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/**************** LIMPIAR ****************/
function limpiarModal() {
  p_nombre.value = "";
  p_marca.value = "";
  p_genero.value = "";
  p_presentacion.value = "";
  p_precio.value = "";
  p_stock.value = "";
  p_imagen.value = "";
  p_descripcion.value = "";
  p_salida.value = "";
  p_corazon.value = "";
  p_fondo.value = "";
  p_uso.value = "";
  p_estilo.value = "";
  p_familia.value = "Oriental";
  p_activo.checked = true;
}
