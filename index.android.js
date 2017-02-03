'use strict';

var React = require('react-native');

var ViewPager = require('./components/MainView/MainView');
//var WebView = require('./components/WebView/WebView');
//var CustomConfigureScene = require('./utilities/CustomConfigureScene');
//var FavList = require('./components/SettingsPage/FavList');
//var LoginAndSignUp = require('./components/SettingsPage/LoginAndSignUp');

var HomePageStore = require('./stores/HomePageStore');
var FavPageStore = require('./stores/FavPageStore');
var UserDataStore = require('./stores/UserDataStore');
var AccountPageStore = require('./stores/AccountPageStore');
var SearchPageStore = require('./stores/SearchPageStore');

var AppDispatcher = require('./dispatcher/AppDispatcher');

var Constants = require('./constants/Constants');

var {
        AppRegistry,
        Navigator,
        AsyncStorage,
        DeviceEventEmitter,
        } = React;

function getDataFromStore() {
    return {
        homePageData   : HomePageStore.getHomePageItems(),
        favPageData    : FavPageStore.getFavPageItems(),
        userData       : UserDataStore.getUserData(),
        accountPageData: AccountPageStore.getAccountPageItems(),
        searchPageData : SearchPageStore.getSearchPageItems(),
    }
}

function init() {
    UserDataStore.init();
    HomePageStore.init();
    FavPageStore.init();
    AccountPageStore.init();
}


var kanxidian = React.createClass({
    _quickActionEvent   : null,
    _initTab            : 'home',
    _isInitSearch       : false,
    getInitialState     : function () {
        return {
            stores: getDataFromStore(),
        };
    },
    componentWillMount  : function () {
        AsyncStorage.getItem('userToken', function (err, result) {
            if (err) {
                console.log(err);
            }
            else if (result) {
                AppDispatcher.dispatch({
                    actionType: Constants.actions.TOKEN_FOUNDED,
                    token     : result
                })
            }
            else {
                AppDispatcher.dispatch({
                    actionType: Constants.actions.TOKEN_NOT_FOUNDED
                })
            }
        });
    },
    componentDidMount   : function () {
        HomePageStore.addChangeListener(this._onChange);
        FavPageStore.addChangeListener(this._onChange);
        UserDataStore.addChangeListener(this._onChange);
        AccountPageStore.addChangeListener(this._onChange);
        SearchPageStore.addChangeListener(this._onChange);
        init();
    },
    componentWillUnmount: function () {
        HomePageStore.removeChangeListener(this._onChange);
        FavPageStore.removeChangeListener(this._onChange);
        UserDataStore.removeChangeListener(this._onChange);
        AccountPageStore.removeChangeListener(this._onChange);
        SearchPageStore.removeChangeListener(this._onChange);
    },
    render              : function () {
        return (
            <Navigator
                ref={(navigator) => {this._navigator = navigator}}
                debugOverlay={false}
                initialRoute={{name: 'index'}}
                renderScene={this.renderScene}
                configureScene={(route)=>{
                        if(route.configureScene) return route.configureScene;
                        else return Navigator.SceneConfigs.FloatFromBottomAndroid
                    }}
            />
        );
    },
    renderScene         : function (route, navigator) {
        switch (route.name) {
            case 'index':
                return (
                    <ViewPager
                        globalNavigator={navigator}
                        homePageData={this.state.stores.homePageData}
                        favPageData={this.state.stores.favPageData}
                        accountPageData={this.state.stores.accountPageData}
                        userData={this.state.stores.userData}
                        searchPageData={this.state.stores.searchPageData}
                        initTab={this._initTab}
                        isInitSearch={this._isInitSearch}
                    />
                );
            //case 'detail':
            //    return (
            //        <WebView navigator={navigator} url={route.url}/>
            //    );
            //case 'loveList':
            //    return (
            //        <FavList
            //            navigator={navigator}
            //            favList={this.state.stores.userData.get('favList').toJS()}
            //            result={this.state.stores.userData.get('result')}/>
            //    );
            //case 'loginAndSignUp':
            //    return (
            //        <LoginAndSignUp
            //            navigator={navigator}
            //            result={this.state.stores.userData.get('result')}/>
            //    );
        }
    },
    _onChange           : function () {
        this.setState({stores: getDataFromStore()});
    },
});


AppRegistry.registerComponent('kanxidian_app', () => kanxidian);
