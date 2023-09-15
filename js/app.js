$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 3;

var CELULAR_EMPRESA = '5564999264069';

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },
};

cardapio.metodos = {
  //obtém a lista de itens do cardapio
  obterItensCardapio: (categoria = "burgers", vermais = false) => {
    var filtro = MENU[categoria];

    //limpa o cardapio para troca de menus mas não limpa em caso de clicar em ver mais
    if (!vermais) {
      $("#itensMenu").html("");
      $("#btnVerMais").removeClass("hidden");
    }

    //for it do jquery, usando regex para item global
    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${id}/g, e.id);

      //ver mais foi clicado
      if (vermais && i >= 8 && i < 12) {
        $("#itensMenu").append(temp);
      }

      //paginação inicial (8 itens)
      if (!vermais && i < 8) {
        $("#itensMenu").append(temp);
      }
    });

    //remove active do item
    $(".container-menu a").removeClass("active");

    //seta o menu escolhido para ativo
    $("#menu-" + categoria).addClass("active");
  },

  //botão ver mais click
  verMais: () => {
    var ativo = $(".container-menu a.active").attr("id").split("menu-")[1]; //pega o id ex: menu-burger separa em [menu-] [burger] 0 e 1 e escolhe o 1 que é o nome da categoria ativa
    cardapio.metodos.obterItensCardapio(ativo, true);
    $("#btnVerMais").addClass("hidden");
  },

  //diminuir a quantidade de item do cardapio
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {
      $("#qntd-" + id).text(qntdAtual - 1);
    }
  },

  //aumentar a quantidade de item do cardapio
  aumentarQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
    $("#qntd-" + id).text(qntdAtual + 1);
  },

  //adiciona no carrinho o item do cardápio
  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {
      //obter a categoria ativa
      var categoria = $(".container-menu a.active")
        .attr("id")
        .split("menu-")[1];

      //obtém a lista de itens
      let filtro = MENU[categoria];

      //obtém o item
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        //validar se existe esse item no carrinho
        let existe = $.grep(MEU_CARRINHO, (elem, index) => {
          return elem.id == id;
        });

        //caso exista o item so altera a quantidade
        if (existe.length > 0) {
          //pega posição do item no carrinho
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }
        //caso ainda não exista adiciona ele
        else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }

        cardapio.metodos.mensagem("Item adicionado ao carrinho", "green");
        $("#qntd-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();
      }
    }
  },

  //atualiza o total de itens adicionados no carrinho
  atualizarBadgeTotal: () => {
    var total = 0;

    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qntd;
    });

    if (total > 0) {
      $(".botao-carrinho").removeClass("hidden");
      $(".container-total-carrinho").removeClass("hidden");
    } else {
      $(".botao-carrinho").addClass("hidden");
      $(".container-total-carrinho").addClass("hidden");
    }

    $(".badge-total-carrinho").html(total);
  },

  //abrir a modal do carrinho
  abrirCarrinho: (abrir) => {
    if (abrir) {
      $("#modalCarrinho").removeClass("hidden");
      cardapio.metodos.carregarCarrinho();
    } else {
      $("#modalCarrinho").addClass("hidden");
    }
  },

  //altera entre as etapas do carrinho e exibe os botões
  carregarEtapa: (etapa) => {
    if (etapa == 1) {
      $("#lblTituloEtapa").text("Seu carrinho:");
      $("#itensCarrinho").removeClass("hidden");
      $("#localEntrega").addClass("hidden");
      $("#resumoCarrinho").addClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa1").addClass("active");

      $("#btnEtapaPedido").removeClass("hidden");
      $("#btnEtapaEndereco").addClass("hidden");
      $("#btnEtapaResumo").addClass("hidden");
      $("#btnVoltar").addClass("hidden");
    }

    if (etapa == 2) {
      $("#lblTituloEtapa").text("Endereço de entrega:");
      $("#itensCarrinho").addClass("hidden");
      $("#localEntrega").removeClass("hidden");
      $("#resumoCarrinho").addClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa1").addClass("active");
      $(".etapa2").addClass("active");

      $("#btnEtapaPedido").addClass("hidden");
      $("#btnEtapaEndereco").removeClass("hidden");
      $("#btnEtapaResumo").addClass("hidden");
      $("#btnVoltar").removeClass("hidden");
    }

    if (etapa == 3) {
      $("#lblTituloEtapa").text("Resumo do pedido:");
      $("#itensCarrinho").addClass("hidden");
      $("#localEntrega").addClass("hidden");
      $("#resumoCarrinho").removeClass("hidden");

      $(".etapa").removeClass("active");
      $(".etapa1").addClass("active");
      $(".etapa2").addClass("active");
      $(".etapa3").addClass("active");

      $("#btnEtapaPedido").addClass("hidden");
      $("#btnEtapaEndereco").addClass("hidden");
      $("#btnEtapaResumo").removeClass("hidden");
      $("#btnVoltar").removeClass("hidden");
    }
  },

  //voltar etapas do carrinho
  voltarEtapa: () => {
    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapa(etapa - 1);
  },

  //carrega a lista de itens do carrinho
  carregarCarrinho: () => {
    cardapio.metodos.carregarEtapa(1);

    if (MEU_CARRINHO.length > 0) {
      $("#itensCarrinho").html("");

      $.each(MEU_CARRINHO, (i, e) => {
        let temp = cardapio.templates.itemCarrinho
          .replace(/\${img}/g, e.img)
          .replace(/\${name}/g, e.name)
          .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
          .replace(/\${id}/g, e.id)
          .replace(/\${qntd}/g, e.qntd);

        $("#itensCarrinho").append(temp);

        //Ultimo item adicionado
        if ((i + 1) == MEU_CARRINHO.length) {
          //atualiza os valores do carrinho
          cardapio.metodos.carregarValores();
        }
      });
    }
    else {
      $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio</p>');

      //atualiza os valores do carrinho
      cardapio.metodos.carregarValores();
    }
  },

  //diminuir a quantidade de item do carrinho
  diminuirQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    if (qntdAtual > 1) {
      $("#qntd-carrinho-" + id).text(qntdAtual - 1);
      cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
    }
    else {
      cardapio.metodos.removerItemCarrinho(id);
    }
  },

  //aumentar a quantidade de item do carrinho
  aumentarQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    $("#qntd-carrinho-" + id).text(qntdAtual + 1);
    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
  },

  //remover item do carrinho
  removerItemCarrinho: (id) => {
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {return e.id != id});
    cardapio.metodos.carregarCarrinho();

    //atualiza o botão do carrinho com a quantidade alterada
    cardapio.metodos.atualizarBadgeTotal();
  },

  //atualizar o carrinho com a quantidade alterada
  atualizarCarrinho: (id, qntd) => {

    let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
    MEU_CARRINHO[objIndex].qntd = qntd;

    //atualiza o botão do carrinho com a quantidade alterada
    cardapio.metodos.atualizarBadgeTotal();

    //atualiza os valores do carrinho
    cardapio.metodos.carregarValores();

  },

  //carrega os valores do carrinho
  carregarValores: () => {

    VALOR_CARRINHO = 0;
    $("#lblSubtotal").text('R$ 0,00');
    $("#lblValorEntrega").text('+ R$ 0,00');
    $("#lblValorTotal").text('R$ 0,00');
    $.each(MEU_CARRINHO, (i, e) => {
      VALOR_CARRINHO += parseFloat(e.price * e.qntd);
      if(i + 1 == MEU_CARRINHO.length) {
        $("#lblSubtotal").text('R$ ' + VALOR_CARRINHO.toFixed(2).replace(".", ","));
        $("#lblValorEntrega").text('+ R$ ' + VALOR_ENTREGA.toFixed(2).replace(".", ","));
        $("#lblValorTotal").text('R$ ' + (VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace(".", ","));
      }
    });
  },

  //Carrega o endereço de entrega
  carregarEndereco: () => {
    if(MEU_CARRINHO.length <= 0) {
      cardapio.metodos.mensagem('Seu carrinho está vazio', 'red');
      return false;
    }
    cardapio.metodos.carregarEtapa(2);
  },

  //Carrega o Endereço de entrega através do CEP usando a API do ViaCEP
  buscarCep: () => {
    //cria a variável cep e remove os caracteres especiais
    var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

    //valida se o cep possui valor informado
    if(cep != '') {

      //valida se o cep possui 8 caracteres
      var validacep = /^[0-9]{8}$/;

      //valida o formato do cep
      if(validacep.test(cep)) {

        $.getJSON("https://viacep.com.br/ws/" + cep +"/json/?callback=?", function(dados) {

          //valida se o CEP foi encontrado
          if (!("erro" in dados)) {

            //preenche os campos
            $("#txtEndereco").val(dados.logradouro);
            $("#txtBairro").val(dados.bairro);
            $("#txtCidade").val(dados.localidade);
            $("#ddlUF").val(dados.uf);
            $("#txtNumero").focus();
          }
          else {
            cardapio.metodos.mensagem('CEP não encontrado, favor preencha as informações manualmente', 'red');
            $("#txtEndereco").focus();
          }
        }
        );

      }
      else {
        cardapio.metodos.mensagem('CEP inválido', 'red');
        $("#txtCEP").focus();
      }

    }
    else{
      cardapio.metodos.mensagem('Informe o CEP', 'red');
      $("#txtCEP").focus();
    }
  },

  //validação do endereço de entrega antes da etapa de resumo
  resumoPedido: () => {

    let cep = $("#txtCEP").val().trim();
    let endereco = $("#txtEndereco").val().trim();
    let numero = $("#txtNumero").val().trim();
    let bairro = $("#txtBairro").val().trim();
    let cidade = $("#txtCidade").val().trim();
    let uf = $("#ddlUF").val().trim();
    let complemento = $("#txtComplemento").val().trim();

    if(cep.length <= 0) {
      cardapio.metodos.mensagem('Informe o CEP', 'red');
      $("#txtCEP").focus();
      return false;
    }
    if(endereco.length <= 0) {
      cardapio.metodos.mensagem('Informe o Endereço', 'red');
      $("#txtEndereco").focus();
      return false;
    }
    if(numero.length <= 0) {
      cardapio.metodos.mensagem('Informe o Número, Caso não tenha colocar SN e colocar quadra e lote no complemento.', 'red');
      $("#txtNumero").focus();
      return false;
    }
    if(bairro.length <= 0) {
      cardapio.metodos.mensagem('Informe o Bairro', 'red');
      $("#txtBairro").focus();
      return false;
    }
    if(cidade.length <= 0) {
      cardapio.metodos.mensagem('Informe a Cidade', 'red');
      $("#txtCidade").focus();
      return false;
    }
    if(uf == "-1") {
      cardapio.metodos.mensagem('Informe o Estado', 'red');
      $("#ddlUF").focus();
      return false;
    }

    MEU_ENDERECO = {
      cep: cep,
      endereco: endereco,
      numero: numero,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      complemento: complemento
    }

    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();
  },

  //carrega o resumo do pedido
  carregarResumo: () => {

    $("#listaItensResumo").html("");
    $.each(MEU_CARRINHO, (i, e) => {
      let temp = cardapio.templates.itemResumo
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${qntd}/g, e.qntd);

      $("#listaItensResumo").append(temp);
    });

    $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
    $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);
    cardapio.metodos.finalizarPedido();
  },

  //atualiza o link do botão do whatsapp
  finalizarPedido: () => {

    //monta a lista de itens para o pedido no whatsapp
    if(MEU_CARRINHO.length > 0 && MEU_CARRINHO != null) {
      var texto = 'Olá, gostaria de fazer o pedido:';
      texto += `\n*Itens do pedido:* \n\${itens}`;
      texto += '\n*Endereço de entrega:*';
      texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
      texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
      texto += `\n\n*Valor total:* R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace(".", ",")}`;

      var itens = '';


      $.each(MEU_CARRINHO, (i, e) => {
        itens += `*${e.qntd}x* ${e.name} - R$ ${(e.price * e.qntd).toFixed(2).replace(".", ",")}\n`;

        //ultimo item
        if(i + 1 == MEU_CARRINHO.length) {
          texto = texto.replace(/\${itens}/g, itens);

          //converte a URL
          let encode = encodeURI(texto);
          let link = `https://api.whatsapp.com/send?phone=${CELULAR_EMPRESA}&text=${encode}`;
          $("#btnEtapaResumo").attr('href', link);
        }
      });
    }

  },





  //mensagens personalizadas
  mensagem: (texto, cor = "red", tempo = 3500) => {
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagem").append(msg);

    setTimeout(() => {
      $("#msg-" + id).removeClass("fadeInDown");
      $("#msg-" + id).addClass("fadeOutUp");
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800);
    }, tempo);
  },
};

