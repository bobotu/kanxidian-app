const Constants = require('../constants/Constants');
const AppDispatcher = require('../dispatcher/AppDispatcher');

var HomePageActions = {
    load: function() {
        AppDispatcher.dispatch({
            actionType: Constants.actions.HOME_PAGE_LOAD
        })
    },
    refresh: function() {
        AppDispatcher.dispatch({
            actionType: Constants.actions.HOME_PAGE_REFRESH
        })
    }
};

module.exports = HomePageActions;