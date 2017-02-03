const Constants = require('../constants/Constants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var SearchPageActions = {
    search: function(keywords) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.SEARCH,
            keywords  : keywords
        })
    },
    loadMore: function() {
        AppDispatcher.dispatch({
            actionType: Constants.actions.SEARCH_LOAD_MORE,
        })
    },
    close: function() {
        AppDispatcher.dispatch({
            actionType: Constants.actions.SEARCH_CLOSE
        })
    }
};

module.exports = SearchPageActions;
