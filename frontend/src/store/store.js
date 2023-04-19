import { createStore } from 'vuex'

export default createStore({
  state: {
    profile: null,
    categories: [],
    products: {
      total: 0,
      data: []
    },
    users: {
      total: 0,
      data: []
    },
    cart: [],
    currentProduct: null,
    currentCategory: null
  },
  mutations: {
    set_profile (state, profile) {
      state.profile = profile
    },
    delete_profile (state) {
      state.profile = null
    },
    set_categories (state, cats) {
      state.categories = cats
    },
    set_products (state, prods) {
      state.products = prods
    },
    set_users (state, users) {
      state.users = users
    },
    update_category (state, { category, update }) {
      Object.assign(category, update)
    },
    update_product (state, { product, update }) {
      Object.assign(product, update)
    },
    add_category (state, cat) {
      state.categories.push(cat)
    },
    add_product (state, prod) {
      state.products.data.push(prod)
    },
    delete_category (state, category) {
      state.categories = state.categories.filter(cat => cat._id !== category._id)
      if (state.currentCategory._id === category._id) state.currentCategory = null
    },
    delete_product (state, product) {
      state.products.data = state.products.data.filter(prod => prod._id !== product._id)
      if (state.currentProduct._id === product._id) state.currentProduct = null
    },
    set_current_product (state, product) {
      state.currentProduct = product
    },
    set_current_category (state, category) {
      state.currentCategory = category
    },
    add_to_cart (state, cartItem) {
      state.cart.push(cartItem)
    },
    remove_from_cart (state, product) {
      state.cart = this.state.cart.filter(item => item.product._id !== product._id)
    }
  },
  getters: {
    loggedIn: state => state.profile !== null,
    isAdmin: state => state.profile !== null && state.profile.role === 'admin'
  },
  actions: {},
  modules: {}
})
