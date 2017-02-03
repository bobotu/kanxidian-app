var mirrorKey = require('mirrorkey');
var hairLineWidth = require('react-native').StyleSheet.hairlineWidth;

var constants = {
    color  : {
        CARD_BORDER_GREY              : 'rgba(231,231,231,1)',
        CARD_ACCOUNT_FONT             : 'rgba(146,147,168,1)',
        OPACITY_BACKGROUND            : 'rgba(256,256,256,0)',
        CARD_TITLE_FONT               : 'rgba(33,54,85,1)',
        CARD_SUMMARY_FONT             : 'rgba(68,68,68,1)',
        TIP_LOADING_FONT              : 'rgba(146,147,168,1)',
        TOUCH_UNDERLAY_GREY           : 'rgba(231,231,231,0.1)',
        TOUCH_UNDERLAY_BLUE           : 'rgba(0,65,130,0.1)',
        SEARCH_BUTTON_FONT            : 'rgba(158, 158, 158, 1.0)',
        LIST_SECTION_HEADER_BACKGROUND: 'rgba(249, 249, 249, 1)',
        NAVIGATION_BAR_BACKGROUND     : 'rgba(250,250,250,1)',
        SETTING_BACKGROUND            : 'rgba(239, 239, 244, 1.0)',
        LOADING_AI_ARRAY              : ['rgba(168,168,168,1)', 'rgba(198,198,198,1)', 'rgba(208,208,208,1)'],
        LOADING_AI                    : 'rgba(168,168,168,1)'
    },
    actions: mirrorKey({
        HOME_PAGE_REFRESH: null,
        HOME_PAGE_LOAD   : null,

        USER_SIGN_UP: null,
        USER_LOG_IN : null,
        USER_LOG_OUT: null,

        USER_SAVE_FAV_LIST: null,
        USER_SAVE_PROFILE : null,

        TOKEN_FOUNDED    : null,
        TOKEN_NOT_FOUNDED: null,

        FAV_SECTION_LOAD: null,
        FAV_PAGE_REFRESH: null,

        ACC_PAGE_REFRESH: null,
        ACC_PAGE_LOAD   : null,
        ACC_PAGE_INIT   : null,
        ACC_PAGE_DEL    : null,

        SEARCH          : null,
        SEARCH_LOAD_MORE: null,
        SEARCH_CLOSE    : null,
    }),
    configs: {
        CHANGE_EVENT: 'change',
        QUICK_FAV  : 'com.kanxidian.kanxidian.fav',
        QUICK_SEARCH: 'com.kanxidian.kanxidian.search',
        QUICK_ACCOUNT  : 'com.kanxidian.kanxidian.account'
    },
    style  : {
        hairLineWidth    : hairLineWidth,
        STATUS_BAR_HEIGHT: 20,
        NAV_BAR_HEIGHT   : 44
    }
};

module.exports = constants;