/* Letra grande (Sênior): guarda a escolha e vale para todas as páginas do site */
(function () {
  var CHAVE = 'medcontrol-letra-grande';
  var raiz = document.documentElement;

  function lerEscolha() {
    try { return localStorage.getItem(CHAVE) === '1'; } catch (e) { return false; }
  }
  function guardarEscolha(ativo) {
    try { localStorage.setItem(CHAVE, ativo ? '1' : '0'); } catch (e) {}
  }

  // Aplica logo no carregamento, antes de a página aparecer (evita "piscar")
  var ativo = lerEscolha();
  raiz.classList.toggle('modo-senior', ativo);

  function atualizarBotoes() {
    var textos = document.querySelectorAll('.botao-letra-texto');
    for (var i = 0; i < textos.length; i++) {
      textos[i].textContent = ativo ? 'Letra normal' : 'Letra grande (Sênior)';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Aviso para leitores de tela quando o modo muda
    var aviso = document.createElement('p');
    aviso.className = 'so-leitor';
    aviso.setAttribute('role', 'status');
    document.body.appendChild(aviso);

    atualizarBotoes();

    var botoes = document.querySelectorAll('.botao-letra');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener('click', function () {
        ativo = !ativo;
        raiz.classList.toggle('modo-senior', ativo);
        guardarEscolha(ativo);
        atualizarBotoes();
        aviso.textContent = ativo ? 'Modo letra grande ativado.' : 'Modo letra grande desativado.';
      });
    }
  });
})();

/* Perfil de acesso (Idoso ou Cuidador/Familiar): vem do login e aparece abaixo do logotipo */
(function () {
  var CHAVE_PERFIL = 'medcontrol-perfil';
  var ROTULOS = {
    idoso: 'Acesso Sênior (Paciente)',
    cuidador: 'Acesso Cuidador/Familiar'
  };

  // Ao chegar do login (index.html?perfil=cuidador), guarda a escolha
  try {
    var param = new URLSearchParams(window.location.search).get('perfil');
    if (param === 'idoso' || param === 'cuidador') {
      localStorage.setItem(CHAVE_PERFIL, param);
    }
  } catch (e) {}

  function lerPerfil() {
    try {
      var p = localStorage.getItem(CHAVE_PERFIL);
      return p === 'cuidador' ? 'cuidador' : 'idoso';
    } catch (e) { return 'idoso'; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var textos = document.querySelectorAll('.marca-sub');
    for (var i = 0; i < textos.length; i++) {
      textos[i].textContent = ROTULOS[lerPerfil()];
    }
  });
})();
