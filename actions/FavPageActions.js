const Constants = require('../constants/Constants');
const AppDispatcher = require('../dispatcher/AppDispatcher');

var FavPageActions = {
    refresh    : function () {
        AppDispatcher.dispatch({
            actionType: Constants.actions.FAV_PAGE_REFRESH
        });
    },
    loadMore: function (sectionID) {
        AppDispatcher.dispatch({
            actionType : Constants.actions.FAV_SECTION_LOAD,
            sectionID: sectionID,
        })
    }
};

module.exports = FavPageActions;