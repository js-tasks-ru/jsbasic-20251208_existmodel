import Carousel from "../../6-module/3-task/index.js";
import slides from "../../6-module/3-task/slides.js";

import RibbonMenu from "../../7-module/1-task/index.js";
import categories from "../../7-module/1-task/categories.js";

import StepSlider from "../../7-module/4-task/index.js";
import ProductsGrid from "../../8-module/2-task/index.js";

import CartIcon from "../../8-module/1-task/index.js";
import Cart from "../../8-module/4-task/index.js";

export default class Main {
  constructor() {}

  async render() {
    this.carousel = new Carousel(slides);
    let carouselHolder = document.querySelector("[data-carousel-holder]");
    carouselHolder.append(this.carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    let ribbonHolder = document.querySelector("[data-ribbon-holder]");
    ribbonHolder.append(this.ribbonMenu.elem);
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    let stepSliderHolder = document.querySelector("[data-slider-holder]");
    stepSliderHolder.append(this.stepSlider.elem);

    this.cartIcon = new CartIcon();
    let iconHolder = document.querySelector("[data-cart-icon-holder]");
    iconHolder.append(this.cartIcon.elem);

    this.cart = new Cart(this.cartIcon);

    let response = await fetch("products.json");

    try {
      this.products = await response.json();
      console.log("Данные получены:", this.products);
    } catch (e) {
      console.log(e.name);
    }

    //!!Добавляем товары
    this.productsGrid = new ProductsGrid(this.products);
    let productsGridHolder = document.querySelector(
      "[data-products-grid-holder]",
    );
    productsGridHolder.innerHTML = "";
    productsGridHolder.append(this.productsGrid.elem);

    const update = () => {
      this.productsGrid.updateFilter({
        noNuts: document.getElementById("nuts-checkbox").checked,
        vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
        maxSpiciness: this.stepSlider.value,
        category: this.ribbonMenu.value,
      });
    };
    update();

    this.stepSlider.elem.addEventListener("slider-change", (event) => {
      this.stepSlider.value = event.detail;
      update();
    });

    this.ribbonMenu.elem.addEventListener("ribbon-select", (event) => {
      this.ribbonMenu.value = event.detail;
      update();
    });

    document.getElementById("nuts-checkbox").addEventListener("change", update);
    document
      .getElementById("vegeterian-checkbox")
      .addEventListener("change", update);

    document.body.addEventListener("product-add", (event) => {
      let productId = event.detail;

      let product = this.products.find((item) => item.id == productId);

      if (product) {
        this.cart.addProduct(product);
      }
    });
  }
}
