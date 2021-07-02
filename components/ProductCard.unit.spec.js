import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

const mountProductCard = server => {
  // Uma unidade do model product
  const product = server.create('product', {
    title: 'Relógio bonito',
    price: '23.00',
    image:
      'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
  });

  const cartManager = new CartManager();

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  });

  return {
    wrapper,
    product,
    cartManager,
  };
};

describe('ProductCard - unit', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const { wrapper } = mountProductCard(server);

    // console.log(wrapper.vm);
    // console.log(wrapper.classes());
    // console.log(wrapper.element);
    // console.log(wrapper.exists());
    // console.log(wrapper.html());
    // console.log(wrapper.text());

    expect(wrapper.vm).toBeDefined();
    // expect(wrapper.vm).not.toBeDefined();
    expect(wrapper.text()).toContain('Relógio bonito');
    expect(wrapper.text()).toContain('$23.00');
  });

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard(server);

    expect(wrapper.element).toMatchSnapshot();
  });

  // xit('should add item to cart state on button click', async () => { // para não rodar esse teste
  it('should add item to cart state on button click', async () => {
    const { wrapper, cartManager, product } = mountProductCard(server);
    // console.log(wrapper.find('button').element);
    const spy1 = jest.spyOn(cartManager, 'open'); // para espionar o método open
    // console.log(spy);
    const spy2 = jest.spyOn(cartManager, 'addProduct');

    await wrapper.find('button').trigger('click');

    expect(spy1).toHaveBeenCalledTimes(1); // foi chamado apenas uma vez
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(product);

    // Visualizar o comportamento da aplicação no browser: Vue DevTools
  });
});
