import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

describe('Cart - unit', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  const mountCart = server => {
    const products = server.createList('product', 2);

    const cartManager = new CartManager();

    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
      mocks: {
        $cart: cartManager,
      },
    });

    return { wrapper, products, cartManager };
  };

  it('should mount the component', () => {
    const { wrapper } = mountCart(server);

    expect(wrapper.vm).toBeDefined();
  });

  it('should not display empty cart button when there are no products', () => {
    const { cartManager } = mountCart(server);

    const wrapper = mount(Cart, {
      // wrapper sem nenhum produto
      mocks: {
        $cart: cartManager,
      },
    });

    expect(wrapper.find('[data-testid="clear-cart-button"]').exists()).toBe(
      false,
    );
  });

  it('should emit close event when button gets clicked', async () => {
    const { wrapper } = mountCart(server);
    const button = wrapper.find('[data-testid="close-button"]');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy(); // tudo que for diferente de false, 0, '', null, undefined e NaN
    expect(wrapper.emitted().close).toHaveLength(1); // verificar se o evento ocorreu apenas uma vez
  });

  it('should hide the cart when no prop isOpen is passed', () => {
    const { wrapper } = mountCart(server);

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should display the cart when prop isOpen is passed', async () => {
    const { wrapper } = mountCart(server);

    await wrapper.setProps({
      isOpen: true,
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('should display "Cart is empty" when there are no products', async () => {
    const { wrapper } = mountCart(server);

    wrapper.setProps({
      products: [],
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should display 2 instances of CartItem when 2 products are provided', () => {
    const { wrapper } = mountCart(server);

    // console.log(wrapper.text());

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });

  it('should display a button to clear cart', () => {
    const { wrapper } = mountCart(server);
    const button = wrapper.find('[data-testid="clear-cart-button"]');

    expect(button.exists()).toBe(true);
  });

  it('should call cart manager clearProducts() when button gets clicked', async () => {
    const { wrapper, cartManager } = mountCart(server);
    const spy = jest.spyOn(cartManager, 'clearProducts');
    await wrapper.find('[data-testid="clear-cart-button"]').trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
