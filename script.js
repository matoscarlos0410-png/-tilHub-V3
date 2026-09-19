/* =========================================
   ÚTILHUB V3 - SCRIPT PRINCIPAL
========================================= */

const modal = document.getElementById("modal");
const contenidoModal = document.getElementById("contenidoModal");

function abrirModal(contenido) {
    contenidoModal.innerHTML = contenido;
    modal.style.display = "flex";
}

function cerrarModal() {
    modal.style.display = "none";
    contenidoModal.innerHTML = "";
}

modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        cerrarModal();
    }
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        cerrarModal();
    }
});


/* =========================================
   BUSCADOR
========================================= */

function buscarHerramienta() {

    const texto = document
        .getElementById("buscador")
        .value
        .toLowerCase()
        .trim();

    const herramientas = document.querySelectorAll(".herramienta");

    herramientas.forEach(herramienta => {

        const nombre = herramienta
            .dataset.nombre
            .toLowerCase();

        herramienta.style.display =
            nombre.includes(texto) ? "flex" : "none";
    });
}


/* =========================================
   CALCULADORA SEGURA
========================================= */

function calculadora() {

    abrirModal(`
        <h2>🧮 Calculadora</h2>

        <input
            id="calcPantalla"
            class="campo"
            placeholder="Ejemplo: 25 + 8 × 2"
            autocomplete="off"
        >

        <button class="btn-principal" onclick="calcularResultado()">
            Calcular
        </button>

        <div id="resultadoCalc" class="resultado"></div>
    `);
}

function calcularResultado() {

    const pantalla = document.getElementById("calcPantalla");
    const resultado = document.getElementById("resultadoCalc");

    try {

        const expresion = pantalla.value
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        const valor = evaluarExpresion(expresion);

        if (!Number.isFinite(valor)) {
            throw new Error();
        }

        resultado.innerHTML = `
            <strong>Resultado:</strong> ${valor}
        `;

    } catch {
        resultado.innerHTML =
            "❌ Expresión no válida.";
    }
}


/* Analizador matemático sencillo y seguro */

function evaluarExpresion(texto) {

    const tokens = [];
    const regex = /\s*(\d+(?:\.\d+)?|[()+\-*/])\s*/g;

    let posicion = 0;
    let coincidencia;

    while ((coincidencia = regex.exec(texto)) !== null) {

        if (coincidencia.index !== posicion) {
            throw new Error();
        }

        tokens.push(coincidencia[1]);
        posicion = regex.lastIndex;
    }

    if (posicion !== texto.length || tokens.length === 0) {
        throw new Error();
    }

    let indice = 0;

    function expresion() {

        let resultado = termino();

        while (
            tokens[indice] === "+" ||
            tokens[indice] === "-"
        ) {

            const operador = tokens[indice++];

            const siguiente = termino();

            if (operador === "+") {
                resultado += siguiente;
            } else {
                resultado -= siguiente;
            }
        }

        return resultado;
    }

    function termino() {

        let resultado = factor();

        while (
            tokens[indice] === "*" ||
            tokens[indice] === "/"
        ) {

            const operador = tokens[indice++];

            const siguiente = factor();

            if (operador === "*") {
                resultado *= siguiente;
            } else {

                if (siguiente === 0) {
                    throw new Error();
                }

                resultado /= siguiente;
            }
        }

        return resultado;
    }

    function factor() {

        if (tokens[indice] === "+") {
            indice++;
            return factor();
        }

        if (tokens[indice] === "-") {
            indice++;
            return -factor();
        }

        if (tokens[indice] === "(") {

            indice++;

            const resultado = expresion();

            if (tokens[indice] !== ")") {
                throw new Error();
            }

            indice++;

            return resultado;
        }

        const numero = Number(tokens[indice]);

        if (!Number.isFinite(numero)) {
            throw new Error();
        }

        indice++;

        return numero;
    }

    const resultadoFinal = expresion();

    if (indice !== tokens.length) {
        throw new Error();
    }

    return resultadoFinal;
}


/* =========================================
   CONVERSOR DE UNIDADES
========================================= */

