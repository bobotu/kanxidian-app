var React = require('react-native');
//var SettingsPage = require('../SettingsPage/SettingsPage');
var HomePage = require('../HomePage/HomePage');
var FavPage = require('../FavPage/FavPage');
const Constants = require('../../constants/Constants');

var {
        TabBarIOS,
        StyleSheet,
        DeviceEventEmitter,
        ViewPagerAndroid
        } = React;

var ViewPager = React.createClass({
    render: function() {
        return (
            <ViewPagerAndroid>
                <HomePage
                    pageData={this.props.homePageData}/>
                <FavPage
                    pageData={this.props.favPageData}/>
            </ViewPagerAndroid>
        )
    }
});

module.exports = ViewPager;