/* Relatório médico: copiar link e imprimir */
document.addEventListener('DOMContentLoaded', function () {
  var aviso = document.getElementById('aviso-relatorio');
  var botaoCopiar = document.getElementById('botao-copiar');
  var botaoImprimir = document.getElementById('botao-imprimir');
  var link = document.getElementById('link-relatorio');

  function avisar(texto) {
    aviso.textContent = texto;
    aviso.hidden = false;
  }

  function copiarAntigo(texto) {
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  botaoCopiar.addEventListener('click', function () {
    var texto = link.textContent;
    function sucesso() { avisar('Link copiado! Agora é só colar no WhatsApp.'); }
    function falha() { avisar('Não foi possível copiar automaticamente. Selecione o link e copie manualmente.'); }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(sucesso, function () {
        if (copiarAntigo(texto)) { sucesso(); } else { falha(); }
      });
    } else if (copiarAntigo(texto)) {
      sucesso();
    } else {
      falha();
    }
  });

  botaoImprimir.addEventListener('click', function () { window.print(); });
});
