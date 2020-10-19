import {
  shops,
  shop_banner,
  makeOrder,
  missions,
  review,
  deliveryFee,
  shopTown,
  favoriteShop,
  unfavoriteShop,
} from '../Services/shops';
import EventObject from './event_object';
import {createAction} from '../Utils/index';
import _ from 'lodash';

export default {
  namespace: 'shops',

  state: {
    allShops: [],
    nearbyShops: [],
    favoriteShops: [],
    selectedShop: null,
    currentOrder: null,
    popUp: false,
    orders: [],
  },
  reducers: {
    setDefaultState(state, {payload}) {
      return {
        ...state,
      };
    },
    setAllShops(state, {payload}) {
      return {...state, allShops: payload};
    },
    setNearbyShops(state, {payload}) {
      return {...state, nearbyShops: payload};
    },
    setSelectedShop(state, {payload}) {
      return {...state, selectedShop: payload};
    },
    setFavoriteShops(state, {payload}) {
      return {...state, favoriteShops: payload};
    },
    setCurrentOrder(state, {payload}) {
      const {order} = payload;

      let data = [...state.orders];

      _.remove(data, function (currentObject) {
        return currentObject.id === order.id;
      });

      data.unshift(order);

      return {...state, currentOrder: order, orders: data};
    },
    setOrders(state, {payload}) {
      const {orders} = payload;
      return {...state, orders: orders};
    },
    setPopUp(state, {payload}) {
      const {popUp} = payload;
      return {...state, popUp};
    },
    clearNearbyShops(state) {
      return {...state, nearbyShops: []};
    },
  },
  effects: {
    *loadAllShops({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(shops, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
          yield put(createAction('setAllShops')(eventObject.result));
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadShops({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(shops, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
          yield put(createAction('setSelectedShop')(eventObject.result));
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *selectShop({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(shops, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
          yield put(createAction('setSelectedShop')(eventObject.result));
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *cacheSelectShop({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        yield put(createAction('setSelectedShop')(object));

        typeof callback === 'function' && callback(object);
      } catch (err) {}
    },
    *loadFavoriteShops({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(shops, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
          yield put(createAction('setFavoriteShops')(eventObject.result));
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadMakeFavoriteShop({payload}, {call, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(favoriteShop, authtoken, object);
        const eventObject = new EventObject(json);
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadUnfavoriteShop({payload}, {call, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(unfavoriteShop, authtoken, object);
        const eventObject = new EventObject(json);
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },

    *loadNearbyShops({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(shops, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
          yield put(createAction('setNearbyShops')(eventObject.result));
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadMakeOrder({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;

        const authtoken = yield select((state) => state.members.userAuthToken);

        const json = yield call(makeOrder, authtoken, object);

        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
          yield put(
            createAction('setCurrentOrder')({order: eventObject.result}),
          );
          if (eventObject.result.paid == true) {
            yield put(createAction('setPopUp')({popUp: true}));
          }
          yield put(
            createAction('members/updateUnclaimedMission')(
              eventObject.result.member.unclaimed_mission_count,
            ),
          );
          yield put(
            createAction('members/saveCurrentUser')(eventObject.result.member),
          );
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadShopBanners({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.userAuthToken);
        const json = yield call(shop_banner, authtoken, object);
        const eventObject = new EventObject(json);
        // if (eventObject.success == true) { }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadMissions({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(missions, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {}
    },
    *loadReview({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(review, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {
        console.log('err', err);
      }
    },
    *loadDeliveryFee({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(deliveryFee, authtoken, object);
        const eventObject = new EventObject(json);
        console.log('\n\nDeliveryFeeResponse');
        console.log(eventObject);
        if (eventObject.success == true) {
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {
        console.log('err', err);
      }
    },
    *loadShopTown({payload}, {call, put, select}) {
      try {
        const {object, callback} = payload;
        const authtoken = yield select((state) => state.members.userAuthToken);
        const json = yield call(shopTown, authtoken, object);
        const eventObject = new EventObject(json);
        if (eventObject.success == true) {
        }
        typeof callback === 'function' && callback(eventObject);
      } catch (err) {
        console.log('loadShopTown', err);
      }
    },
  },
};
