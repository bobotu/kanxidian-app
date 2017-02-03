var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
const Configs = require('../configs');
const Constants = require('../constants/Constants');
var Immutable = require('immutable');

var emptyAccountData = Immutable.Map({
    accountImg    : null,
    accountSummary: null,
    dataBlob      : Immutable.Map(),
    sectionIDs    : Immutable.List(),
    rowIDs        : Immutable.List(),
    page          : 2,
});

var dataBlob = Immutable.Map();

var AccountPageStore = Object.assign({}, EventEmitter.prototype, {
    init                : function () {
        //暂时不需要做任何事
    },
    emitChange          : function () {
        this.emit(Constants.configs.CHANGE_EVENT);
    },
    addChangeListener   : function (callback) {
        this.on(Constants.configs.CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(Constants.configs.CHANGE_EVENT, callback);
    },
    getAccountPageItems : function () {
        return dataBlob;
    },
    dispatcherToken     : AppDispatcher.register(function (payload) {
        switch (payload.actionType) {
            case Constants.actions.ACC_PAGE_REFRESH:
                refresh(payload.id);
                break;
            case Constants.actions.ACC_PAGE_INIT:
                refresh(payload.id);
                break;
            case Constants.actions.ACC_PAGE_LOAD:
                loadMore(payload.id);
                break;
            case Constants.actions.ACC_PAGE_DEL:
                dataBlob = dataBlob.delete(payload.id);
                break;
        }
    })
});

function refresh(id) {
    dataBlob = dataBlob.set(id, emptyAccountData);
    fetch(Configs.accountPageURL(id.split('&')[0], 1))
        .then(res => res.json())
        .then(data => {
            dataBlob = dataBlob.withMutations(blob => {
                blob
                    .setIn([id, 'accountImg'], data.accountimg)
                    .setIn([id, 'accountSummary'], data.accountsummary);
                data.items.forEach(row => {
                    dataHandler(row, blob, id)
                })
            });
            AccountPageStore.emitChange();
        })
}

function loadMore(id) {
    fetch(Configs.accountPageURL(id.split('&')[0], dataBlob.getIn([id, 'page'])))
        .then(res => res.json())
        .then(data => {
            dataBlob = dataBlob.withMutations(blob => {
                blob.updateIn([id, 'page'], p => ++p);
                data.items.forEach(row => {
                    dataHandler(row, blob, id)
                })
            });
            AccountPageStore.emitChange();
        })
}

function dataHandler(row, blob, id) {
    if (!blob.getIn([id, 'sectionIDs']).includes(row.date)) {
        blob.updateIn([id, 'sectionIDs'], list => list.push(row.date));
        let index = blob.getIn([id, 'sectionIDs']).indexOf(row.date);
        blob.setIn([id, 'rowIDs', index], Immutable.List([row.docid]));
        blob.setIn([id, 'dataBlob', row.date, row.docid], Immutable.fromJS(row));
    }
    else {
        let index = blob.getIn([id, 'sectionIDs']).indexOf(row.date);
        if (!blob.getIn([id, 'rowIDs', index]).includes(row.docid)) {
            blob.updateIn([id, 'rowIDs', index], list => list.push(row.docid));
            blob.setIn([id, 'dataBlob', row.date, row.docid], Immutable.fromJS(row));
        }
    }
}

module.exports = AccountPageStore;