cardapio.templates = {
  item: `
    <div class="col-3 mb-5">
      <div class="card card-item" id="\${id}">
        <div class="img-produto">
          <img src="\${img}"/>
        </div>
        <p class="title-produto text-center mt-4">
          <b>\${name}</b>
        </p>
        <p class="price-produto text-center">
          <b>R$ \${price}</b>
        </p>
        <div class="add-carrinho">
          <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
          <span class="add-numero-itens" id="qntd-\${id}">0</span>
          <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
          <span class="btn btm-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
        </div>
      </div>
    </div>
  `,
  itemCarrinho: `
    <div class="col-12 item-carrinho">
      <div class="img-produto">
        <img src="\${img}"/>
      </div>
      <div class="dados-produto">
        <p class="title-produto"><b>\${name}</b></p>
        <p class="price-produto"><b>R$ \${price}</b></p>
      </div>
      <div class="add-carrinho">
        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
        <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
        <span class="btn btm-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
      </div>
    </div>
  `,
  itemResumo: `
    <div class="col-12 item-carrinho resumo">
      <div class="img-produto-resumo">
        <img src="\${img}">
      </div>
      <div class="dados-produto">
        <p class="title-produto-resumo">
          <b>\${name}</b>
        </p>
        <p class="price-produto-resumo">
          <b>R$ \${price}</b>
        </p>
      </div>
      <p class="quantidade-produto-resumo">
        x <b>\${qntd}</b>
      </p>
    </div>
  `,
};