function conversor() {

    abrirModal(`
        <h2>⇄ Conversor de unidades</h2>

        <input id="valorConversion"
               class="campo"
               type="number"
               placeholder="Cantidad">

        <select id="tipoConversion" class="campo">
            <option value="m-km">Metros → Kilómetros</option>
            <option value="km-m">Kilómetros → Metros</option>
            <option value="cm-m">Centímetros → Metros</option>
            <option value="m-cm">Metros → Centímetros</option>
            <option value="kg-g">Kilogramos → Gramos</option>
            <option value="g-kg">Gramos → Kilogramos</option>
            <option value="l-ml">Litros → Mililitros</option>
            <option value="ml-l">Mililitros → Litros</option>
        </select>

        <button class="btn-principal"
                onclick="convertirUnidad()">
            Convertir
        </button>

        <div id="resultadoConversion"
             class="resultado"></div>
    `);
}

function convertirUnidad() {

    const valor = Number(
        document.getElementById("valorConversion").value
    );

    const tipo =
        document.getElementById("tipoConversion").value;

    if (!Number.isFinite(valor)) {
        document.getElementById("resultadoConversion").innerHTML =
            "❌ Introduce una cantidad.";
        return;
    }

    const conversiones = {
        "m-km": valor / 1000,
        "km-m": valor * 1000,
        "cm-m": valor / 100,
        "m-cm": valor * 100,
        "kg-g": valor * 1000,
        "g-kg": valor / 1000,
        "l-ml": valor * 1000,
        "ml-l": valor / 1000
    };

    document.getElementById("resultadoConversion").innerHTML =
        `<strong>Resultado:</strong> ${conversiones[tipo]}`;
}


/* =========================================
   PORCENTAJES
========================================= */

function porcentajes() {

    abrirModal(`
        <h2>% Calculadora de porcentajes</h2>

        <input id="porcentaje"
               class="campo"
               type="number"
               placeholder="Porcentaje">

        <input id="cantidadPorcentaje"
               class="campo"
               type="number"
               placeholder="Cantidad">

        <button class="btn-principal"
                onclick="calcularPorcentaje()">
            Calcular
        </button>

        <div id="resultadoPorcentaje"
             class="resultado"></div>
    `);
}

function calcularPorcentaje() {

    const porcentaje =
        Number(document.getElementById("porcentaje").value);

    const cantidad =
        Number(document.getElementById("cantidadPorcentaje").value);

    if (!Number.isFinite(porcentaje) ||
        !Number.isFinite(cantidad)) {

        document.getElementById("resultadoPorcentaje").innerHTML =
            "❌ Completa los campos.";

        return;
    }

    const resultado =
        cantidad * porcentaje / 100;

    document.getElementById("resultadoPorcentaje").innerHTML =
        `<strong>${porcentaje}% de ${cantidad} = ${resultado}</strong>`;
}


/* =========================================
   DESCUENTOS
========================================= */

function descuentos() {

    abrirModal(`
        <h2>🏷️ Calculadora de descuentos</h2>

        <input id="precioOriginal"
               class="campo"
               type="number"
               placeholder="Precio">

        <input id="porcentajeDescuento"
               class="campo"
               type="number"
               placeholder="Descuento %">

        <button class="btn-principal"
                onclick="calcularDescuento()">
            Calcular
        </button>

        <div id="resultadoDescuento"
             class="resultado"></div>
    `);
}

function calcularDescuento() {

    const precio =
        Number(document.getElementById("precioOriginal").value);

    const descuento =
        Number(document.getElementById("porcentajeDescuento").value);

    if (!Number.isFinite(precio) ||
        !Number.isFinite(descuento)) {

        document.getElementById("resultadoDescuento").innerHTML =
            "❌ Completa los campos.";

        return;
    }

    const ahorro = precio * descuento / 100;
    const final = precio - ahorro;

    document.getElementById("resultadoDescuento").innerHTML = `
        <p>Ahorro: <strong>${ahorro.toFixed(2)}</strong></p>
        <p>Precio final: <strong>${final.toFixed(2)}</strong></p>
    `;
}


