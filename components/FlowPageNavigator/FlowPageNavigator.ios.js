/**
 * 列表  帐号页面 之间的导航
 * 列表视图来自Props
 * @type {ReactNative|exports|module.exports}
 */


var React = require('react-native');
var AccountPage = require('../AccountPage/AccountPage');
var SearchPage = require('../SearchPage/SearchPage');
var CustomConfigureScene = require('../../utilities/CustomConfigureScene');
var HomePage = require('../HomePage/HomePage');
const Constants = require('../../constants/Constants');

var {
        Navigator,
        StyleSheet,
        DeviceEventEmitter
        } = React;

const styles = StyleSheet.create({
    navPageContainer: {
        flexDirection  : 'row',
        justifyContent : 'center',
        marginBottom   : 49,
        backgroundColor: '#FFF',
    },
    titleText       : {
        fontSize  : 30,
        fontWeight: '300'
    },

});

var FlowPageNavigator = React.createClass({
    _onQuickActions     : null,
    render() {
        return (
            <Navigator
                initialRoute={{name: 'flow'}}
                renderScene={this.renderScene}
                sceneStyle={styles.navPageContainer}
                configureScene={this._configureScene}
                ref={(nav) => this._nav = nav}
            />
        );
    },
    _configureScene     : function (route) {
        if (route.configureScene) {
            return route.configureScene;
        }
        else {
            return CustomConfigureScene.NavigatorScenePushFromRightIOS;
        }
    },
    renderScene         : function (route, navigator) {
        if (this.childNavigator == null) {
            this.childNavigator = navigator;
        }
        var CardsFlow = this.props.cardFlow; //由TabView传入的ListView子试图类型
        switch (route.name) {
            case 'flow':
                return (
                    //由TabView传入的ListView来render一个ListView
                    <CardsFlow
                        globalNavigator={this.props.globalNavigator}
                        navigator={navigator}
                        pageData={this.props.pageData}
                        isInitSearch={this.props.isInitSearch}
                    />
                );
            case 'account':
                return (
                    <AccountPage globalNavigator={this.props.globalNavigator}
                                 navigator={navigator}
                                 name={route.id}
                                 accountPageData={this.props.accountPageData}
                    />
                );
            case 'search':
            {
                return (
                    <SearchPage
                        globalNavigator={this.props.globalNavigator}
                        navigator={navigator}
                        searchPageData={this.props.searchPageData}
                    />
                );
            }
        }
    },
    componentDidMount   : function () {
        this._onQuickActions = DeviceEventEmitter.addListener('quickActionShortcut', this._onQuickAction);
    },
    componentWillUnmount: function () {
        this._onQuickActions.remove();
    },
    _onQuickAction      : function (data) {
        switch (data.type) {
            case Constants.configs.QUICK_FAV:
                if(this.props.name == 'fav') {
                    if(this.props.globalNavigator.getCurrentRoutes().length > 0) {
                        this.props.globalNavigator.pop();
                    }
                    this._nav.popToTop();
                }
                break;
            case Constants.configs.QUICK_SEARCH:
                if(this.props.name == 'home') {
                    if(this.props.globalNavigator.getCurrentRoutes().length > 0) {
                        this.props.globalNavigator.pop();
                    }
                    this._nav.immediatelyResetRouteStack([{name: 'flow'}]);
                    this._nav.push({name: 'search', configureScene: CustomConfigureScene.NoTransition});
                }
                break;
        }
    }
});


module.exports = FlowPageNavigator;
