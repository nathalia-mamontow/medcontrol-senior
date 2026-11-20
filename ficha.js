/* Ficha do paciente: confirma a atualização (os dados valem apenas nesta visita) */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form-ficha');
  var aviso = document.getElementById('aviso-ficha');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = document.getElementById('f-nome').value.trim();
    aviso.textContent = 'Informações de ' + nome + ' atualizadas com sucesso.';
    aviso.hidden = false;
    aviso.scrollIntoView({ block: 'nearest' });
  });
});