/* =========================================
   CONTADOR DE DÍAS
========================================= */

function contadorDias() {

    abrirModal(`
        <h2>📅 Contador de días</h2>

        <label>Fecha inicial</label>
        <input id="fechaInicio"
               class="campo"
               type="date">

        <label>Fecha final</label>
        <input id="fechaFinal"
               class="campo"
               type="date">

        <button class="btn-principal"
                onclick="calcularDias()">
            Calcular
        </button>

        <div id="resultadoDias"
             class="resultado"></div>
    `);
}

function calcularDias() {

    const inicio =
        new Date(document.getElementById("fechaInicio").value);

    const final =
        new Date(document.getElementById("fechaFinal").value);

    if (isNaN(inicio) || isNaN(final)) {

        document.getElementById("resultadoDias").innerHTML =
            "❌ Selecciona las dos fechas.";

        return;
    }

    const diferencia =
        Math.abs(final - inicio);

    const dias =
        Math.round(diferencia / 86400000);

    document.getElementById("resultadoDias").innerHTML =
        `<strong>${dias} días</strong>`;
}


/* =========================================
   TEMPERATURA
========================================= */

function temperatura() {

    abrirModal(`
        <h2>🌡️ Temperatura</h2>

        <input id="temperaturaValor"
               class="campo"
               type="number"
               placeholder="Temperatura">

        <select id="temperaturaTipo"
                class="campo">

            <option value="cf">Celsius → Fahrenheit</option>
            <option value="fc">Fahrenheit → Celsius</option>
            <option value="ck">Celsius → Kelvin</option>
            <option value="kc">Kelvin → Celsius</option>

        </select>

        <button class="btn-principal"
                onclick="convertirTemperatura()">
            Convertir
        </button>

        <div id="resultadoTemperatura"
             class="resultado"></div>
    `);
}

function convertirTemperatura() {

    const valor =
        Number(document.getElementById("temperaturaValor").value);

    const tipo =
        document.getElementById("temperaturaTipo").value;

    if (!Number.isFinite(valor)) {
        return;
    }

    let resultado;

    switch (tipo) {

        case "cf":
            resultado = (valor * 9 / 5) + 32;
            break;

        case "fc":
            resultado = (valor - 32) * 5 / 9;
            break;

        case "ck":
            resultado = valor + 273.15;
            break;

        case "kc":
            resultado = valor - 273.15;
            break;
    }

    document.getElementById("resultadoTemperatura").innerHTML =
        `<strong>${resultado.toFixed(2)}</strong>`;
}


/* =========================================
   PESO
========================================= */

function peso() {

    abrirModal(`
        <h2>⚖️ Conversor de peso</h2>

        <input id="pesoValor"
               class="campo"
               type="number"
               placeholder="Cantidad">

        <select id="pesoTipo" class="campo">
            <option value="kg-lb">Kilogramos → Libras</option>
            <option value="lb-kg">Libras → Kilogramos</option>
            <option value="kg-g">Kilogramos → Gramos</option>
            <option value="g-kg">Gramos → Kilogramos</option>
        </select>

        <button class="btn-principal"
                onclick="convertirPeso()">
            Convertir
        </button>

        <div id="resultadoPeso"
             class="resultado"></div>
    `);
}

function convertirPeso() {

    const valor =
        Number(document.getElementById("pesoValor").value);

    const tipo =
        document.getElementById("pesoTipo").value;

    if (!Number.isFinite(valor)) return;

    let resultado;

    if (tipo === "kg-lb") resultado = valor * 2.20462;
    if (tipo === "lb-kg") resultado = valor / 2.20462;
    if (tipo === "kg-g") resultado = valor * 1000;
    if (tipo === "g-kg") resultado = valor / 1000;

    document.getElementById("resultadoPeso").innerHTML =
        `<strong>${resultado.toFixed(3)}</strong>`;
}


/* =========================================
   DISTANCIA
========================================= */

