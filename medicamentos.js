/* Medicamentos: abrir/fechar o formulário, cadastrar e excluir cartões (apenas nesta visita à página) */
document.addEventListener('DOMContentLoaded', function () {
  var botao = document.getElementById('botao-adicionar');
  var textoBotao = document.getElementById('texto-adicionar');
  var secao = document.getElementById('form-novo-med');
  var form = document.getElementById('form-medicamento');
  var lista = document.querySelector('.med-lista');
  var aviso = document.getElementById('aviso-cadastro');
  if (!botao || !secao || !form || !lista) { return; }

  var FREQUENCIAS = {
    diario: 'Diário',
    alternados: 'Dia sim, dia não',
    semanal: 'Uma vez por semana',
    necessario: 'Somente se necessário (febre ou dor)'
  };
  var contador = 0;

  function reduzirMovimento() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function abrir() {
    secao.hidden = false;
    textoBotao.textContent = 'Fechar Form.';
    secao.scrollIntoView({ behavior: reduzirMovimento() ? 'auto' : 'smooth', block: 'start' });
  }

  function fechar(devolverFoco) {
    secao.hidden = true;
    textoBotao.textContent = 'Adicionar Medicamento';
    form.reset();
    validarDatas();
    if (devolverFoco) { botao.focus(); }
  }

  function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.hidden = false;
  }

  // Atualiza os números "(4)" do menu e do título da lista
  function atualizarContagem() {
    var total = lista.querySelectorAll(':scope > li').length;
    var links = document.querySelectorAll('.menu a[href="medicamentos.html"]');
    for (var i = 0; i < links.length; i++) {
      for (var n = 0; n < links[i].childNodes.length; n++) {
        var no = links[i].childNodes[n];
        if (no.nodeType === 3 && no.textContent.indexOf('Medicamentos') !== -1) {
          no.textContent = 'Medicamentos (' + total + ')';
        }
      }
    }
    var titulo = document.getElementById('titulo-lista');
    if (titulo) { titulo.textContent = 'Medicamentos cadastrados (' + total + ')'; }
  }

  function criarCard(d) {
    contador++;
    var id = 'med-novo-' + contador;
    var li = document.createElement('li');
    li.innerHTML =
      '<article class="med-card">' +
        '<div class="med-topo">' +
          '<span class="med-icone" aria-hidden="true"><svg class="icone" focusable="false"><use href="#i-remedio"/></svg></span>' +
          '<div class="med-titulo">' +
            '<h3 tabindex="-1" class="c-nome"></h3>' +
            '<p class="med-ativo c-ativo"></p>' +
            '<p class="med-selos"><span class="selo selo-quem"><span aria-hidden="true" class="c-emoji"></span> <span class="c-quem"></span></span></p>' +
          '</div>' +
          '<button type="button" class="botao-lixeira"><svg class="icone" aria-hidden="true" focusable="false"><use href="#i-lixeira"/></svg></button>' +
        '</div>' +
        '<dl class="med-dados">' +
          '<div><dt class="rotulo">Frequência</dt><dd class="c-freq"></dd></div>' +
          '<div><dt class="rotulo">Dose prescrita</dt><dd class="c-dose"></dd></div>' +
        '</dl>' +
        '<div class="med-bloco"><h4 class="rotulo">Horários do alarme</h4><ul class="horarios"></ul></div>' +
      '</article>';

    var artigo = li.querySelector('article');
    var nome = li.querySelector('.c-nome');
    nome.id = id;
    artigo.setAttribute('aria-labelledby', id);
    nome.textContent = d.nome;
    li.querySelector('.c-ativo').textContent = 'Ativo: ' + d.ativo;
    li.querySelector('.c-emoji').textContent = d.quem === 'cuidador' ? '👩' : '🙂';
    li.querySelector('.c-quem').textContent = 'Cadastrado pelo ' + (d.quem === 'cuidador' ? 'Cuidador' : 'Idoso');
    li.querySelector('.c-freq').textContent = FREQUENCIAS[d.freq] || 'Diário';
    li.querySelector('.c-dose').textContent = d.dose;
    li.querySelector('.botao-lixeira').setAttribute('aria-label', 'Excluir ' + d.nome);

    var ul = li.querySelector('.horarios');
    for (var i = 0; i < d.horarios.length; i++) {
      var item = document.createElement('li');
      var t = document.createElement('time');
      t.setAttribute('datetime', d.horarios[i]);
      t.textContent = d.horarios[i];
      item.appendChild(t);
      ul.appendChild(item);
    }

    if (d.obs) {
      var p = document.createElement('p');
      p.className = 'faixa';
      p.innerHTML = '<span aria-hidden="true">ℹ️</span> <strong>Notas de uso:</strong> <span class="c-obs"></span>';
      p.querySelector('.c-obs').textContent = d.obs;
      artigo.appendChild(p);
    }
    return li;
  }

  // "8:00, 20:00" -> ["08:00", "20:00"]
  function lerHorarios(texto) {
    var partes = texto.split(',');
    var saida = [];
    for (var i = 0; i < partes.length; i++) {
      var p = partes[i].trim();
      if (p === '') { continue; }
      if (p.length === 4) { p = '0' + p; }
      saida.push(p);
    }
    return saida;
  }

  // data de término não pode ser antes da data de início
  var inicio = document.getElementById('f-inicio');
  var termino = document.getElementById('f-termino');
  function validarDatas() {
    if (inicio.value && termino.value && termino.value < inicio.value) {
      termino.setCustomValidity('A data de término deve ser igual ou posterior à data de início.');
    } else {
      termino.setCustomValidity('');
    }
  }
  inicio.addEventListener('change', validarDatas);
  termino.addEventListener('change', validarDatas);

  // escolher um médico da lista preenche o campo de texto
  var contato = document.getElementById('f-contato');
  var medico = document.getElementById('f-medico');
  contato.addEventListener('change', function () {
    if (contato.value) { medico.value = contato.value; }
  });

  botao.addEventListener('click', function () {
    if (secao.hidden) { abrir(); } else { fechar(true); }
  });
  document.getElementById('botao-cancelar').addEventListener('click', function () {
    fechar(true);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var dados = {
      quem: form.querySelector('input[name="quem"]:checked').value,
      nome: document.getElementById('f-nome').value.trim(),
      ativo: document.getElementById('f-ativo').value.trim(),
      dose: document.getElementById('f-dose').value.trim(),
      horarios: lerHorarios(document.getElementById('f-horarios').value),
      freq: document.getElementById('f-freq').value,
      obs: document.getElementById('f-obs').value.trim()
    };
    var card = criarCard(dados);
    lista.appendChild(card);
    atualizarContagem();
    fechar(false);
    mostrarAviso('Medicamento ' + dados.nome + ' cadastrado com sucesso.');
    var titulo = card.querySelector('h3');
    titulo.focus();
    card.scrollIntoView({ behavior: reduzirMovimento() ? 'auto' : 'smooth', block: 'center' });
  });

  // excluir um cartão (vale também para os que já existiam)
  lista.addEventListener('click', function (e) {
    var lixeira = e.target.closest('.botao-lixeira');
    if (!lixeira) { return; }
    var li = lixeira.closest('li');
    var nome = li.querySelector('h3').textContent;
    if (window.confirm('Excluir ' + nome + ' da lista?')) {
      li.parentNode.removeChild(li);
      atualizarContagem();
      mostrarAviso('Medicamento ' + nome + ' excluído.');
      botao.focus();
    }
  });
});
