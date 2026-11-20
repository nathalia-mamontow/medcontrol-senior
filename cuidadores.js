/* Cuidadores e médicos: cadastrar (formulário na própria página) e remover/excluir.
   Os dados valem apenas nesta visita à página. */
document.addEventListener('DOMContentLoaded', function () {
  var aviso = document.getElementById('aviso-pessoas');
  var contador = 0;

  function avisar(texto) {
    aviso.textContent = texto;
    aviso.hidden = false;
  }

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) { e.className = classe; }
    if (texto) { e.textContent = texto; }
    return e;
  }

  function decorativo(emoji) {
    var s = el('span', null, emoji);
    s.setAttribute('aria-hidden', 'true');
    return s;
  }

  function linha(emoji, rotulo, valor) {
    var p = el('p');
    p.appendChild(decorativo(emoji));
    p.appendChild(document.createTextNode(' '));
    p.appendChild(el('strong', null, rotulo + ':'));
    p.appendChild(document.createTextNode(' ' + valor));
    return p;
  }

  function criarTopo(emoji, id, nome, sub, classeSub, textoBotao) {
    var topo = el('div', 'pessoa-topo');
    topo.appendChild(el('span', 'pessoa-avatar', emoji));
    topo.firstChild.setAttribute('aria-hidden', 'true');
    var titulo = el('div', 'pessoa-titulo');
    var h3 = el('h3', null, nome);
    h3.id = id;
    titulo.appendChild(h3);
    titulo.appendChild(el('p', classeSub, sub));
    topo.appendChild(titulo);
    var b = el('button', 'botao-remover', textoBotao);
    b.type = 'button';
    b.setAttribute('aria-label', textoBotao + ' ' + nome);
    topo.appendChild(b);
    return topo;
  }

  function criarCuidador(d) {
    contador++;
    var id = 'cuid-novo-' + contador;
    var li = el('li');
    var art = el('article', 'pessoa-card');
    art.setAttribute('aria-labelledby', id);
    art.appendChild(criarTopo('👩‍⚕️', id, d.nome, 'Parentesco/Grau: ' + d.parentesco, 'pessoa-sub', 'Remover'));

    var dados = el('div', 'pessoa-dados');
    dados.appendChild(linha('📞', 'Contato', d.tel));
    dados.appendChild(linha('✉️', 'E-mail', d.email));
    art.appendChild(dados);

    var ul = el('ul', 'permissoes');
    ul.setAttribute('aria-label', 'Permissões de ' + d.nome);
    var perms = [
      [d.visualiza, 'perm-visualiza', '✓', 'Visualiza'],
      [d.alertas, 'perm-alertas', '🔔', 'Alertas'],
      [d.gerencia, 'perm-gerencia', '🛠️', 'Gerencia'],
      [d.historico, 'perm-historico', '📜', 'Histórico']
    ];
    perms.forEach(function (p) {
      if (!p[0]) { return; }
      var item = el('li', 'perm ' + p[1]);
      item.appendChild(decorativo(p[2]));
      item.appendChild(document.createTextNode(' ' + p[3]));
      ul.appendChild(item);
    });
    if (!ul.children.length) {
      ul.appendChild(el('li', 'perm perm-historico', 'Sem permissões'));
    }
    art.appendChild(ul);
    li.appendChild(art);
    return li;
  }

  function criarMedico(d) {
    contador++;
    var id = 'med-novo-' + contador;
    var li = el('li');
    var art = el('article', 'pessoa-card pessoa-medico');
    art.setAttribute('aria-labelledby', id);
    art.appendChild(criarTopo('🩺', id, d.nome, 'Especialidade: ' + d.esp, 'pessoa-sub pessoa-esp', 'Excluir'));

    var dados = el('div', 'pessoa-dados');
    dados.appendChild(linha('🆔', 'CRM', d.crm));
    dados.appendChild(linha('🏥', 'Clínica', d.clinica));
    art.appendChild(dados);

    var digitos = d.tel.replace(/\D/g, '');
    if (digitos.length <= 11) { digitos = '55' + digitos; }
    var a = el('a', 'ligar');
    a.href = 'tel:+' + digitos;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icone');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-telefone');
    svg.appendChild(use);
    a.appendChild(svg);
    a.appendChild(document.createTextNode('Ligar para Consultório (' + d.tel + ')'));
    a.appendChild(el('span', 'so-leitor', ' de ' + d.nome));
    art.appendChild(a);
    li.appendChild(art);
    return li;
  }

  /* ---- abrir / fechar formulários ---- */
  function configurarForm(idBotao, idForm, textoAberto, textoFechado) {
    var botao = document.getElementById(idBotao);
    var form = document.getElementById(idForm);
    var rotulo = botao.querySelector('.texto-botao');

    function abrir() {
      form.hidden = false;
      rotulo.textContent = textoAberto;
      form.querySelector('input').focus();
    }
    function fechar(devolverFoco) {
      form.hidden = true;
      form.reset();
      rotulo.textContent = textoFechado;
      if (devolverFoco) { botao.focus(); }
    }

    botao.addEventListener('click', function () {
      if (form.hidden) { abrir(); } else { fechar(true); }
    });
    form.querySelector('[data-fechar]').addEventListener('click', function () { fechar(true); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fechar(true); }
    });
    return { form: form, fechar: fechar };
  }

  function valor(id) { return document.getElementById(id).value.trim(); }

  function adicionar(lista, item) {
    lista.appendChild(item);
    var vazio = lista.parentNode.querySelector('.lista-vazia');
    if (vazio) { vazio.hidden = true; }
  }

  var fc = configurarForm('botao-vincular', 'form-cuidador', 'Fechar Cadastro', 'Vincular Cuidador');
  fc.form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = {
      nome: valor('c-nome'), tel: valor('c-tel'), email: valor('c-email'),
      parentesco: document.getElementById('c-parentesco').value,
      visualiza: document.getElementById('p-visualiza').checked,
      alertas: document.getElementById('p-alertas').checked,
      gerencia: document.getElementById('p-gerencia').checked,
      historico: document.getElementById('p-historico').checked
    };
    adicionar(document.getElementById('lista-cuidadores'), criarCuidador(d));
    fc.fechar(true);
    avisar(d.nome + ' foi vinculado(a) como cuidador(a).');
  });

  var fm = configurarForm('botao-medico', 'form-medico', 'Fechar Cadastro', 'Adicionar Médico');
  fm.form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = { nome: valor('m-nome'), crm: valor('m-crm'), esp: valor('m-esp'), tel: valor('m-tel'), clinica: valor('m-clinica') };
    adicionar(document.getElementById('lista-medicos'), criarMedico(d));
    fm.fechar(true);
    avisar(d.nome + ' foi adicionado(a) à lista de médicos.');
  });

  /* ---- remover / excluir (inclui cartões recém-criados) ---- */
  var listas = document.querySelectorAll('.pessoa-lista');
  for (var i = 0; i < listas.length; i++) {
    listas[i].addEventListener('click', function (e) {
      var botao = e.target.closest('.botao-remover');
      if (!botao) { return; }
      var lista = this;
      var li = botao.closest('li');
      var nome = li.querySelector('h3').textContent;
      var ehMedico = lista.id === 'lista-medicos';
      var pergunta = ehMedico
        ? 'Excluir ' + nome + ' da sua lista de médicos?'
        : 'Remover ' + nome + ' dos seus cuidadores?';
      if (!window.confirm(pergunta)) { return; }

      li.parentNode.removeChild(li);
      var vazio = lista.parentNode.querySelector('.lista-vazia');
      if (vazio) { vazio.hidden = lista.children.length !== 0; }
      avisar(nome + (ehMedico ? ' foi excluído(a) da lista.' : ' foi removido(a) dos seus cuidadores.'));
    });
  }
});