function distancia() {

    abrirModal(`
        <h2>📏 Distancia</h2>

        <input id="distanciaValor"
               class="campo"
               type="number"
               placeholder="Cantidad">

        <select id="distanciaTipo" class="campo">
            <option value="km-mi">Kilómetros → Millas</option>
            <option value="mi-km">Millas → Kilómetros</option>
            <option value="m-km">Metros → Kilómetros</option>
            <option value="km-m">Kilómetros → Metros</option>
        </select>

        <button class="btn-principal"
                onclick="convertirDistancia()">
            Convertir
        </button>

        <div id="resultadoDistancia"
             class="resultado"></div>
    `);
}

function convertirDistancia() {

    const valor =
        Number(document.getElementById("distanciaValor").value);

    const tipo =
        document.getElementById("distanciaTipo").value;

    if (!Number.isFinite(valor)) return;

    let resultado;

    if (tipo === "km-mi") resultado = valor * 0.621371;
    if (tipo === "mi-km") resultado = valor / 0.621371;
    if (tipo === "m-km") resultado = valor / 1000;
    if (tipo === "km-m") resultado = valor * 1000;

    document.getElementById("resultadoDistancia").innerHTML =
        `<strong>${resultado.toFixed(3)}</strong>`;
}


/* =========================================
   TEMPORIZADOR
========================================= */

let intervaloTemporizador = null;
let finTemporizador = null;

function temporizador() {

    abrirModal(`
        <h2>⏱️ Temporizador</h2>

        <input id="minutosTimer"
               class="campo"
               type="number"
               min="0"
               placeholder="Minutos">

        <input id="segundosTimer"
               class="campo"
               type="number"
               min="0"
               max="59"
               placeholder="Segundos">

        <div id="pantallaTimer"
             class="tiempo">
            00:00
        </div>

        <button class="btn-principal"
                onclick="iniciarTemporizador()">
            Iniciar
        </button>

        <button class="btn-secundario"
                onclick="detenerTemporizador()">
            Detener
        </button>
    `);
}

function iniciarTemporizador() {

    detenerTemporizador();

    const minutos =
        Number(document.getElementById("minutosTimer").value) || 0;

    const segundos =
        Number(document.getElementById("segundosTimer").value) || 0;

    const total = (minutos * 60) + segundos;

    if (total <= 0) {
        alert("Introduce un tiempo mayor que cero.");
        return;
    }

    finTemporizador = Date.now() + total * 1000;

    actualizarTemporizador();

    intervaloTemporizador =
        setInterval(actualizarTemporizador, 250);
}

