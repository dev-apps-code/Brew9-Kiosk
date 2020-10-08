import {
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Animated,
  TouchableHighlight,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import Modal from "react-native-modal";
import PushRequestObject from "../Requests/push_request_object";
import { connect } from "react-redux";
import { createAction } from "../Utils/index";
import ProductCell from "./ProductCell";
import CategoryCell from "./CategoryCell";
import BannerCell from "./BannerCell";
import CartCell from "./CartCell";
import { alpha, fontAlpha, windowHeight, windowWidth } from "../Common/size";
import ProductRequestObject from "../Requests/product_request_object";
import _ from "lodash";
import AutoHeightImage from "react-native-auto-height-image";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { TITLE_FONT, NON_TITLE_FONT } from "../Common/common_style";
import AnimationLoading from "../Components/AnimationLoading";

@connect(({ members, shops }) => ({
  currentMember: members.profile,
  company_id: members.company_id,
  location: members.location,
  selectedShop: shops.selectedShop,
}))
class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTintColor: "black",
      headerLeft: (
        <View style={styles.headerLeftContainer}>
          <TouchableOpacity
            onPress={params.onLogoPressed ? params.onLogoPressed : () => null}
            style={styles.navigationBarItem}
          >
            <Image
              source={require("./../../assets/images/logo.png")}
              style={styles.navigationBarItemIcon}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: null,
    };
  };

  static tabBarItemOptions = ({ navigation }) => {
    return {
      tabBarLabel: "Order",
      tabBarIcon: ({ iconTintColor, focused }) => {
        const image = focused
          ? require("./../../assets/images/menu_selected.png")
          : require("./../../assets/images/menu.png");

        return (
          <Image
            source={image}
            style={{
              resizeMode: "contain",
              width: 30 * alpha,
              height: 30 * alpha,
            }}
          />
        );
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isCartToggle: false,
      page: 1,
      data: [],
      cart: [],
      cart_total: 0,
      cart_total_quantity: 0,

      loading: true,
      isRefreshing: false,
      selected_category: 0,
      profile: [],
      menu_banners: [],
      products: [],
      product_view_height: 0 * alpha,
      modalVisible: false,
      selected_index: null,
      select_quantity: 1,
      shop: 1,
      delivery: 1,
      modalGalleryVisible: true,
      selected_promotion: "",
      isPromoToggle: false,
      isToggleLocation: false,
      exempted: ["Reusable Bag", "Be Inspired", "Go Green", "Stay Together"],
    };
    this.moveAnimation = new Animated.ValueXY({ x: 0, y: windowHeight });
  }

  getLocationAsync = async () => {
    const { dispatch } = this.props;

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.refs.toast.show("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});

    dispatch(createAction("members/setLocation")(location));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location != this.props.location) {
      this.loadShops(false);
    }
  }
  componentWillMount() {
    if (Platform.OS === "android") {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
    } else {
      // this.getLocationAsync();
    }
    const { dispatch } = this.props;
    dispatch(createAction("members/loadCurrentUserFromCache")({}));
  }

  componentDidMount() {
    this.loadShops(true);
    this.interval = setInterval(() => {
      this.loadShops(true);
    }, 9000000);
    // this.loadStorePushToken()
  }

  loadStorePushToken() {
    const { dispatch, currentMember } = this.props;
    const callback = (eventObject) => {
      if (eventObject.success) {
      }
    };

    if (currentMember != null) {
      const obj = new PushRequestObject(
        "device_key",
        "device_type",
        "push_identifier",
        "os"
      );
      obj.setUrlId(currentMember.id);
      dispatch(
        createAction("members/loadStorePushToken")({
          object: obj,
          callback,
        })
      );
    }
  }

  loadShops(loadProducts) {
    this.setState(
      {
        shop: this.props.selectedShop,
        menu_banners: this.props.selectedShop.menu_banners,
      },
      () => {
        if (loadProducts) {
          this.loadStoreProducts();
        }
      }
    );
  }

  loadStoreProducts() {
    const { dispatch, selectedShop } = this.props;
    const { selected_category } = this.state;

    const callback = (eventObject) => {
      if (eventObject.success) {
        const { result } = eventObject;
        const filteredData = [];

        result.forEach((products, index) => {
          const { show_menu_kiosk } = products;

          if (
            typeof show_menu_kiosk === "undefined" ||
            show_menu_kiosk == true
          ) {
            filteredData.push(products);
          }
        });

        for (var index in filteredData) {
          filteredData[index].selected = index === selected_category;
        }

        this.setState((prevState) => ({
          ...prevState,
          data: filteredData,
          total: eventObject.total,
          products: filteredData[0].products,
          isRefreshing: false,
          loading: false,
        }));
      } else {
        // Failed to fetch products
      }
    };

    const obj = new ProductRequestObject();
    obj.setUrlId(selectedShop.id);
    dispatch(
      createAction("products/loadStoreProducts")({
        object: obj,
        callback,
      })
    );
  }

  onRefresh() {
    this.setState({
      isRefreshing: true,
      data: [],
    });
    this.loadShops(true);
  }

  onCheckoutPressed = () => {
    const { navigate } = this.props.navigation;
    navigate("Checkout", {
      cart: this.state.cart,
      cart_total_quantity: this.state.cart_total_quantity,
      cart_total: this.state.cart_total,
      shop: this.state.shop,
    });
  };

  onBannerPressed = (item, index) => {
    const { navigate } = this.props.navigation;

    this.setState(
      {
        selected_promotion: item.banner_detail_image,
      },
      function () {
        this.setState({
          isPromoToggle: true,
        });
      }
    );
  };

  _toggleDelivery = (value) => {
    if (value === 1) {
      this.refs.toast.show("Delivery Option Coming Soon");
    }

    setTimeout(() => {
      this.setState({ delivery: 0 });
    }, 3000);
  };

  onSelectCategory = (scroll_index, selected_index) => {
    let data = [...this.state.data];

    for (var index in data) {
      data[index].selected = selected_index == index;
    }
    this.setState({
      data,
      selected_category: selected_index,
      products: this.state.data[selected_index].products,
    });
  };

  onMorePressed = () => {
    let toggle = this.state.isToggleLocation;

    if (toggle) {
      this.setState({
        isToggleLocation: false,
      });
    } else {
      this.setState({
        isToggleLocation: true,
      });
    }
  };

  toogleCart = (isUpdate) => {
    const { isCartToggle, product_view_height } = this.state;

    var product_checkout_height = product_view_height;
    var headerHeight = 31 * alpha;
    var height = this.state.cart.length * 71 * alpha;
    var checkoutHeight = 51 * alpha;
    var content = headerHeight + height + checkoutHeight;
    var finalheight = product_checkout_height - content;
    var height_cap = product_view_height * 0.4;

    if (finalheight < height_cap) {
      finalheight = height_cap;
    }

    if (isUpdate) {
      if (isCartToggle) {
        Animated.spring(this.moveAnimation, {
          toValue: {
            x: 0,
            y: this.state.cart.length == 0 ? windowHeight : finalheight,
          },
        }).start();
      }
    } else {
      if (isCartToggle) {
        this.setState({ isCartToggle: false }, function () {
          Animated.spring(this.moveAnimation, {
            toValue: { x: 0, y: windowHeight },
          }).start();
        });
      } else {
        this.setState({ isCartToggle: true }, function () {
          Animated.spring(this.moveAnimation, {
            toValue: { x: 0, y: finalheight },
          }).start();
        });
      }
    }
  };

  measureView(event) {
    this.setState({
      product_view_height: event.nativeEvent.layout.height,
    });
  }

  renderPopOutCartFlatListCell = ({ item, index }) => {
    return (
      <CartCell
        navigation={this.props.navigation}
        id={item.id}
        name={item.name}
        item={item}
        quantity={item.quantity}
        variations={item.selected_variants}
        // currency={this.props.members.currency}
        onChangeQuantity={this.onChangeQuantityPress}
        price={item.price}
      />
    );
  };

  renderCategorylistFlatListCell = ({ item, index }) => {
    return (
      <CategoryCell
        navigation={this.props.navigation}
        categoryname={item.name}
        categoryImage={item.image.icon.url}
        index={index}
        scrollIndex={item.scroll_index}
        onSelectCategory={this.onSelectCategory}
        selected={item.selected}
        label={item.label}
      />
    );
  };

  renderProductlistFlatListCell = ({ item, index }) => {
    if (item) {
      if (item.clazz == "product") {
        return (
          <ProductCell
            navigation={this.props.navigation}
            currency={"$"}
            index={index}
            item={item}
            productname={item.name}
            productstatus={item.status}
            productprice={item.price}
            productimage={item.image.url}
            productquantity={item.quantity}
            productsummary={item.summary}
            productvariant={item.variants}
            productenable={item.enabled}
            productstatus={item.status}
            productDiscountedPrice={item.discounted_price}
            productDiscountTagLabel={item.discount_tag_label}
            productDiscountTagColor={item.discount_tag_color}
            productDiscountTagTextColor={item.discount_tag_text_color}
            producttotalquantity={item.total_quantity}
            onChangeQuantity={this.onChangeQuantityPress}
            onCellPress={this.onCellPress}
          />
        );
      } else if (item.clazz == "menu_banner_kiosk") {
        return (
          <BannerCell
            index={index}
            item={item}
            navigation={this.props.navigation}
            bannerImage={item.menu_image}
            detailImage={item.menu_banner_kiosk}
            onPressItem={this.onBannerPressed}
          />
        );
      }
    }
  };

  onCellPress = (item, index) => {
    if (this.state.isCartToggle) {
      this.toogleCart(false);
    }
    this.setState({ modalVisible: true, selected_index: index });
  };

  onChangeQuantityPress = (item, index, operation, isCart) => {
    let cart = [...this.state.cart];

    if (isCart) {
      var product_index = this.state.products.findIndex(
        (element) => element.id == item.id && element.clazz == "product"
      );
      var item = this.state.products[product_index];

      var selected_cart = cart[index];

      var cartItem = {
        clazz: item.clazz,
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: selected_cart.price,
        selected_variants: selected_cart.selected_variants,
        quantity: selected_cart.quantity,
      };

      if (operation === "add") {
        if (cartItem.quantity) {
          item.quantity = item.quantity + 1;
          cartItem.quantity = cartItem.quantity + 1;
          item.total_quantity = item.total_quantity + 1;
        } else {
          item.quantity = 1;
          cartItem.quantity = 1;
        }

        this.state.products[product_index] = item;

        if (index >= 0) {
          cart[index] = cartItem;
          this.setState({ cart }, function () {
            this.toogleCart(true);
          });
        } else {
          this.setState(
            {
              cart: this.state.cart.concat(cartItem),
            },
            function () {
              this.toogleCart(true);
            }
          );
        }

        this.state.cart_total_quantity =
          parseInt(this.state.cart_total_quantity) + 1;
        this.state.cart_total = (
          parseFloat(this.state.cart_total) + parseFloat(cartItem.price)
        ).toFixed(2);
      } else {
        if (cartItem.quantity > 1) {
          if (item.quantity > 0) item.quantity = item.quantity - 1;
          cartItem.quantity = cartItem.quantity - 1;
          item.total_quantity = item.total_quantity - 1;
        } else {
          item.quantity = null;
          cartItem.quantity = null;
          item.total_quantity = 0;
        }

        this.state.products[product_index] = item;

        if (index >= 0) {
          cart[index] = cartItem;
          // this.state.cart.splice(cart_index, 1, cartItem)
        }
        if (cartItem.quantity === null) {
          cart.splice(index, 1);
        }
        this.setState({ cart }, function () {
          this.toogleCart(true);
        });
        this.state.cart_total_quantity =
          parseInt(this.state.cart_total_quantity) - 1;
        this.state.cart_total = (
          parseFloat(this.state.cart_total) - parseFloat(cartItem.price)
        ).toFixed(2);
      }

      this.forceUpdate();
    } else {
      var item = this.state.products[index];

      var cartItem = {
        clazz: item.clazz,
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      };

      var cart_index = cart.findIndex((element) => element.id == item.id);

      if (operation === "add") {
        if (item.quantity) {
          item.quantity = item.quantity + 1;
          cartItem.quantity = cartItem.quantity + 1;
        } else {
          item.quantity = 1;
          cartItem.quantity = 1;
        }

        this.state.products[index] = item;

        if (cart_index >= 0) {
          cart[cart_index] = cartItem;
          this.setState({ cart }, function () {
            this.toogleCart(true);
          });
        } else {
          this.setState(
            {
              cart: this.state.cart.concat(cartItem),
            },
            function () {
              this.toogleCart(true);
            }
          );
        }
        this.state.cart_total_quantity =
          parseInt(this.state.cart_total_quantity) + 1;
        this.state.cart_total = (
          parseFloat(this.state.cart_total) + parseFloat(item.price)
        ).toFixed(2);
      } else {
        if (item.quantity > 1) {
          item.quantity = item.quantity - 1;
          cartItem.quantity = cartItem.quantity - 1;
        } else {
          item.quantity = null;
          cartItem.quantity = null;
        }

        this.state.products[index] = item;

        if (cart_index >= 0) {
          cart[cart_index] = cartItem;
          // this.state.cart.splice(cart_index, 1, cartItem)
        }
        if (item.quantity === null) {
          cart.splice(cart_index, 1);
        }
        this.setState({ cart }, function () {
          this.toogleCart(true);
        });
        this.state.cart_total_quantity =
          parseInt(this.state.cart_total_quantity) - 1;
        this.state.cart_total = (
          parseFloat(this.state.cart_total) - parseFloat(item.price)
        ).toFixed(2);
      }

      this.forceUpdate();
    }
  };

  onAddToCartPressed = (product) => {
    let cart = [...this.state.cart];

    const clone_variants = _.cloneDeep(product.selected_variants);
    const search_cart_index = cart.findIndex(
      (element) =>
        element.id == product.id &&
        _.isEqual(product.selected_variants, element.selected_variants)
    );

    var search_cart = this.state.cart[search_cart_index];

    let cartItem = {
      clazz: product.clazz,
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.calculated_price,
      quantity: this.state.select_quantity,
      selected_variants: clone_variants,
    };

    product.total_quantity =
      parseInt(product.total_quantity) + parseInt(this.state.select_quantity);

    let total_price = product.calculated_price * this.state.select_quantity;

    if (search_cart) {
      search_cart.quantity =
        parseInt(search_cart.quantity) + parseInt(this.state.select_quantity);
      this.setState({ cart, select_quantity: 1 });
    } else {
      this.setState(
        {
          cart: this.state.cart.concat(cartItem),
          products: this.state.products,
          select_quantity: 1,
        },
        function () {
          this.toogleCart(true);
        }
      );
    }

    this.setState({
      modalVisible: false,
      cart_total_quantity:
        parseInt(this.state.cart_total_quantity) +
        parseInt(this.state.select_quantity),
      cart_total: (
        parseFloat(this.state.cart_total) + parseFloat(total_price)
      ).toFixed(2),
    });
  };

  onClosePressed = () => {
    this.setState({ modalVisible: false, isPromoToggle: false });
  };

  onClearPress = () => {
    if (this.state.isCartToggle) {
      this.toogleCart(false);
    }
    this.state.cart = [];
    for (var index in this.state.products) {
      this.state.products[index].quantity = null;
      this.state.products[index].total_quantity = 0;
    }
  };

  onFeaturedPromotionPressed(item) {
    const { navigate } = this.props.navigation;

    navigate("FeaturedPromotionDetail", {
      details: item,
    });
  }

  onVariantPressed = (
    selected_product,
    selected_variants,
    key,
    selected_value,
    required
  ) => {
    let selected_item = selected_value;
    if (!required && selected_variants[key] === selected_value) {
      selected_item = null;
    }
    selected_variants[key] = selected_item;
    let filtered = selected_variants.filter(function (el) {
      return el;
    });
    let total = filtered.reduce((a, b) => +a + +b.price, 0);
    selected_product.calculated_price = (
      parseFloat(selected_product.price) + parseFloat(total)
    ).toFixed(2);
    this.setState({
      products: this.state.products,
    });
  };

  dismissProduct() {
    this.setState({ modalVisible: false });
  }

  renderFeaturedPromo(shop, cart) {
    if (shop !== null && shop.featured_promotion != null) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.onFeaturedPromotionPressed(shop.featured_promotion)
          }
          style={
            shop.is_opened
              ? styles.featuredpromoButton1
                ? cart.length > 0
                : styles.featuredpromoButton3
              : styles.featuredpromoButton2
          }
        >
          <Image
            source={{ uri: shop.featured_promotion.icon.url }}
            style={styles.featuredpromoButtonImage}
          />
        </TouchableOpacity>
      );
    }

    return undefined;
  }
  renderModalContent = (selected_product) => {
    let select_quantity = this.state.select_quantity;

    let filtered = selected_product.selected_variants.filter(function (el) {
      return el;
    });
    let variant_array = filtered.map((a) => a.value);

    const { selectedShop } = this.props;

    var enabled = selected_product.enabled;

    if (selectedShop != null) {
      if (selectedShop.can_order == false) {
        enabled = false;
      }
    }

    const ingredients = selected_product.ingredients.map((item, key) => {
      return (
        <View style={styles.ingredientView} key={key}>
          <Text style={styles.ingredientText}>{item.name}</Text>
        </View>
      );
    });

    const variants = selected_product.variants.map((item, key) => {
      let selected_variants = selected_product.selected_variants;
      let required_variant = item.required;

      return (
        <View style={styles.optionsTwoView} key={key}>
          <Text style={styles.optiontitleTwoText}>{item.display_name}</Text>
          <View style={styles.optionchoiceView}>
            {item.variant_values.map((value, value_key) => {
              var selected = selected_variants.includes(value);

              return (
                <TouchableOpacity
                  key={value_key}
                  onPress={() =>
                    this.onVariantPressed(
                      selected_product,
                      selected_variants,
                      key,
                      value,
                      required_variant
                    )
                  }
                  style={
                    selected ? styles.selectedButton : styles.unselectedButton
                  }
                >
                  {value.recommended && (
                    <Image
                      source={require("./../../assets/images/star.png")}
                      style={styles.recommendedStarImage}
                    />
                  )}
                  <Text
                    style={
                      selected
                        ? styles.selectedButtonText
                        : styles.unselectedButtonText
                    }
                  >
                    {value.value} {value.price > 0 && `$${value.price}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    });

    return (
      <View style={styles.popOutView}>
        <View style={styles.topbuttonView}>
          {/* <TouchableOpacity
						onPress={this.onFavouritePressed}
						style={styles.favouriteButton}>
						<Image
							source={require("./../../assets/images/group-9-11.png")}
							style={styles.favouriteButtonImage}/>
					</TouchableOpacity> */}
          <TouchableOpacity
            onPress={this.onClosePressed}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageblockView}>
          <Image
            source={{ uri: selected_product.image.url }}
            style={styles.productimageImage}
          />
        </View>
        <View pointerEvents="box-none">
          <ScrollView style={styles.contentScrollView}>
            <View style={styles.productView}>
              <Text style={styles.nameText}>{selected_product.name}</Text>
              <View
                style={{
                  flex: 1,
                }}
              />
              {selected_product.ingredients && (
                <View
                  pointerEvents="box-none"
                  style={{
                    alignSelf: "flex-start",
                    flex: 1,
                    marginLeft: 1 * alpha,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {ingredients}
                </View>
              )}
              {selected_product.description != null &&
                selected_product.description != "" && (
                  <Text style={styles.descriptionHeaderText}>
                    Product Description
                  </Text>
                )}
              {selected_product.description != null &&
                selected_product.description != "" && (
                  <Text style={styles.descriptionText}>
                    {selected_product.description}
                  </Text>
                )}
            </View>
            {variants}
          </ScrollView>
          <View style={styles.bottomView}>
            <View style={styles.lineView} />
            <View style={styles.summaryView}>
              <View
                pointerEvents="box-none"
                style={{
                  height: 32 * alpha,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.priceText}>
                  ${parseFloat(selected_product.calculated_price).toFixed(2)}
                </Text>
                <View
                  style={{
                    flex: 1,
                  }}
                />
                <View style={styles.controlView}>
                  <View
                    pointerEvents="box-none"
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                      top: 0 * alpha,
                      bottom: 0 * alpha,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.quantityText}>{select_quantity}</Text>
                  </View>
                  <View
                    pointerEvents="box-none"
                    style={{
                      position: "absolute",
                      left: 0 * alpha,
                      right: 0 * alpha,
                      top: 0 * alpha,
                      height: 23 * alpha,
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (select_quantity > 1)
                          this.setState({
                            select_quantity: (select_quantity -= 1),
                          });
                      }}
                      style={styles.removeButton}
                    >
                      <Image
                        source={require("./../../assets/images/button-4.png")}
                        style={styles.removeButtonImage}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          select_quantity: (select_quantity += 1),
                        });
                      }}
                      style={styles.addButton}
                    >
                      <Image
                        source={require("./../../assets/images/add-18.png")}
                        style={styles.addButtonImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              />
              <Text style={styles.optionsText}>{variant_array.join(", ")}</Text>
            </View>
            <TouchableOpacity
              disabled={!enabled}
              onPress={() => this.onAddToCartPressed(selected_product)}
              style={
                enabled
                  ? [styles.addToCartButton, styles.normal]
                  : [styles.addToCartButton, styles.disabled]
              }
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let { shop, cart, delivery, data } = this.state;
    return (
      <View style={styles.page1View}>
        <StatusBar
          hidden={true}
          backgroundColor="blue"
          barStyle="light-content"
        />

        {this.state.loading ? (
          <AnimationLoading />
        ) : (
          <View
            style={styles.productsectionView}
            onLayout={(event) => this.measureView(event)}
          >
            <View style={styles.categorylistBannerViewWrapper}>
              <FlatList
                renderItem={this.renderProductlistFlatListCell}
                data={this.state.menu_banners}
                horizontal={true}
                style={styles.productlistFlatList}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.categorylistFlatListViewWrapper}>
                <FlatList
                  horizontal={false}
                  renderItem={this.renderCategorylistFlatListCell}
                  data={this.state.data}
                  style={styles.categorylistFlatList}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <View style={styles.productlistFlatListViewWrapper}>
                {this.state.loading ? undefined : (
                  <FlatList
                    numColumns={2}
                    renderItem={this.renderProductlistFlatListCell}
                    data={this.state.products}
                    ref={(ref) => {
                      this.flatListRef = ref;
                    }}
                    style={styles.productlistFlatList}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        {this.state.isToggleLocation && (
          <View style={styles.showLocationView}>
            <View style={styles.branchInfoView}>
              <Text style={styles.branchInfoText}>Branch Info</Text>
              <Text style={styles.branchAddress}>
                Address: {shop ? shop.address : ""}
              </Text>
              <Text style={styles.branchContact}>
                Contact: {shop ? shop.phone_no : ""}
              </Text>
              <View
                style={{
                  flex: 1,
                }}
              />
              <Text style={styles.businessHour1000Text}>
                Business Hour: {shop ? shop.opening_hour.start_time : ""} ~{" "}
                {shop ? shop.opening_hour.end_time : ""}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomAlertView}>
          {/* remove alert bar at the bottom side */}
          {/* {this.renderAlertBar(shop)} */}
          {this.renderBottomBar(cart, shop)}
        </View>
      </View>
    );
  }

  renderAlertBar(shop) {
    if (shop !== null) {
      if (shop.is_opened === false) {
        return (
          <View style={styles.alertView}>
            <Text style={styles.alertViewText}>{shop.alert_message}</Text>
          </View>
        );
      }

      if (shop.shop_busy_template_message != null) {
        const title = shop.shop_busy_template_message.title;
        const template = shop.shop_busy_template_message.template;

        return (
          <View style={styles.alertView}>
            {/* {title != null && title.length > 0 ?  <Text style={styles.alertViewTitle}>{title}</Text> : undefined} */}
            <Text style={styles.alertViewText}>{template}</Text>
          </View>
        );
      }
    }

    return undefined;
  }

  renderBottomBar(cart, shop) {
    if (cart.length > 0) {
      return (
        <View style={styles.cartView}>
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              left: 0 * alpha,
              top: 0 * alpha,
              bottom: 0 * alpha,
              justifyContent: "center",
            }}
          >
            <View style={styles.totalAmountView}>
              <View style={styles.rectangleView} />
              <View
                pointerEvents="box-none"
                style={{
                  position: "absolute",
                  left: 38 * alpha,
                  right: 13 * alpha,
                  top: 5 * alpha,
                  height: 45 * alpha,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <View style={styles.shopppingCartView}>
                  <TouchableOpacity
                    onPress={() => this.toogleCart(false)}
                    style={styles.shopppingCartButton}
                  >
                    <View style={styles.group5View}>
                      <View
                        pointerEvents="box-none"
                        style={{
                          width: 15 * alpha,
                          marginTop: 1 * alpha,
                          marginBottom: 4 * alpha,
                        }}
                      >
                        <View
                          pointerEvents="box-none"
                          style={{
                            position: "absolute",
                            left: 0 * alpha,
                            top: 0 * alpha,
                            bottom: 0 * alpha,
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={require("./../../assets/images/fill-1.png")}
                            style={styles.fill1Image}
                          />
                        </View>
                        <View
                          pointerEvents="box-none"
                          style={{
                            position: "absolute",
                            left: 3 * alpha,
                            width: 9 * alpha,
                            top: 0 * alpha,
                            bottom: 2 * alpha,
                            alignItems: "flex-start",
                          }}
                        >
                          <Image
                            source={require("./../../assets/images/group-4-2.png")}
                            style={styles.group4Image}
                          />
                          <View
                            style={{
                              flex: 1,
                            }}
                          />
                          <View style={styles.line8View} />
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 1,
                        }}
                      />
                      <Text style={styles.shoppingCartText}>Cart</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}
                />
                <Text style={styles.totalpriceText}>
                  ${this.state.cart_total}
                </Text>
              </View>
              <View style={styles.badgeView}>
                <Text style={styles.numberofitemText}>
                  {this.state.cart_total_quantity}
                </Text>
              </View>
            </View>
          </View>
          <TouchableHighlight
            onPress={this.onCheckoutPressed}
            style={styles.checkoutButton}
            underlayColor="cyan"
          >
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return undefined;
  }

  renderGallery() {
    const images = [
      {
        // Simplest usage.
        url: this.state.selected_promotion,
      },
    ];
    return (
      <Modal
        visible={this.state.isPromoToggle}
        style={{ margin: 0, flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        {/* <ImageViewer backgroundColor={""} imageUrls={images}/> */}
        <ScrollView style={{}}>
          <AutoHeightImage
            source={{ uri: this.state.selected_promotion }}
            width={windowWidth}
            style={styles.bannerImage}
          />
        </ScrollView>
        <TouchableOpacity
          onPress={this.onClosePressed}
          style={styles.closeGalleryButton}
        >
          <Text style={styles.closeGalleryButtonText}>X</Text>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  navigationBarItem: {},
  loadingIndicator: {
    marginTop: 100 * alpha,
  },
  navigationBarItemIcon: {
    tintColor: "rgb(0, 194, 236)",
  },
  headerLeftContainer: {
    flexDirection: "row",
    marginLeft: 8 * alpha,
  },
  page1View: {
    backgroundColor: "white",
    flex: 1,
  },
  topsectionView: {
    backgroundColor: "white",
    shadowColor: "rgba(198, 192, 192, 0.5)",
    shadowRadius: 5 * alpha,
    shadowOpacity: 1 * alpha,
    position: "absolute",
    left: 0 * alpha,
    right: 0 * alpha,
    height: 0 * alpha,
    // height: 50 * alpha,
  },
  branchView: {
    backgroundColor: "transparent",
    width: 200 * alpha,
    height: 19 * alpha,
    marginTop: 6 * alpha,
    flexDirection: "row",
    alignItems: "center",
  },
  branchButtonImage: {
    resizeMode: "contain",
    marginLeft: 10 * alpha,
  },
  branchButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 73 * alpha,
    height: 19 * alpha,
    marginTop: 6 * alpha,
  },
  branchButtonText: {
    color: "rgb(99, 97, 97)",
    fontFamily: TITLE_FONT,
    fontSize: 16 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  groupImage: {
    resizeMode: "center",
    backgroundColor: "transparent",
    flex: 1,
    height: 10 * alpha,
    marginLeft: 6 * alpha,
  },
  pickUpDeliveryView: {
    borderRadius: 16 * alpha,
    width: 96 * alpha,
    height: 32 * alpha,
  },
  rectangleImage: {
    resizeMode: "center",
    backgroundColor: "transparent",
    opacity: 0.34,
    width: null,
    height: 31 * alpha,
  },
  pickUpView: {
    backgroundColor: "rgba(42, 41, 41, 0.89)",
    borderRadius: 14.5 * alpha,
    width: 49 * alpha,
    height: 29 * alpha,
    justifyContent: "center",
  },
  optionText: {
    fontFamily: TITLE_FONT,
    fontSize: 10 * fontAlpha,
  },
  pickUpText: {
    color: "rgb(253, 253, 253)",
    fontFamily: TITLE_FONT,
    fontSize: 10 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
    marginLeft: 7 * alpha,
    marginRight: 7 * alpha,
  },
  deliveryText: {
    color: "rgb(78, 77, 77)",
    fontFamily: TITLE_FONT,
    fontSize: 10 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
  },
  distance1kmText: {
    backgroundColor: "transparent",
    color: "rgb(188, 181, 181)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  moreView: {
    backgroundColor: "transparent",
    width: 40 * alpha,
    height: 12 * alpha,
    marginTop: 1 * alpha,
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    flex: 1,
    height: 12 * alpha,
    marginRight: 2 * alpha,
  },
  moreButtonText: {
    color: "rgb(162, 162, 162)",
    fontFamily: TITLE_FONT,
    fontSize: 10 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  moreButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  downArrowImage: {
    resizeMode: "center",
    backgroundColor: "transparent",
    width: 8 * alpha,
    height: 4 * alpha,
  },
  productsectionView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  categorylistFlatList: {
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  productViewWrapper: {
    flex: 1,
  },
  categorylistBannerViewWrapper: {
    width: windowWidth,
    backgroundColor: "rgba(255, 255, 255, 1)",
    height: 115 * alpha,
    // marginBottom:10*alpha,
    backgroundColor: "white",
  },
  categorylistFlatListViewWrapper: {
    width: 80 * alpha,
    borderColor: "gray",
    borderRightWidth: 0.5,

    height: windowHeight - 120 * alpha,
  },
  productlistFlatList: {
    backgroundColor: "white",
    width: "100%",
    height: windowHeight - 110 * alpha,
  },
  productlistFlatListViewWrapper: {
    flex: 1,
    marginBottom: 1 * alpha,
  },
  cartView: {
    backgroundColor: "transparent",
    // position: "absolute",
    // left: 0 * alpha,
    // right: 0 * alpha,
    // bottom: 0 * alpha,
    height: 50 * alpha,
  },
  bannerImage: {
    height: windowHeight * alpha,
  },
  totalAmountView: {
    backgroundColor: "rgba(0,0,0,0)",
    width: 280 * alpha,
    height: 61 * alpha,
  },
  rectangleView: {
    backgroundColor: "rgb(231, 230, 230)",
    position: "absolute",
    left: 0 * alpha,
    right: 0 * alpha,
    top: 10 * alpha,
    height: 51 * alpha,
  },
  shopppingCartView: {
    backgroundColor: "white",
    borderRadius: 22.5 * alpha,
    width: 102 * alpha,
    height: 45 * alpha,
    justifyContent: "center",
  },
  shopppingCartButton: {
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 22.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    width: 102 * alpha,
    height: 45 * alpha,
  },
  group5View: {
    backgroundColor: "transparent",
    height: 26 * alpha,
    marginLeft: 15 * alpha,
    marginRight: 12 * alpha,
    flexDirection: "row",
  },
  fill1Image: {
    resizeMode: "center",
    backgroundColor: "transparent",
    width: 15 * alpha,
    height: 16 * alpha,
  },
  group4Image: {
    resizeMode: "center",
    backgroundColor: "transparent",
    width: 8 * alpha,
    height: 8 * alpha,
  },
  line8View: {
    backgroundColor: "rgb(85, 85, 85)",
    width: 9 * alpha,
    height: 1 * alpha,
  },
  shoppingCartText: {
    color: "rgb(57, 57, 57)",
    fontFamily: "SFProText-Medium",
    fontSize: 12 * alpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10 * alpha,
    backgroundColor: "rgba(255, 255, 255, 1)",
    alignSelf: "center",
  },
  totalpriceText: {
    color: "rgb(57, 57, 57)",
    fontFamily: "SFProText-Medium",
    fontSize: 18 * alpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "left",
    backgroundColor: "rgb(231, 230, 230)",
    marginTop: 20 * alpha,
  },
  badgeView: {
    backgroundColor: "rgb(0, 178, 227)",
    borderRadius: 10 * alpha,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    position: "absolute",
    left: 123 * alpha,
    right: 137 * alpha,
    top: 0 * alpha,
    height: 20 * alpha,
    justifyContent: "center",
  },
  numberofitemText: {
    color: "rgb(255, 251, 251)",
    fontFamily: "SFProText-Medium",
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgb(0, 178, 227)",
    marginLeft: 6 * alpha,
    marginRight: 6 * alpha,
  },
  checkoutButton: {
    backgroundColor: "rgb(0, 178, 227)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    right: 0 * alpha,
    width: 95 * alpha,
    top: 5 * alpha,
    height: 51 * alpha,
  },
  checkoutButtonText: {
    color: "white",
    fontFamily: "SFProText-Medium",
    fontSize: 14 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "left",
  },
  checkoutButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  cartsummaryviewView: {
    backgroundColor: "white",
    position: "absolute",
    left: 0 * alpha,
    right: 0 * alpha,
    bottom: 51 * alpha,
    flex: 1,
  },
  clearAllView: {
    backgroundColor: "rgb(245, 245, 245)",
    height: 31 * alpha,
    marginLeft: 1 * alpha,
    marginRight: 1 * alpha,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  clearButtonText: {
    color: "rgb(144, 141, 141)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  clearButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 55 * alpha,
    height: 18 * alpha,
    marginLeft: 15 * alpha,
  },
  clearButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  popOutCartFlatList: {
    backgroundColor: "white",
    width: "100%",
    flex: 1,
  },
  popOutCartFlatListViewWrapper: {
    flex: 1,
  },
  popOutView: {
    backgroundColor: "white",
    borderRadius: 11 * alpha,
    position: "absolute",
    width: "100%",
    flex: 1,
  },
  topbuttonView: {
    backgroundColor: "transparent",
    position: "absolute",
    width: 67 * alpha,
    height: 28 * alpha,
    top: 14 * alpha,
    right: 14 * alpha,
    alignItems: "flex-end",
    zIndex: 999,
  },
  favouriteButtonImage: {
    resizeMode: "contain",
  },
  favouriteButtonText: {
    color: "black",
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  favouriteButton: {
    backgroundColor: "rgb(193, 191, 191)",
    borderRadius: 14 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 28 * alpha,
    height: 28 * alpha,
    marginRight: 11 * alpha,
  },
  closeButton: {
    backgroundColor: "rgb(193, 191, 191)",
    borderRadius: 12.5 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 25 * alpha,
    height: 25 * alpha,
  },
  closeButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  closeButtonText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 18 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },

  closeGalleryButton: {
    backgroundColor: "black",
    borderRadius: 12.5 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    width: 25 * alpha,
    height: 25 * alpha,
    top: 15 * alpha,
    right: 23 * alpha,
  },
  closeGalleryButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  closeGalleryButtonText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 18 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  contentScrollView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
    marginTop: 5 * alpha,
    maxHeight: 250 * alpha,
  },
  productView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "100%",
    flex: 1,
    marginLeft: 19 * alpha,
    marginTop: 25 * alpha,
  },
  nameText: {
    color: "rgb(54, 54, 54)",
    fontFamily: TITLE_FONT,
    fontSize: 16 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginRight: 28 * alpha,
  },
  descriptionHeaderText: {
    color: "rgb(167, 167, 167)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginRight: 28 * alpha,
    marginTop: 10 * alpha,
  },
  descriptionText: {
    color: "rgb(167, 167, 167)",
    fontFamily: TITLE_FONT,
    fontSize: 10 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginRight: 28 * alpha,
    marginTop: 5 * alpha,
    marginBottom: 5 * alpha,
  },
  ingredientView: {
    backgroundColor: "rgb(245, 245, 245)",
    height: 14 * alpha,
    justifyContent: "center",
    marginRight: 5 * alpha,
    marginTop: 3 * alpha,
  },
  ingredientText: {
    backgroundColor: "rgb(245, 245, 245)",
    color: "rgb(167, 167, 167)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    marginLeft: 5 * alpha,
    marginRight: 4 * alpha,
  },
  ingredientTwoView: {
    backgroundColor: "rgb(245, 245, 245)",
    width: 27 * alpha,
    height: 14 * alpha,
    marginLeft: 10 * alpha,
    justifyContent: "center",
  },
  milkText: {
    color: "rgb(167, 167, 167)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
    marginLeft: 6 * alpha,
    marginRight: 5 * alpha,
  },
  optionsTwoView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginTop: 5 * alpha,
    alignItems: "flex-start",
    borderRadius: 7.0,
    overflow: "hidden",
  },
  optiontitleTwoText: {
    color: "rgb(141, 141, 141)",
    fontFamily: TITLE_FONT,
    fontSize: 11 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginLeft: 20 * alpha,
  },
  optionchoiceView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flexWrap: "wrap",
    marginLeft: 20 * alpha,
    marginRight: 20 * alpha,
    marginTop: 7 * alpha,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  unselectedButton: {
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 2 * alpha,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: 28 * alpha,
    marginRight: 9 * alpha,
    marginBottom: 4 * alpha,
    marginTop: 1 * alpha,
  },
  recommendedStarImage: {
    resizeMode: "contain",
    marginLeft: 7 * alpha,
  },
  unselectedButtonText: {
    color: "rgb(82, 80, 80)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginRight: 7 * alpha,
    marginLeft: 7 * alpha,
  },
  selectedButton: {
    backgroundColor: "rgb(0, 178, 227)",
    borderRadius: 2 * alpha,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: 28 * alpha,
    marginRight: 9 * alpha,
    marginBottom: 4 * alpha,
    marginTop: 1 * alpha,
  },
  selectedButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  selectedButtonText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
    marginRight: 7 * alpha,
    marginLeft: 7 * alpha,
  },
  optionsView: {
    backgroundColor: "transparent",
    width: 270 * alpha,
    height: 87 * alpha,
    marginLeft: 20 * alpha,
    marginTop: 10 * alpha,
    alignItems: "flex-start",
  },
  optiontitleText: {
    color: "rgb(141, 141, 141)",
    fontFamily: TITLE_FONT,
    fontSize: 11 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    backgroundColor: "transparent",
  },
  recommendedButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  recommendedButton: {
    backgroundColor: "rgb(0, 178, 227)",
    borderRadius: 2 * alpha,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 85 * alpha,
    height: 28 * alpha,
  },
  recommendedButtonText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  unavailableButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  unavailableButtonText: {
    color: "rgb(201, 201, 201)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  unavailableButton: {
    backgroundColor: "rgba(238, 238, 238, 0.62)",
    borderRadius: 2 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 67 * alpha,
    height: 28 * alpha,
    marginLeft: 12 * alpha,
  },
  choiceThreeButton: {
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 2 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 94 * alpha,
    height: 28 * alpha,
  },
  choiceThreeButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  choiceThreeButtonText: {
    color: "rgb(82, 80, 80)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  choiceTwoButton: {
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 2 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    marginRight: 10 * alpha,
    marginLeft: 10 * alpha,
    height: 27 * alpha,
  },
  choiceTwoButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  choiceTwoButtonText: {
    color: "rgb(82, 80, 80)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  choiceButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  choiceButton: {
    backgroundColor: "rgb(238, 238, 238)",
    borderRadius: 2 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 66 * alpha,
    height: 27 * alpha,
    marginLeft: 13 * alpha,
  },
  choiceButtonText: {
    color: "rgb(82, 80, 80)",
    fontFamily: TITLE_FONT,
    fontSize: 9 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center",
  },
  bottomView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    height: 113 * alpha,
    justifyContent: "flex-end",
  },
  lineView: {
    backgroundColor: "rgb(151, 151, 151)",
    opacity: 0.29,
    height: 1 * alpha,
    marginBottom: 12 * alpha,
  },
  summaryView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    height: 37 * alpha,
    marginLeft: 20 * alpha,
    marginRight: 20 * alpha,
    marginBottom: 12 * alpha,
  },
  priceText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(0, 178, 227)",
    fontFamily: TITLE_FONT,
    fontSize: 18 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  controlView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: 74 * alpha,
    height: 23 * alpha,
  },
  quantityText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(85, 83, 81)",
    fontFamily: TITLE_FONT,
    fontSize: 16 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  removeButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width: 23 * alpha,
    height: 23 * alpha,
  },
  removeButtonImage: {
    resizeMode: "contain",
  },
  removeButtonText: {
    color: "black",
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  addButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    alignSelf: "center",
    width: 23 * alpha,
    height: 23 * alpha,
  },
  addButtonText: {
    color: "black",
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  addButtonImage: {
    resizeMode: "contain",
  },
  optionsText: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "rgb(141, 141, 141)",
    fontFamily: "Helvetica-LightOblique",
    fontSize: 8 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 1 * alpha,
  },
  normal: {
    backgroundColor: "rgb(0, 178, 227)",
  },
  disabled: {
    backgroundColor: "rgba(0, 178, 227, 0.3)",
  },
  addToCartButton: {
    borderRadius: 4 * alpha,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: 36 * alpha,
    marginLeft: 20 * alpha,
    marginRight: 20 * alpha,
    marginBottom: 15 * alpha,
  },
  addToCartButtonImage: {
    resizeMode: "contain",
    marginRight: 10 * alpha,
  },
  addToCartButtonText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 16 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  productimageImage: {
    resizeMode: "cover",
    backgroundColor: "transparent",
    alignSelf: "center",
    width: 150 * alpha,
    height: 150 * alpha,
  },
  imageblockView: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 21 * alpha,
    height: 150 * alpha,
    alignItems: "center",
  },
  bottomAlertView: {
    backgroundColor: "darkgray",
    position: "absolute",
    left: 0 * alpha,
    right: 0 * alpha,
    bottom: 0 * alpha,
    width: windowWidth,
  },
  alertView: {
    backgroundColor: "darkgray",
  },
  alertViewTitle: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 14 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    paddingTop: 10 * alpha,
    paddingBottom: 5 * alpha,
    alignSelf: "center",
  },
  alertViewText: {
    color: "white",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    paddingTop: 7 * alpha,
    paddingLeft: 7 * alpha,
    paddingRight: 7 * alpha,
    paddingBottom: 7 * alpha,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10 * alpha,
  },
  showLocationView: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 67 * alpha,
    alignItems: "flex-start",
  },
  deliveryView: {
    backgroundColor: "transparent",
    width: 322 * alpha,
    height: 105 * alpha,
    marginLeft: 14 * alpha,
    marginTop: 7 * alpha,
  },
  deliveryTwoText: {
    backgroundColor: "transparent",
    color: "rgb(55, 55, 55)",
    fontFamily: TITLE_FONT,
    fontSize: 16 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  freeWithRm40SpendText: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    marginTop: 9 * alpha,
  },
  deliveredByBrew9Text: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    marginTop: 19 * alpha,
  },
  deliverAreaAffectText: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    alignSelf: "stretch",
  },
  deliveryRm5ExtraText: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  branchInfoView: {
    backgroundColor: "transparent",
    width: windowWidth - 100 * alpha,
    height: 76 * alpha,
    marginLeft: 10 * alpha,
    marginTop: 25 * alpha,
    alignItems: "flex-start",
  },
  branchInfoText: {
    backgroundColor: "transparent",
    color: "rgb(55, 55, 55)",
    fontFamily: TITLE_FONT,
    fontSize: 16 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  branchAddress: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    lineHeight: 16 * alpha,
    marginTop: 9 * alpha,
  },
  branchContact: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    marginTop: 3 * alpha,
  },
  businessHour1000Text: {
    backgroundColor: "transparent",
    color: "rgb(160, 160, 160)",
    fontFamily: TITLE_FONT,
    fontSize: 12 * fontAlpha,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    alignSelf: "stretch",
  },
  featuredpromoButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    width: 100 * alpha,
    height: 50 * alpha,
    bottom: 10 * alpha,
    left: 10 * alpha,
  },
  featuredpromoButton2: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    width: 100 * alpha,
    height: 50 * alpha,
    bottom: 40 * alpha,
    left: 10 * alpha,
  },
  featuredpromoButton3: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    width: 100 * alpha,
    height: 50 * alpha,
    bottom: 60 * alpha,
    left: 10 * alpha,
  },
  featuredpromoButtonImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});

export default Home;
