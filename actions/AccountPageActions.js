const Constants = require('../constants/Constants');
var AppDispatcher = require('../dispatcher/AppDispatcher');


var AccountPageActions = {
    refresh : function (id) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.ACC_PAGE_REFRESH,
            id      : id
        })
    },
    init    : function (id) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.ACC_PAGE_INIT,
            id      : id,
        })
    },
    loadMore: function (id) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.ACC_PAGE_LOAD,
            id      : id
        })
    },
    del     : function (id) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.ACC_PAGE_DEL,
            id      : id
        })
    }
};

module.exports = AccountPageActions;