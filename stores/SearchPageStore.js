var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
const Configs = require('../configs');
const Constants = require('../constants/Constants');
var Immutable = require('immutable');

var SearchData = Immutable.Map({
    dataBlob: Immutable.List(),
    idEnded : false
});

var keywords = null;
var sid = null;
var highlightReg = /<em>([^<]*)<\/em>/g;
var SearchPageStore = Object.assign({}, EventEmitter.prototype, {

    init              : function () {
    },
    getSearchPageItems: function () {
        return SearchData;
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
            case Constants.actions.SEARCH:
                keywords = payload.keywords;
                search(payload.keywords);
                break;
            case Constants.actions.SEARCH_LOAD_MORE:
                loadMore(keywords, sid);
                break;
            case Constants.actions.SEARCH_CLOSE:
                keywords = null;
                SearchData = SearchData.withMutations(data => {
                    data.set('dataBlob', Immutable.List());
                    data.set('isEnded', false);
                });
                SearchPageStore.emitChange();
                break;
        }
    })
});


function search(keywords) {
    fetch(Configs.searchURL(keywords), {
        method : 'GET',
        headers: {
            'X-LC-Id' : Configs.appID,
            'X-LC-Key': Configs.appKEY
        }
    })
        .then(res => res.json())
        .then((data) => {
            SearchData = SearchData.withMutations(searchData => {
                searchData.set('dataBlob', Immutable.List()).set('isEnded', false);
            });
            handleData(data);
        })
}

function loadMore(keywords, sid) {
    fetch(Configs.searchURL(keywords, sid), {
        method : 'GET',
        headers: {
            'X-LC-Id' : Configs.appID,
            'X-LC-Key': Configs.appKEY
        }
    })
        .then(res => res.json())
        .then((data) => {
            handleData(data)
        })
}

function handleData (data) {
    sid = data.sid;
    SearchData = SearchData.withMutations(searchData => {
        data.results.forEach(el => {
            let card = Immutable.Map();
            card = card.withMutations(card => {
                var summary = el['_highlight']['nature_context'].map(line => line.replace(highlightReg, '$1'));
                card.set('accountname', el.account)
                    .set('accountimg', el.accountimg)
                    .set('title', el.title)
                    .set('url', el.url)
                    .set('date', el.date)
                    .set('summary', summary.join('...'));
            });
            searchData.update('dataBlob', list => list.push(card));
        });
        if (data.results.length < 6) searchData.set('isEnded', true);
    });
    SearchPageStore.emitChange();
}


module.exports = SearchPageStore;