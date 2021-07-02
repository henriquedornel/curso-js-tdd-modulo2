import Vue from 'vue';

export default {
  // quando o Vue for criado, a instância do Vue será passada como parâmetro
  install: Vue => {
    /* istanbul ignore next */ // faz com que a próxima linha seja ignorada ao gerar o relatório de coverage (mas nao vai fazer o coverage de funções atingir 100%)
    Vue.prototype.$cart = new CartManager(); // para tornar o CartManager disponível globalmente, inclusive diretamente no template, sem a necessidade de criar computed properties (mas pode-se usar computed properties para deixar o template mais legível)
  },
};

const initialState = {
  open: false,
  items: [],
};

export class CartManager {
  state;

  constructor() {
    this.state = Vue.observable(initialState);
  }

  getState() {
    return this.state;
  }

  open() {
    this.state.open = true;

    return this.getState();
  }

  close() {
    this.state.open = false;

    return this.getState();
  }

  productIsInTheCart(product) {
    return !!this.state.items.find(({ id }) => id === product.id); // se for nulo ou undefined, vai retornar false
  }

  hasProducts() {
    return this.state.items.length > 0;
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) {
      this.state.items.push(product);
    }

    return this.getState();
  }

  removeProduct(productId) {
    this.state.items = [
      ...this.state.items.filter(product => product.id !== productId),
    ];

    return this.getState();
  }

  clearProducts() {
    this.state.items = [];

    return this.getState();
  }

  clearCart() {
    this.clearProducts();
    this.close();

    return this.getState();
  }
}
