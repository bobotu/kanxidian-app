'use strict';

var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');

var buildStyleInterpolator = require('buildStyleInterpolator');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var FadeToTheLeft = {
    // Rotate *requires* you to break out each individual component of
    // rotation (x, y, z, w)
    transformTranslate: {
        from       : {x: 0, y: 0, z: 0},
        to         : {x: -Math.round(Dimensions.get('window').width * 0.3), y: 0, z: 0},
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true,
        round      : PixelRatio.get(),
    },
    transformScale    : {
        from       : {x: 1, y: 1, z: 1},
        to         : {x: 0.95, y: 1, z: 1},
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true
    },
    opacity           : {
        from       : 1,
        to         : 0.3,
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: false,
        round      : 100,
    },
    translateX        : {
        from       : 0,
        to         : -Math.round(Dimensions.get('window').width * 0.3),
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true,
        round      : PixelRatio.get(),
    },
    scaleX            : {
        from       : 1,
        to         : 0.95,
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true
    },
    scaleY            : {
        from       : 1,
        to         : 0.95,
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true
    },
};

var FromTheRight = {
    opacity: {
        value: 1.0,
        type : 'constant',
    },

    transformTranslate: {
        from       : {x: Dimensions.get('window').width, y: 0, z: 0},
        to         : {x: 0, y: 0, z: 0},
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true,
        round      : PixelRatio.get(),
    },

    translateX: {
        from       : Dimensions.get('window').width,
        to         : 0,
        min        : 0,
        max        : 1,
        type       : 'linear',
        extrapolate: true,
        round      : PixelRatio.get(),
    },

    scaleX: {
        value: 1,
        type : 'constant',
    },
    scaleY: {
        value: 1,
        type : 'constant',
    },
};

var NoTransition = {
    opacity: {
        from       : 1,
        to         : 1,
        min        : 1,
        max        : 1,
        type       : 'linear',
        extrapolate: false,
        round      : 100,
    },
};

var BaseLeftToRightGesture = {

    // If the gesture can end and restart during one continuous touch
    isDetachable: false,

    // How far the swipe must drag to start transitioning
    gestureDetectMovement: 2,

    // Amplitude of release velocity that is considered still
    notMoving: 0.3,

    // Fraction of directional move required.
    directionRatio: 0.66,

    // Velocity to transition with when the gesture release was "not moving"
    snapVelocity: 2,

    // Region that can trigger swipe. iOS default is 30px from the left edge
    edgeHitWidth: 100,

    // Ratio of gesture completion when non-velocity release will cause action
    stillCompletionRatio: 3 / 5,

    fullDistance: SCREEN_WIDTH,

    direction: 'left-to-right',

};
var BaseConfig = {
    // A list of all gestures that are enabled on this scene
    gestures: {
        pop: BaseLeftToRightGesture,
    },

    // Rebound spring parameters when transitioning FROM this scene
    springFriction: 21,
    springTension : 200,

    // Velocity to start at when transitioning without gesture
    defaultTransitionVelocity: 1.5,

    // Animation interpolators for horizontal transitioning:
    animationInterpolators: {
        into: buildStyleInterpolator(FromTheRight),
        out : buildStyleInterpolator(FadeToTheLeft),
    },
};


module.exports = {
    NavigatorScenePushFromRightIOS: BaseConfig,
    NoTransition                  : {
        ...BaseConfig,
        gestures                 : null,
        defaultTransitionVelocity: 1.5,
        animationInterpolators   : {
            into: buildStyleInterpolator(NoTransition),
            out : buildStyleInterpolator(NoTransition),
        },
    }
};
