import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const catalogo = document.getElementById("catalogo");
const inputBusqueda = document.getElementById("busqueda");

/************** DATA **************/
let productos = [];
let productosFiltrados = [];

/************** TEXTO DE STOCK (PÚBLICO) **************/
function textoStock(stock) {
  if (stock === 1) {
    return `<span class="stock-ultima">¡Última unidad!</span>`;
  }

  if (stock > 1 && stock <= 4) {
    return `<span class="stock-ultimas">Últimas unidades</span>`;
  }

  return `<span class="stock-normal">En stock</span>`;
}

/************** CARGAR FIREBASE **************/
async function cargarProductos() {
  productos = [];

  const snapshot = await getDocs(collection(db, "productos"));
  snapshot.forEach(docSnap => {
    productos.push(docSnap.data());
  });

  productosFiltrados = productos.filter(
    p => p.activo && p.stock > 0
  );

  renderCatalogo(productosFiltrados);
}

/************** RENDER CATÁLOGO **************/
function renderCatalogo(lista) {
  catalogo.innerHTML = "";

  if (lista.length === 0) {
    catalogo.innerHTML = "<p>No se encontraron perfumes</p>";
    return;
  }

  lista.forEach(p => {
    catalogo.innerHTML += `
      <div class="card" onclick='verPerfume(${JSON.stringify(p)})'>
        <img src="${p.imagen}" alt="${p.nombre}">
        <div class="card-body">
          <h4>${p.nombre}</h4>
          <p>${p.marca}</p>
          <strong>S/ ${p.precio}</strong>
          <div class="stock-texto">
            ${textoStock(p.stock)}
          </div>
        </div>
      </div>
    `;
  });
}

/************** FILTROS **************/
window.filtrarPerfumes = function () {

  const texto = inputBusqueda.value.toLowerCase();

  const generosSeleccionados = Array.from(
    document.querySelectorAll('input[name="genero"]:checked')
  ).map(c => c.value);

  const usosSeleccionados = Array.from(
    document.querySelectorAll('input[name="uso"]:checked')
  ).map(c => c.value);

  const precioMin = document.getElementById("precioMin")?.value;
  const precioMax = document.getElementById("precioMax")?.value;

  const mlMin = document.getElementById("mlMin")?.value;
  const mlMax = document.getElementById("mlMax")?.value;

  productosFiltrados = productos.filter(p => {

    if (!p.activo || p.stock <= 0) return false;

    const cumpleTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.marca.toLowerCase().includes(texto);

    const cumpleGenero =
      generosSeleccionados.length === 0 ||
      generosSeleccionados.includes(p.genero);

    const cumpleUso =
      usosSeleccionados.length === 0 ||
      usosSeleccionados.some(u =>
        p.uso?.toLowerCase().includes(u.toLowerCase())
      );

    const cumplePrecio =
      (!precioMin || p.precio >= precioMin) &&
      (!precioMax || p.precio <= precioMax);

    const cumpleML =
      (!mlMin || p.presentacion >= mlMin) &&
      (!mlMax || p.presentacion <= mlMax);

    return (
      cumpleTexto &&
      cumpleGenero &&
      cumpleUso &&
      cumplePrecio &&
      cumpleML
    );
  });

  renderCatalogo(productosFiltrados);
};

/************** MODAL DETALLE **************/
window.verPerfume = function (p) {

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content">

      <div class="modal-header">
        <h3>${p.nombre}</h3>
        <span class="close" onclick="this.closest('.modal').remove()">×</span>
      </div>

      <div class="modal-body modal-grid">

        <div class="modal-left">
          <img src="${p.imagen}">
        </div>

        <div class="modal-right">
          <p><strong>Precio:</strong> S/ ${p.precio}</p>
          <p><strong>Presentación:</strong> ${p.presentacion} ml</p>

          <div class="stock-texto">
            ${textoStock(p.stock)}
          </div>

          <h4>Descripción</h4>
          <p>${p.descripcion || "-"}</p>

          <h4>Notas Olfativas</h4>
          <p><strong>Salida:</strong> ${p.salida || "-"}</p>
          <p><strong>Corazón:</strong> ${p.corazon || "-"}</p>
          <p><strong>Fondo:</strong> ${p.fondo || "-"}</p>

          <p><strong>Uso:</strong> ${p.uso || "-"}</p>
          <p><strong>Estilo:</strong> ${p.estilo || "-"}</p>

          <a
            href="https://wa.me/51948088313?text=Hola, quiero consultar el perfume ${encodeURIComponent(p.nombre)}"
            target="_blank"
            class="btn-primary"
            style="margin-top:12px; display:inline-block;"
          >
            Consultar por WhatsApp
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);
};

/************** INIT **************/
cargarProductos();