function actualizarTemporizador() {

    const restante =
        Math.max(0, finTemporizador - Date.now());

    const segundosTotales =
        Math.ceil(restante / 1000);

    const minutos =
        Math.floor(segundosTotales / 60);

    const segundos =
        segundosTotales % 60;

    const pantalla =
        document.getElementById("pantallaTimer");

    if (pantalla) {

        pantalla.textContent =
            `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    }

    if (restante <= 0) {

        detenerTemporizador();

        if (pantalla) {
            pantalla.textContent = "00:00";
        }

        alert("⏰ ¡Tiempo terminado!");
    }
}

function detenerTemporizador() {

    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
}


/* =========================================
   CRONÓMETRO
========================================= */

let intervaloCronometro = null;
let inicioCronometro = 0;
let acumuladoCronometro = 0;

function cronometro() {

    abrirModal(`
        <h2>⏲️ Cronómetro</h2>

        <div id="pantallaCronometro"
             class="tiempo">
            00:00:00
        </div>

        <button class="btn-principal"
                onclick="iniciarCronometro()">
            Iniciar
        </button>

        <button class="btn-secundario"
                onclick="detenerCronometro()">
            Pausar
        </button>

        <button class="btn-secundario"
                onclick="reiniciarCronometro()">
            Reiniciar
        </button>
    `);
}

function iniciarCronometro() {

    if (intervaloCronometro) return;

    inicioCronometro = Date.now();

    intervaloCronometro =
        setInterval(actualizarCronometro, 100);
}

function actualizarCronometro() {

    const tiempo =
        acumuladoCronometro +
        (Date.now() - inicioCronometro);

    mostrarCronometro(tiempo);
}

function mostrarCronometro(ms) {

    const totalSegundos =
        Math.floor(ms / 1000);

    const horas =
        Math.floor(totalSegundos / 3600);

    const minutos =
        Math.floor((totalSegundos % 3600) / 60);

    const segundos =
        totalSegundos % 60;

    const pantalla =
        document.getElementById("pantallaCronometro");

    if (pantalla) {

        pantalla.textContent =
            `${String(horas).padStart(2, "0")}:` +
            `${String(minutos).padStart(2, "0")}:` +
            `${String(segundos).padStart(2, "0")}`;
    }
}

function detenerCronometro() {

    if (!intervaloCronometro) return;

    acumuladoCronometro +=
        Date.now() - inicioCronometro;

    clearInterval(intervaloCronometro);

    intervaloCronometro = null;

    mostrarCronometro(acumuladoCronometro);
}

function reiniciarCronometro() {

    detenerCronometro();

    acumuladoCronometro = 0;
    inicioCronometro = 0;

    mostrarCronometro(0);
}


/* =========================================
   NOTAS
========================================= */

function notas() {

    const guardada =
        localStorage.getItem("utilhubNotas") || "";

    abrirModal(`
        <h2>📝 Mis notas</h2>

        <textarea id="areaNotas"
                  class="campo"
                  rows="10"
                  placeholder="Escribe aquí...">${escapeHTML(guardada)}</textarea>

        <button class="btn-principal"
                onclick="guardarNotas()">
            Guardar nota
        </button>

        <button class="btn-secundario"
                onclick="borrarNotas()">
            Borrar
        </button>

        <p id="mensajeNotas"></p>
    `);
}

function guardarNotas() {

    const texto =
        document.getElementById("areaNotas").value;

    localStorage.setItem("utilhubNotas", texto);

    document.getElementById("mensajeNotas").textContent =
        "✅ Nota guardada en este dispositivo.";
}

function borrarNotas() {

    localStorage.removeItem("utilhubNotas");

    document.getElementById("areaNotas").value = "";

    document.getElementById("mensajeNotas").textContent =
        "🗑️ Nota eliminada.";
}


/* =========================================
   TAREAS
========================================= */

function tareas() {

    abrirModal(`
        <h2>✓ Lista de tareas</h2>

        <input id="nuevaTarea"
               class="campo"
               placeholder="Nueva tarea">

        <button class="btn-principal"
                onclick="agregarTarea()">
            Agregar
        </button>

        <div id="listaTareas"></div>
    `);

    mostrarTareas();
}

function obtenerTareas() {

    return JSON.parse(
        localStorage.getItem("utilhubTareas") || "[]"
    );
}

function guardarListaTareas(lista) {

    localStorage.setItem(
        "utilhubTareas",
        JSON.stringify(lista)
    );
}

function agregarTarea() {

    const input =
        document.getElementById("nuevaTarea");

    const texto = input.value.trim();

    if (!texto) return;

    const lista = obtenerTareas();

    lista.push({
        texto: texto,
        completada: false
    });

    guardarListaTareas(lista);

    input.value = "";

    mostrarTareas();
}

function mostrarTareas() {

    const contenedor =
        document.getElementById("listaTareas");

    if (!contenedor) return;

    const lista = obtenerTareas();

    contenedor.innerHTML = "";

    lista.forEach((tarea, indice) => {

        const elemento =
            document.createElement("div");

        elemento.className = "item-lista";

        elemento.innerHTML = `
            <span class="${tarea.completada ? "completada" : ""}">
                ${escapeHTML(tarea.texto)}
            </span>

            <button onclick="completarTarea(${indice})">
                ✓
            </button>

            <button onclick="eliminarTarea(${indice})">
                🗑️
            </button>
        `;

        contenedor.appendChild(elemento);
    });
}

function completarTarea(indice) {

    const lista = obtenerTareas();

    lista[indice].completada =
        !lista[indice].completada;

    guardarListaTareas(lista);

    mostrarTareas();
}

function eliminarTarea(indice) {

    const lista = obtenerTareas();

    lista.splice(indice, 1);

    guardarListaTareas(lista);

    mostrarTareas();
}


/* =========================================
   LISTA DE COMPRAS
========================================= */

function compras() {

    abrirModal(`
        <h2>🛒 Lista de compras</h2>

        <input id="nuevoProducto"
               class="campo"
               placeholder="Producto">

        <button class="btn-principal"
                onclick="agregarProducto()">
            Agregar
        </button>

        <div id="listaCompras"></div>
    `);

    mostrarCompras();
}

function obtenerCompras() {

    return JSON.parse(
        localStorage.getItem("utilhubCompras") || "[]"
    );
}

function agregarProducto() {

    const input =
        document.getElementById("nuevoProducto");

    const producto =
        input.value.trim();

    if (!producto) return;

    const lista = obtenerCompras();

    lista.push(producto);

    localStorage.setItem(
        "utilhubCompras",
        JSON.stringify(lista)
    );

    input.value = "";

    mostrarCompras();
}

function mostrarCompras() {

    const contenedor =
        document.getElementById("listaCompras");

    if (!contenedor) return;

    const lista = obtenerCompras();

    contenedor.innerHTML = "";

    lista.forEach((producto, indice) => {

        const elemento =
            document.createElement("div");

        elemento.className = "item-lista";

        elemento.innerHTML = `
            <span>🛒 ${escapeHTML(producto)}</span>

            <button onclick="eliminarProducto(${indice})">
                🗑️
            </button>
        `;

        contenedor.appendChild(elemento);
    });
}

function eliminarProducto(indice) {

    const lista = obtenerCompras();

    lista.splice(indice, 1);

    localStorage.setItem(
        "utilhubCompras",
        JSON.stringify(lista)
    );

    mostrarCompras();
}


/* =========================================
   GENERADOR DE CONTRASEÑAS
========================================= */

function password() {

    abrirModal(`
        <h2>🔐 Generador de contraseñas</h2>

        <input id="longitudPassword"
               class="campo"
               type="number"
               min="6"
               max="50"
               value="16">

        <button class="btn-principal"
                onclick="generarPassword()">
            Generar
        </button>

        <div id="resultadoPassword"
             class="resultado"></div>
    `);
}

function generarPassword() {

    let longitud =
        Number(document.getElementById("longitudPassword").value);

    longitud = Math.min(50, Math.max(6, longitud));

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789!@#$%^&*";

    let resultado = "";

    const valores =
        new Uint32Array(longitud);

    crypto.getRandomValues(valores);

    for (let i = 0; i < longitud; i++) {

        resultado +=
            caracteres[valores[i] % caracteres.length];
    }

    document.getElementById("resultadoPassword").innerHTML =
        `<strong>${escapeHTML(resultado)}</strong>`;
}


/* =========================================
   CÓDIGO QR
========================================= */

function qr() {

    abrirModal(`
        <h2>▦ Generador de QR</h2>

        <input id="textoQR"
               class="campo"
               placeholder="Escribe un texto o enlace">

        <button class="btn-principal"
                onclick="generarQR()">
            Generar QR
        </button>

        <div id="resultadoQR"
             class="resultado"></div>

        <p class="nota">
            Necesita conexión a Internet para generar el código.
        </p>
    `);
}

function generarQR() {

    const texto =
        document.getElementById("textoQR").value.trim();

    if (!texto) {
        document.getElementById("resultadoQR").innerHTML =
            "❌ Escribe algo primero.";
        return;
    }

    const url =
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
        encodeURIComponent(texto);

    document.getElementById("resultadoQR").innerHTML = `
        <img
            src="${url}"
            alt="Código QR generado"
            style="max-width:250px; width:100%;"
        >
    `;
}


/* =========================================
   NÚMERO ALEATORIO
========================================= */

function numeroAleatorio() {

    abrirModal(`
        <h2>🎲 Número aleatorio</h2>

        <input id="minimo"
               class="campo"
               type="number"
               value="1"
               placeholder="Mínimo">

        <input id="maximo"
               class="campo"
               type="number"
               value="100"
               placeholder="Máximo">

        <button class="btn-principal"
                onclick="generarNumeroAleatorio()">
            Generar
        </button>

        <div id="resultadoAleatorio"
             class="resultado"></div>
    `);
}

function generarNumeroAleatorio() {

    let minimo =
        Number(document.getElementById("minimo").value);

    let maximo =
        Number(document.getElementById("maximo").value);

    if (!Number.isFinite(minimo) ||
        !Number.isFinite(maximo)) return;

    if (minimo > maximo) {
        [minimo, maximo] = [maximo, minimo];
    }

    const numero =
        Math.floor(
            Math.random() * (maximo - minimo + 1)
        ) + minimo;

    document.getElementById("resultadoAleatorio").innerHTML =
        `<strong>${numero}</strong>`;
}


/* =========================================
   DADO
========================================= */

function dado() {

    abrirModal(`
        <h2>🎲 Lanzar dado</h2>

        <div id="resultadoDado"
             class="dado-grande">
            ?
        </div>

        <button class="btn-principal"
                onclick="lanzarDado()">
            Lanzar dado
        </button>
    `);
}

function lanzarDado() {

    const numero =
        Math.floor(Math.random() * 6) + 1;

    document.getElementById("resultadoDado").textContent =
        numero;
}


/* =========================================
   DICCIONARIO
========================================= */

async function diccionario() {

    abrirModal(`
        <h2>📖 Diccionario</h2>

        <input id="palabraDiccionario"
               class="campo"
               placeholder="Escribe una palabra">

        <button class="btn-principal"
                onclick="buscarDefinicion()">
            Buscar
        </button>

        <div id="resultadoDiccionario"
             class="resultado"></div>
    `);
}

async function buscarDefinicion() {

    const palabra =
        document
            .getElementById("palabraDiccionario")
            .value
            .trim();

    const resultado =
        document.getElementById("resultadoDiccionario");

    if (!palabra) {
        resultado.innerHTML =
            "❌ Escribe una palabra.";
        return;
    }

    resultado.innerHTML =
        "🔎 Buscando...";

    try {

        const respuesta =
            await fetch(
                "https://api.dictionaryapi.dev/api/v2/entries/es/" +
                encodeURIComponent(palabra)
            );

        if (!respuesta.ok) {
            throw new Error();
        }

        const datos = await respuesta.json();

        const definicion =
            datos[0].meanings[0].definitions[0].definition;

        resultado.innerHTML = `
            <h3>${escapeHTML(palabra)}</h3>
            <p>${escapeHTML(definicion)}</p>
        `;

    } catch {

        resultado.innerHTML =
            "❌ No se encontró la palabra o no hay conexión.";
    }
}


/* =========================================
   ORGANIZADOR DE ESTUDIO
========================================= */

function estudio() {

    abrirModal(`
        <h2>🎓 Organizador de estudio</h2>

        <input id="materiaEstudio"
               class="campo"
               placeholder="Materia">

        <input id="temaEstudio"
               class="campo"
               placeholder="Tema">

        <button class="btn-principal"
                onclick="agregarEstudio()">
            Agregar sesión
        </button>

        <div id="listaEstudio"></div>
    `);

    mostrarEstudio();
}

function obtenerEstudio() {

    return JSON.parse(
        localStorage.getItem("utilhubEstudio") || "[]"
    );
}

function agregarEstudio() {

    const materia =
        document.getElementById("materiaEstudio").value.trim();

    const tema =
        document.getElementById("temaEstudio").value.trim();

    if (!materia || !tema) return;

    const lista = obtenerEstudio();

    lista.push({
        materia,
        tema
    });

    localStorage.setItem(
        "utilhubEstudio",
        JSON.stringify(lista)
    );

    document.getElementById("materiaEstudio").value = "";
    document.getElementById("temaEstudio").value = "";

    mostrarEstudio();
}

function mostrarEstudio() {

    const contenedor =
        document.getElementById("listaEstudio");

    if (!contenedor) return;

    const lista = obtenerEstudio();

    contenedor.innerHTML = "";

    lista.forEach((item, indice) => {

        const elemento =
            document.createElement("div");

        elemento.className = "item-lista";

        elemento.innerHTML = `
            <span>
                🎓 <strong>${escapeHTML(item.materia)}</strong>
                — ${escapeHTML(item.tema)}
            </span>

            <button onclick="eliminarEstudio(${indice})">
                🗑️
            </button>
        `;

        contenedor.appendChild(elemento);
    });
}

function eliminarEstudio(indice) {

    const lista = obtenerEstudio();

    lista.splice(indice, 1);

    localStorage.setItem(
        "utilhubEstudio",
        JSON.stringify(lista)
    );

    mostrarEstudio();
}


/* =========================================
   CONSEJOS
========================================= */

function consejos() {

    const consejos = [
        "Divide las tareas grandes en pasos pequeños.",
        "Organiza tus pendientes antes de comenzar.",
        "Haz pausas cortas cuando estudies durante mucho tiempo.",
        "Guarda tus ideas importantes en tus notas.",
        "Utiliza una lista para recordar tus tareas.",
        "Revisa tus objetivos al comenzar el día.",
        "Aprende algo nuevo cada día.",
        "Evita hacer muchas tareas al mismo tiempo."
    ];

    const consejo =
        consejos[Math.floor(Math.random() * consejos.length)];

    abrirModal(`
        <h2>💡 Consejo del día</h2>

        <div class="resultado">
            <p>${escapeHTML(consejo)}</p>
        </div>

        <button class="btn-principal"
                onclick="consejos()">
            Otro consejo
        </button>
    `);
}


/* =========================================
   SEGURIDAD PARA TEXTO DEL USUARIO
========================================= */

function escapeHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   GOOGLE - PREPARADO PARA FUTURA CONEXIÓN
========================================= */

function iniciarGoogle() {

    alert(
        "La opción de Google necesita configurar Firebase. " +
        "El diseño del botón ya está preparado."
    );
}


/* =========================================
   ESTILOS EXTRA PARA LAS HERRAMIENTAS
========================================= */

const estilosExtra = document.createElement("style");

estilosExtra.textContent = `

    .campo {
        width: 100%;
        padding: 14px;
        margin: 8px 0 12px;
        border-radius: 12px;
        border: 1px solid rgba(90,160,230,.25);
        background: #0b1c38;
        color: white;
        outline: none;
        font-size: 15px;
    }

    .campo:focus {
        border-color: #43aaff;
    }

    textarea.campo {
        resize: vertical;
    }

    .resultado {
        margin-top: 20px;
        padding: 20px;
        border-radius: 15px;
        background: rgba(30,70,120,.25);
        border: 1px solid rgba(70,160,255,.15);
        color: #dceaff;
        text-align: center;
    }

    .modal-contenido h2 {
        margin-bottom: 20px;
    }

    .tiempo {
        margin: 25px 0;
        text-align: center;
        font-size: 50px;
        font-weight: bold;
        color: #55b5ff;
        letter-spacing: 3px;
    }

    .item-lista {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        margin-top: 8px;
        border-radius: 10px;
        background: rgba(255,255,255,.05);
    }

    .item-lista span {
        flex: 1;
        text-align: left;
    }

    .item-lista button {
        border: none;
        background: rgba(255,255,255,.08);
        color: white;
        padding: 7px 10px;
        border-radius: 8px;
        cursor: pointer;
    }

    .completada {
        text-decoration: line-through;
        opacity: .5;
    }

    .dado-grande {
        width: 120px;
        height: 120px;
        margin: 25px auto;
        display: grid;
        place-items: center;
        border-radius: 25px;
        background: linear-gradient(135deg,#168cff,#764cff);
        font-size: 60px;
        font-weight: bold;
        box-shadow: 0 0 35px rgba(60,140,255,.3);
    }

    .nota {
        margin-top: 15px;
        color: #7f93b0;
        font-size: 12px;
        text-align: center;
    }

    .modal-contenido .btn-secundario {
        margin-left: 5px;
    }

`;

document.head.appendChild(estilosExtra);

console.log("ÚtilHub V3 cargado correctamente 🚀");
