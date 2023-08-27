$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

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

    if (qntdAtual > 0){

      //obter a categoria ativa
      var categoria = $(".container-menu a.active").attr("id").split("menu-")[1];

      //obtém a lista de itens
      let filtro = MENU[categoria];

      //obtém o item
      let item = $.grep(filtro, (e, i) => {return e.id == id})

      if(item.length > 0){

        //validar se existe esse item no carrinho
        let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id})

        //caso exista o item so altera a quantidade
        if(existe.length > 0){
          //pega posição do item no carrinho
          let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

        }
        //caso ainda não exista adiciona ele
        else{
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }


        alert('Item adicionado ao carrinho.')
        $("#qntd-" + id).text(0)
      }

    }

  },
};

cardapio.templates = {
  item: `
    <div class="col-3 mb-5">
                <div class="card card-item" id="\${id}">
                  <div class="img-produto">
                    <img
                      src="\${img}"
                    />
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
};