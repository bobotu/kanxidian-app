/**
 * TabView 页面
 * 将 主页列表 或者 关注列表 作为Props传递给 FlowPageNavigator
 * @type {ReactNative|exports|module.exports}
 */

var React = require('react-native');
var FlowPageNavigator = require('../FlowPageNavigator/FlowPageNavigator');
var SettingsPage = require('../SettingsPage/SettingsPage');
var HomePage = require('../HomePage/HomePage');
var FavPage = require('../FavPage/FavPage');
const Constants = require('../../constants/Constants');

var {
        TabBarIOS,
        StyleSheet,
        DeviceEventEmitter
        } = React;

const styles = StyleSheet.create({
    tabBarItem: {
        backgroundColor: '#FFF'
    }
});

var MainPage = React.createClass({
    _onQuickActions : null,
    getInitialState() {
        return {
            selectedTab: this.props.initTab,
        };
    },
    backToTop: function (ref) {
        this.refs[ref].childNavigator.popToTop();
    },
    render() {
        return (
            <TabBarIOS
                translucent={true}>
                <TabBarIOS.Item
                    style={styles.tabBarItem}
                    title='首页'
                    icon={require('../../img/home.png')}
                    selected={this.state.selectedTab == 'home'}
                    onPress={()=>{
                        if(this.state.selectedTab != 'home') {
                            this.setState({
                                selectedTab: 'home'
                            })
                        }
                        else {
                            this.backToTop('homePage');
                        }
                    }}>
                    <FlowPageNavigator
                        ref='homePage'
                        globalNavigator={this.props.globalNavigator}
                        cardFlow={HomePage}
                        pageData={this.props.homePageData}
                        accountPageData={this.props.accountPageData}
                        searchPageData={this.props.searchPageData}
                        isInitSearch={this.props.isInitSearch}
                        name="home"
                    />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    style={styles.tabBarItem}
                    title='关注'
                    icon={require('../../img/like.png')}
                    selected={this.state.selectedTab == 'fav'}
                    onPress={()=>{
                        if(this.state.selectedTab != 'fav'){
                            this.setState({
                                selectedTab: 'fav'
                            })
                        }
                    }}>
                    <FlowPageNavigator
                        ref='favPage'
                        globalNavigator={this.props.globalNavigator}
                        cardFlow={FavPage}
                        pageData={this.props.favPageData}
                        accountPageData={this.props.accountPageData}
                        name="fav"
                    />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    style={styles.tabBarItem}
                    title='设置'
                    icon={require('../../img/settings.png')}
                    selected={this.state.selectedTab == 'setting'}
                    onPress={()=>{
                        this.setState({
                            selectedTab: 'setting'
                        })
                    }}>
                    <SettingsPage
                        ref='settingPage'
                        globalNavigator={this.props.globalNavigator}
                        userData={this.props.userData}/>
                </TabBarIOS.Item>
            </TabBarIOS>
        );
    },
    componentDidMount: function() {
        this._onQuickActions = DeviceEventEmitter.addListener('quickActionShortcut', this._onQuickAction);
    },
    componentWillUnmount: function() {
        this._onQuickActions.remove();
    },
    _onQuickAction: function(data) {
        switch (data.type) {
            case Constants.configs.QUICK_FAV:
                this.setState({selectedTab: 'fav'});
                break;
             case Constants.configs.QUICK_SEARCH:
                this.setState({selectedTab: 'home'});
                break;
        }
    }
});


module.exports = MainPage;
