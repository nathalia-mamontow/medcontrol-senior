/* Calendário: ao clicar em um dia, mostra os medicamentos daquele dia */
document.addEventListener('DOMContentLoaded', function () {
  // Dados de exemplo de junho de 2026 (troque por dados reais quando houver)
  var DADOS = {
  "1": [
    {
      "nome": "Losartana Potássica",
      "hora": "08:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "08:02"
    },
    {
      "nome": "Losartana Potássica",
      "hora": "20:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "20:01"
    }
  ],
  "2": [
    {
      "nome": "Losartana Potássica",
      "hora": "08:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "08:03"
    },
    {
      "nome": "Losartana Potássica",
      "hora": "20:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "20:02"
    }
  ],
  "3": [
    {
      "nome": "Losartana Potássica",
      "hora": "08:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "08:04"
    },
    {
      "nome": "Losartana Potássica",
      "hora": "20:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "20:03"
    }
  ],
  "4": [
    {
      "nome": "Losartana Potássica",
      "hora": "08:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "08:05"
    },
    {
      "nome": "Losartana Potássica",
      "hora": "20:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "20:04"
    }
  ],
  "5": [
    {
      "nome": "Losartana Potássica",
      "hora": "08:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "08:04"
    },
    {
      "nome": "Varfarina Sódica",
      "hora": "14:00",
      "dose": "5mg (1 Comp.)",
      "estado": "nao-tomado"
    },
    {
      "nome": "Tylenol Sinus (Paracetamol)",
      "hora": "15:00",
      "dose": "500mg (1 Comp.)",
      "estado": "atrasado"
    }
  ],
  "6": [
    {
      "nome": "Losartana Potássica",
      "hora": "08:00",
      "dose": "50mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "08:02"
    },
    {
      "nome": "Tylenol Sinus (Paracetamol)",
      "hora": "09:00",
      "dose": "500mg (1 Comp.)",
      "estado": "tomado",
      "confirmado": "09:12"
    },
    {
      "nome": "Varfarina Sódica",
      "hora": "14:00",
      "dose": "5mg (1 Comp.)",
      "estado": "aguardando"
    },
    {
      "nome": "Aspirina Prevent",
      "hora": "14:00",
      "dose": "100mg (1 Comp.)",
      "estado": "aguardando"
    },
    {
      "nome": "Tylenol Sinus (Paracetamol)",
      "hora": "15:00",
      "dose": "500mg (1 Comp.)",
      "estado": "atrasado"
    },
    {
      "nome": "Losartana Potássica",
      "hora": "20:00",
      "dose": "50mg (1 Comp.)",
      "estado": "aguardando"
    }
  ]
};

  var ESTADOS = { 'tomado': 'Tomado', 'aguardando': 'Aguardando', 'atrasado': 'Atrasado', 'nao-tomado': 'Não tomado' };
  var lista = document.getElementById('lista-doses');
  var resumo = document.getElementById('detalhes-resumo');
  var botoes = document.querySelectorAll('.cal-dia');
  if (!lista || !resumo) { return; }

  function montarDose(x) {
    var html = '<div class="dose-topo"><p class="dose-nome">' + x.nome + '</p>' +
      '<span class="estado estado-' + x.estado + '">' + ESTADOS[x.estado] + '</span></div>' +
      '<p class="dose-info"><svg class="icone" aria-hidden="true" focusable="false"><use href="#i-relogio"/></svg>' +
      '<time datetime="' + x.hora + '">' + x.hora + '</time> • ' + x.dose + '</p>';
    if (x.confirmado) {
      html += '<p class="dose-confirmacao"><span aria-hidden="true">✓</span> Confirmado às ' +
        '<time datetime="' + x.confirmado + '">' + x.confirmado + '</time></p>';
    }
    return html;
  }

  function mostrarDia(dia) {
    var registros = DADOS[dia] || [];
    lista.innerHTML = '';
    if (registros.length === 0) {
      var vazio = document.createElement('li');
      vazio.className = 'dose dose-vazia';
      vazio.textContent = 'Nenhum registro de medicamentos para este dia.';
      lista.appendChild(vazio);
    }
    for (var i = 0; i < registros.length; i++) {
      var item = document.createElement('li');
      item.className = 'dose';
      item.innerHTML = montarDose(registros[i]);
      lista.appendChild(item);
    }
    resumo.textContent = 'Registros para o dia ' + dia + ' de junho.';
    for (var j = 0; j < botoes.length; j++) {
      botoes[j].setAttribute('aria-pressed', botoes[j].getAttribute('data-dia') === String(dia) ? 'true' : 'false');
    }
  }

  for (var k = 0; k < botoes.length; k++) {
    botoes[k].addEventListener('click', function () {
      mostrarDia(this.getAttribute('data-dia'));
    });
  }
});
