var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
const Configs = require('../configs');
const Constants = require('../constants/Constants');
var Immutable = require('immutable');

var HomePageData = Immutable.Map({
    dataBlob: Immutable.List(),
});

var page = 1;

var HomePageStore = Object.assign({}, EventEmitter.prototype, {
    init            : function () {
        refresh();
    },
    getHomePageItems: function () {
        return HomePageData;
    },

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
            case Constants.actions.HOME_PAGE_REFRESH:
                refresh();
                break;
            case Constants.actions.HOME_PAGE_LOAD:
                loadIndexedByPage();
                break;
        }
    }),
});


function loadIndexedByPage() {
    fetch(Configs.homePageURL(page))
        .then((res) => res.json())
        .then((newData) => {
            ++page;
            HomePageData = HomePageData.withMutations(homePageData => {
                var rows = Immutable.fromJS(newData.items);
                rows.forEach(row => {
                    if (!homePageData.get('dataBlob').includes(row)) {
                        homePageData.update('dataBlob', list => list.push(row));
                    }
                })
            });
            HomePageStore.emitChange();
        })
        .catch(err => {
            console.warn(err);
        })
}

function refresh() {
    fetch(Configs.homePageURL(1))
        .then(res => res.json())
        .then(newData => {
            page = 2;
            HomePageData = HomePageData.withMutations(homePageData => {
                homePageData.set('dataBlob', Immutable.List());
                var rows = Immutable.fromJS(newData.items);
                rows.forEach(row => {
                    if (!homePageData.get('dataBlob').includes(row)) {
                        homePageData.update('dataBlob', list => list.push(row));
                    }
                })
            });
            HomePageStore.emitChange();
        })
        .catch(err => {
            console.warn(err);
        })
}


module.exports = HomePageStore;