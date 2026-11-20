/* Histórico: filtros de pesquisa e exclusão de registros (apenas nesta visita à página) */
document.addEventListener('DOMContentLoaded', function () {
  var corpo = document.getElementById('corpo-historico');
  var vazio = document.getElementById('linha-vazia');
  var vazioTexto = document.getElementById('texto-vazio');
  var contagem = document.getElementById('contagem');
  var fNome = document.getElementById('filtro-nome');
  var fStatus = document.getElementById('filtro-status');
  var fDesde = document.getElementById('filtro-desde');
  var fAte = document.getElementById('filtro-ate');
  var formulario = document.getElementById('form-filtros');
  var botaoLimpar = document.getElementById('botao-limpar');
  if (!corpo) { return; }

  // tira acentos e maiúsculas para a busca por nome
  function normalizar(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function linhas() { return corpo.querySelectorAll('tr[data-status]'); }

  function filtrar() {
    var todas = linhas();
    var nome = normalizar(fNome.value.trim());
    var visiveis = 0;
    for (var i = 0; i < todas.length; i++) {
      var tr = todas[i];
      var ok = true;
      if (nome && normalizar(tr.querySelector('.hist-nome').textContent).indexOf(nome) === -1) { ok = false; }
      if (fStatus.value && tr.getAttribute('data-status') !== fStatus.value) { ok = false; }
      var data = tr.getAttribute('data-data');
      if (fDesde.value && data < fDesde.value) { ok = false; }
      if (fAte.value && data > fAte.value) { ok = false; }
      tr.hidden = !ok;
      if (ok) { visiveis++; }
    }
    if (todas.length === 0) {
      vazioTexto.textContent = 'Nenhum registro no histórico.';
    } else {
      vazioTexto.textContent = 'Nenhum registro encontrado com esses filtros.';
    }
    vazio.hidden = visiveis !== 0;
    contagem.textContent = todas.length === 0
      ? 'Nenhum registro no histórico.'
      : 'Mostrando ' + visiveis + ' de ' + todas.length + ' registros.';
  }

  formulario.addEventListener('submit', function (e) { e.preventDefault(); });
  fNome.addEventListener('input', filtrar);
  fStatus.addEventListener('change', filtrar);
  fDesde.addEventListener('change', filtrar);
  fAte.addEventListener('change', filtrar);

  // excluir um registro
  corpo.addEventListener('click', function (e) {
    var botao = e.target.closest('.botao-lixeira');
    if (!botao) { return; }
    if (window.confirm('Excluir este registro do histórico?')) {
      var tr = botao.closest('tr');
      tr.parentNode.removeChild(tr);
      filtrar();
    }
  });

  // limpar todos os registros
  botaoLimpar.addEventListener('click', function () {
    if (window.confirm('Limpar todos os registros do histórico? Esta ação não pode ser desfeita.')) {
      var todas = linhas();
      for (var i = 0; i < todas.length; i++) { todas[i].parentNode.removeChild(todas[i]); }
      filtrar();
    }
  });

  filtrar();
});
