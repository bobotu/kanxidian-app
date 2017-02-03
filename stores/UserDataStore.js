var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
const Configs = require('../configs');
const Constants = require('../constants/Constants');
var FavPageActions = require('../actions/FavPageActions');
var Immutable = require('immutable');
var AsyncStorage = require('react-native').AsyncStorage;
var md5 = require('md5');
var sha1 = require('sha1');

var token = null;

var UserData = Immutable.Map({
    userName   : null,
    userIcon   : null,
    email      : null,
    phone      : null,
    favList    : Immutable.List(),
    isNeedLogIn: false,
});

var UserDataStore = Object.assign({}, EventEmitter.prototype, {
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
            case Constants.actions.USER_SIGN_UP :
                signUp(payload.profile);
                break;
            case Constants.actions.USER_LOG_IN :
                logIn(payload.profile);
                break;
            case Constants.actions.TOKEN_FOUNDED:
                token = payload.token;
                fetchUserData();
                break;
            case Constants.actions.TOKEN_NOT_FOUNDED:
                UserData = UserData.withMutations(userData=> {
                    userData.set('userIcon', null).set('userName', null).set('favList', Immutable.List()).set('isNeedLogIn', true);
                });
                token = null;
                UserDataStore.emitChange();
                break;
            case Constants.actions.USER_LOG_OUT:
                logOut();
                break;
            case Constants.actions.USER_SAVE_FAV_LIST:
                var profile = {followList: payload.list};
                setUserData(profile);
                break;
        }
    }),
    getUserData         : function () {
        return UserData;
    },
    init                : function () {
        //暂时不做任何事
    }
});

function asyncStorageSaveToken(token) {
    AsyncStorage.setItem('userToken', token, function (error) {
        if (error) {
            console.log(error)
        }
        else {
            AppDispatcher.dispatch({
                actionType: Constants.actions.TOKEN_FOUNDED,
                token     : token
            })
        }
    })
}

function generateRandomStr() {
    var str = Math.random().toString(36).substr(2).slice(0, 6);
    while (str.length < 6) {
        str = Math.random().toString(36).substr(2).slice(0, 6);
    }
    return str;
}

function signUp(profile) {
    var date = Date.now();
    var str = generateRandomStr();
    var sign = md5(date + str + 'kanxidian');
    var password = sha1(profile.userName + profile.password);

    var finalProfile = {
        username: profile.userName,
        password: password,
        email   : profile.email
    };

    if (profile.phone) {
        finalProfile.phone = profile.phone
    }

    fetch(Configs.userURL(), {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify({
            action : 'signup',
            date   : date,
            str    : str,
            sign   : sign,
            profile: finalProfile
        })
    })
        .then(res => {
            if(res.status >= 200 && res.status < 300) {
                return res.json()
            }
            else {
                UserData = UserData.set('result', errCode('201'));
                UserDataStore.emitChange();
                throw 'sign up error'
            }
        })
        .then(data => {
            if (data.result === 'success') {
                UserData = UserData.withMutations(userData => {
                    userData.set('userName', data.username)
                            .set('userToken', data.token)
                            .set('result', 'success');
                });
                asyncStorageSaveToken(data.token);
            }
            else {
                UserData.set('result', errCode(data.code))
            }
            UserDataStore.emitChange();
            UserData.delete('result');
        })
        .catch(err => {
            console.log(err)
        })
}

function logIn(profile) {
    var date = Date.now();
    var str = generateRandomStr();
    var sign = md5(date + str + 'kanxidian');
    var password = sha1(profile.userName + profile.password);
    var finalProfile = {
        password: password,
    };
    if (/^[0-9a-z][a-z0-9._-]*@[a-z0-9-]+[a-z0-9].[a-z.]+[a-z]$/.test(profile.userName)) {
        finalProfile.email = profile.userName
    } else {
        finalProfile.username = profile.userName
    }

    fetch(Configs.userURL(), {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify({
            action : 'login',
            date   : date,
            str    : str,
            sign   : sign,
            profile: finalProfile
        })
    })
        .then(res => {
            if(res.status >= 200 && res.status < 300) {
                return res.json()
            }
            else {
                UserData =  UserData.set('result', errCode('202'));
                UserDataStore.emitChange();
                throw 'log in error'
            }
        })
        .then(data => {
            if (data.result === 'success') {
                UserData = UserData.withMutations(userData => {
                    userData.set('userName', data.username)
                        .set('userToken', data.token)
                        .set('result', 'success');
                });
                asyncStorageSaveToken(data.token);
            }
            else {
                UserData.set('result', errCode(data.code))
            }
            UserDataStore.emitChange();
            UserData.delete('result');
        })
        .catch(err => {
            console.log(err);
        })
}

function logOut() {
    AsyncStorage.removeItem('userToken', function (err) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.dispatch({
                actionType: Constants.actions.TOKEN_NOT_FOUNDED
            })
        }
    })
}

function fetchUserData() {
    var date = Date.now();
    var str = generateRandomStr();
    var sign = md5(date + str + 'kanxidian');
    fetch(Configs.userURL(), {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify({
            action: 'netinfo',
            date  : date,
            str   : str,
            sign  : sign,
            token : token
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.result == 'success') {
                UserData = UserData.withMutations(userData => {
                    userData
                        .set('userName', data.username)
                        .set('phone', data.phone)
                        .set('email', data.email)
                        .set('favList', Immutable.List(JSON.parse(data.profile).followList))
                        .set('isNeedLogIn', false)
                        .set('userIcon', `http://api.kanxidian.com/icon/${md5(sha1(token))}`);
                })
            }
            else {
                //TODO::网络错误提示
            }
            UserDataStore.emitChange();
            UserData.delete('result');
        })
        .catch(err => {
            console.log(err)
        })
}

function setUserData(profile) {
    var date = Date.now();
    var str = generateRandomStr();
    var sign = md5(date + str + 'kanxidian');
    fetch(Configs.userURL(), {
        method : 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify({
            action : 'setinfo',
            date   : date,
            str    : str,
            sign   : sign,
            token  : token,
            profile: profile
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.result = 'success') {
                profile = JSON.parse(data.profile);
                UserData = UserData.withMutations(userData => {
                    userData
                        .set('userName', profile.username)
                        .set('phone', profile.phone)
                        .set('email', profile.email)
                        .set('favList', Immutable.List(profile.followList))
                        .set('isNeedLogIn', false)
                        .set('result', 'success');
                })
            }
            else {
                var errTip = errCode(data.code);
                UserData.set('result', errTip);
            }
            AppDispatcher.dispatch({
                actionType: Constants.actions.FAV_PAGE_REFRESH
            });
            UserDataStore.emitChange();
            UserData.delete('result');
        })
}

function errCode(code) {
    var errType;
    switch (code) {
        case '200':
            errType = '客户端错误...';
            break;
        case '201':
            errType = '注册失败...用户名,邮箱或手机号码被人占用了,您再选一个?';
            break;
        case '202':
            errType = '登录失败...用户名/密码错误,您再仔细回忆回忆?';
            break;
        case '203':
            errType = '这真不是我的错啊!这大概是一个叫LeanCloud的犯下的错!';
            break;
        default:
            errType = '未知错误发生了,我也是一脸蒙逼...';
            break;
    }
    return errType
}

module.exports = UserDataStore;