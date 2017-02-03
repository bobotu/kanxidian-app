var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
const Configs = require('../configs');
const Constants = require('../constants/Constants');
var UserDataStore = require('./UserDataStore');
var Immutable = require('immutable');
var md5 = require('md5');

var FavPageData = Immutable.Map({
    dataBlob   : Immutable.List(),
    /**指示是否处于向服务器请求数据的状态, 因为FavPageData.dataBlob有可能因为没有关注而出现 length === 0 的情况,故以此判断是否在加载*/
    isLoading  : true,
    /**指示关注列表是否为空*/
    isEmpty    : false,
    /**显示是否需要登录*/
    isNeedLogIn: false
});

var token = null;
var page = 1;

var FavPageStore = Object.assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(Constants.configs.CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(Constants.configs.CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(Constants.configs.CHANGE_EVENT, callback);
    },
    dispatcherToken     : AppDispatcher.register(function (payload) {
        switch (payload.actionType) {
            case Constants.actions.FAV_PAGE_REFRESH:
                refresh(token);
                break;
            case Constants.actions.FAV_SECTION_LOAD:
                loadMore();
                break;
            case Constants.actions.TOKEN_NOT_FOUNDED:
                FavPageData = FavPageData.withMutations(favPageData => {
                    favPageData.set('isLoading', false).set('isNeedLogIn', true);
                });
                token = null;
                FavPageStore.emitChange();
                break;
            case Constants.actions.TOKEN_FOUNDED:
                token = payload.token;
                refresh(token);
                break;
        }
    }),
    getFavPageItems     : function () {
        return FavPageData;
    },
    init                : function () {
        //暂时不需要做任何事
        //AppDispatcher.dispatch({
        //    actionType: Constants.actions.FAV_PAGE_REFRESH
        //})
    }
});

function refresh(token) {
    var date = Date.now();
    var str = generateRandomStr();
    var sign = md5(date + str + 'kanxidian');
    fetch(Configs.favPageURL(page), {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify({
            date  : date,
            str   : str,
            sign  : sign,
            token : token
        })
    })
        .then(res => res.json())
        .then(data => {
            page = 2;
            FavPageData = Immutable.Map({
                dataBlob   : Immutable.List(),
                isLoading  : false,
                isEmpty    : false,
                isNeedLogIn: false,
            });
            if (data.items.length < 1) {
                FavPageData = FavPageData.set('isEmpty', true);
            } else {
                FavPageData = FavPageData.withMutations(favPageData => {
                    var rows = Immutable.fromJS(data.items);
                    rows.forEach(row => {
                        if (!favPageData.get('dataBlob').includes(row)) {
                            favPageData.update('dataBlob', list => list.push(row));
                        }
                    })
                });
            }
            FavPageStore.emitChange();
        })
        .catch((err) => {
            console.log(err);
        });
}

function loadMore() {
    var date = Date.now();
    var str = generateRandomStr();
    var sign = md5(date + str + 'kanxidian');
    fetch(Configs.favPageURL(page), {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify({
            date  : date,
            str   : str,
            sign  : sign,
            token : token
        })
    })
        .then(res => res.json())
        .then(data => {
            ++page;
            FavPageData = FavPageData.withMutations(favPageData => {
                var rows = Immutable.fromJS(data.items);
                rows.forEach(row => {
                    if (!favPageData.get('dataBlob').includes(row)) {
                        favPageData.update('dataBlob', list => list.push(row));
                    }
                })
            });
            FavPageStore.emitChange();
        })
        .catch(err => {
            console.log(err)
        })
}


function generateRandomStr() {
    var str = Math.random().toString(36).substr(2).slice(0, 6);
    while (str.length < 6) {
        str = Math.random().toString(36).substr(2).slice(0, 6);
    }
    return str;
}

module.exports = FavPageStore;