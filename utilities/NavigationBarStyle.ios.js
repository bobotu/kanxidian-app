var Constants = require('../constants/Constants');

module.exports = {
    navigationBar  : {
        position       : 'relative',
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'flex-end',
        paddingBottom  : 10,
        paddingTop     : Constants.style.STATUS_BAR_HEIGHT,
        height         : Constants.style.NAV_BAR_HEIGHT + Constants.style.STATUS_BAR_HEIGHT,
        backgroundColor: Constants.color.NAVIGATION_BAR_BACKGROUND,
    },
    rightButton    : {
        flex    : 0,
        position: 'absolute',
        right   : 3,
        bottom  : 8,
    },
    closeButton    : {
        flex          : 0,
        position      : 'absolute',
        left          : 0,
        bottom        : 10,
        width         : 40,
        height        : 40,
        flexDirection : 'row',
        alignItems    : 'flex-end',
        justifyContent: 'center',
    },
    navBatTitle    : {
        fontSize  : 21,
        fontWeight: '200',
        flex      : 0,
        textAlign : 'center'
    },
    rightButtonText: {
        fontSize  : 16,
        fontWeight: '800',
        color     : 'rgba(0,122,255,1)',
        margin    : 5,
    },
};