let eventoInstalacionDiferido = null;
let streamActual = null;
let modoCamaraActual = 'environment';

function actualizarMensajeEstado(texto) {
  document.getElementById('mensaje-estado').textContent = texto;
}

function detenerCamaraActiva() {
  if (streamActual) {
    streamActual.getTracks().forEach((track) => {
      track.stop();
    });
    streamActual = null;
  }
}

function iniciarCamara(modo) {
  detenerCamaraActiva();

  const restricciones = {
    video: { facingMode: modo },
    audio: false
  };

  const btnPreparar = document.getElementById('btn-preparar-camara');
  const btnConfirmar = document.getElementById('btn-confirmar-permiso');
  const btnAlternar = document.getElementById('btn-alternar-camara');
  const btnApagar = document.getElementById('btn-apagar-camara');

  btnPreparar.disabled = true;
  btnConfirmar.disabled = true;
  btnAlternar.disabled = true;
  btnApagar.disabled = true;

  return navigator.mediaDevices.getUserMedia(restricciones)
    .then((stream) => {
      streamActual = stream;
      const visorVideo = document.getElementById('visor-camara');
      visorVideo.srcObject = stream;
      actualizarMensajeEstado(`Cámara activa (${modo === 'environment' ? 'Trasera' : 'Frontal'})`);
      btnAlternar.disabled = false;
      btnApagar.disabled = false;
    })
    .catch((error) => {
      if (error.name === 'NotAllowedError') {
        actualizarMensajeEstado('Permiso denegado. Habilita el acceso a la cámara en los ajustes de tu navegador.');
      } else if (error.name === 'NotFoundError') {
        actualizarMensajeEstado('No se detectó el sensor de cámara solicitado en este dispositivo.');
      } else {
        actualizarMensajeEstado(`Error al acceder al hardware: ${error.message}`);
      }
    })
    .finally(() => {
      btnPreparar.disabled = false;
      btnConfirmar.disabled = false;
      if (!streamActual) {
        btnAlternar.disabled = true;
        btnApagar.disabled = true;
      }
    });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  eventoInstalacionDiferido = event;
  const btnInstalar = document.getElementById('btn-instalar');
  btnInstalar.hidden = false;
});

document.getElementById('btn-instalar').addEventListener('click', () => {
  if (!eventoInstalacionDiferido) {
    return;
  }
  const evento = eventoInstalacionDiferido;
  eventoInstalacionDiferido = null;
  const btnInstalar = document.getElementById('btn-instalar');
  btnInstalar.disabled = true;
  evento.prompt();
  evento.userChoice
    .then((resultado) => {
      if (resultado.outcome === 'accepted') {
        btnInstalar.hidden = true;
      } else {
        btnInstalar.hidden = true;
      }
    })
    .catch(() => {
      btnInstalar.hidden = true;
    })
    .finally(() => {
      btnInstalar.disabled = false;
    });
});

document.getElementById('btn-preparar-camara').addEventListener('click', () => {
  const textoLente = document.getElementById('texto-lente-inicial');
  if (modoCamaraActual === 'environment') {
    textoLente.textContent = 'Se solicitará inicialmente la cámara trasera.';
  } else {
    textoLente.textContent = 'Se solicitará inicialmente la cámara frontal.';
  }
  document.getElementById('aviso-permiso').hidden = false;
});

document.getElementById('btn-confirmar-permiso').addEventListener('click', () => {
  document.getElementById('aviso-permiso').hidden = true;
  iniciarCamara(modoCamaraActual);
});

document.getElementById('btn-alternar-camara').addEventListener('click', () => {
  if (!streamActual) {
    return;
  }
  if (modoCamaraActual === 'environment') {
    modoCamaraActual = 'user';
  } else {
    modoCamaraActual = 'environment';
  }
  iniciarCamara(modoCamaraActual);
});

document.getElementById('btn-apagar-camara').addEventListener('click', () => {
  detenerCamaraActiva();
  const visorVideo = document.getElementById('visor-camara');
  visorVideo.srcObject = null;
  actualizarMensajeEstado('Cámara apagada.');
  document.getElementById('btn-alternar-camara').disabled = true;
  document.getElementById('btn-apagar-camara').disabled = true;
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}