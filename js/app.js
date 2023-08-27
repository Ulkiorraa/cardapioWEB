$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },
};

cardapio.metodos = {
  //obtém a lista de itens do cardapio
  obterItensCardapio: (categoria = 'burgers') => {
    var filtro = MENU[categoria];

    //limpa o cardapio para troca de menus
    $("#itensMenu").html('')

    //for it do jquery, usando regex para item global
    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));

      $("#itensMenu").append(temp);
    });

    //remove active do item
    $(".container-menu a").removeClass('active');

    //seta o menu escolhido para ativo
    $("#menu-" + categoria).addClass('active')

  },
};

cardapio.templates = {
  item: `
    <div class="col-3 mb-5">
                <div class="card card-item">
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
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btm-add"><i class="fas fa-shopping-bag"></i></span>
                  </div>
                </div>
              </div>
    `,
};
