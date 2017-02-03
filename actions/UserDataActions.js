const Constants = require('../constants/Constants');
const AppDispatcher = require('../dispatcher/AppDispatcher');

var UserDataAction = {
    signUP     : function (profile) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.USER_SIGN_UP,
            profile   : profile
        })
    },
    logIn      : function (profile) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.USER_LOG_IN,
            profile   : profile
        })
    },
    saveFavList: function (newList) {
        AppDispatcher.dispatch({
            actionType: Constants.actions.USER_SAVE_FAV_LIST,
            list: newList
        })
    },
    logOut: function() {
        AppDispatcher.dispatch({
            actionType: Constants.actions.USER_LOG_OUT
        })
    }
};

module.exports = UserDataAction;