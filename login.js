/* Login: o e-mail muda conforme o perfil escolhido (Idoso ou Cuidador/Familiar) */
document.addEventListener('DOMContentLoaded', function () {
  var EMAILS = {
    idoso: 'waldemar.souza@gmail.com',
    cuidador: 'ana.souza@gmail.com'
  };

  // Chegar na tela de login equivale a sair: limpa o perfil guardado
  try { localStorage.removeItem('medcontrol-perfil'); } catch (e) {}

  var campo = document.getElementById('email');
  var opcoes = document.querySelectorAll('input[name="perfil"]');
  if (!campo || opcoes.length === 0) { return; }

  function ajustarEmail(perfil) {
    // só troca se o campo estiver vazio ou com um dos e-mails de exemplo
    var atual = campo.value.trim();
    if (atual === '' || atual === EMAILS.idoso || atual === EMAILS.cuidador) {
      campo.value = EMAILS[perfil];
    }
  }

  for (var i = 0; i < opcoes.length; i++) {
    opcoes[i].addEventListener('change', function () {
      if (this.checked) { ajustarEmail(this.value); }
    });
    if (opcoes[i].checked) { ajustarEmail(opcoes[i].value); }
  }
});
