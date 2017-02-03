'use strict';

var React = require('react-native');
const Constants = require('../../constants/Constants');

var {
        View,
        Text,
        Image,
        TouchableHighlight,
        StyleSheet,
        ProgressBarAndroid,
        TouchableNativeFeedback
        } = React;

const styles = StyleSheet.create({
    Cards              : {
        flex             : 1,
        flexDirection    : 'column',
        justifyContent   : 'flex-start',
        alignItems       : 'stretch',
        overflow         : 'hidden',
        paddingVertical  : 5,
        borderStyle      : 'solid',
        borderBottomWidth: Constants.style.hairLineWidth,
        borderColor      : Constants.color.CARD_BORDER_GREY,
        backgroundColor  : '#FFF',
    },
    accountBar         : {
        flex           : 1,
        flexDirection  : 'row',
        justifyContent : 'flex-start',
        alignItems     : 'center',
        paddingVertical: 5
    },
    accountImgContainer: {
        flex          : 1,
        flexDirection : 'column',
        justifyContent: 'center',
        alignItems    : 'center'
    },
    button             : {
        flex           : 1,
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        width          : 38,
        height         : 38,
        borderRadius   : 19,
    },
    accountImg         : {
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        width          : 38,
        height         : 38,
        borderRadius   : 19,
    },
    accountInfo        : {
        flex          : 4,
        flexDirection : 'row',
        justifyContent: 'flex-start',
        alignItems    : 'center'
    },
    account            : {
        fontSize: 12,
        color   : Constants.color.CARD_ACCOUNT_FONT,
    },
    date               : {
        fontSize: 11,
    },
    titleBar           : {
        flex           : 1,
        flexDirection  : 'row',
        justifyContent : 'flex-start',
        alignItems     : 'center',
        paddingVertical: 5,
    },
    title              : {
        fontSize  : 18,
        flex      : 1,
        fontWeight: '600',
        color     : Constants.color.CARD_TITLE_FONT
    },
    summaryBar         : {
        flex           : 5,
        flexDirection  : 'row',
        justifyContent : 'flex-start',
        alignItems     : 'flex-start',
        paddingVertical: 5,
    },
    summary            : {
        flex      : 1,
        fontSize  : 14,
        fontWeight: '400',
        color     : Constants.color.CARD_SUMMARY_FONT
    },
    loadingCard        : {
        flex           : 1,
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'center',
        overflow       : 'hidden',
        paddingVertical: 5,
    },
    loadingText        : {
        flex      : 0,
        color     : Constants.color.TIP_LOADING_FONT,
        textAlign : 'center',
        marginLeft: 10
    },
    loading            : {
        flex: 0
    },
    nameLink           : {
        padding: 3
    },
    highlightText      : {
        fontSize  : 16,
        color     : Constants.color.CARD_TITLE_FONT,
        fontWeight: '600'
    }
});

var CardsWithAccountBar = React.createClass({
    render: function () {
        var accountinfo = {
                account   : this.props.accountname,
                accountImg: this.props.accountimg,
                date      : this.props.date,
            },
            title       = {
                title: this.props.title.trim(),
                url  : this.props.url,
            },
            summary     = {
                summary: this.props.summary.trim(),
                url    : this.props.url,
            };
        return (
            <View
                style={styles.Cards}>
                <AccountBar {...accountinfo} navigator={this.props.navigator}/>
                <TitleBar {...title} globalNavigator={this.props.globalNavigator}/>
                <SummaryBar {...summary} globalNavigator={this.props.globalNavigator}/>
            </View>
        );
    }
});

var CardsWithoutAccountBar = React.createClass({
    render: function () {
        var title   = {
                title: this.props.title.trim(),
                url  : this.props.url,
            },
            summary = {
                summary: this.props.summary.trim(),
                url    : this.props.url,
            };
        return (
            <View style={styles.Cards}>
                <TitleBar {...title} globalNavigator={this.props.globalNavigator}/>
                <SummaryBar {...summary} globalNavigator={this.props.globalNavigator}/>
            </View>
        );
    }
});

var LoadingMoreCard = React.createClass({
    render: function () {
        return (
            <View style={[styles.loadingCard, this.props.style]}>
                <ProgressBarAndroid
                    color="rgba(63,81,181,1)"
                    styleAttr="SmallInverse"
                />
            </View>
        )
    }
});

var NoMoreCard = React.createClass({
    render: function () {
        return (
            <View style={[styles.loadingCard, this.props.style]}>
                <Text
                    style={styles.loadingText}>
                    到底啦
                </Text>
            </View>
        )
    }
});

var AccountBar = React.createClass({
    render  : function () {
        return (
            <View style={styles.accountBar}>
                <View style={styles.accountImgContainer}>
                    <TouchableHighlight
                        style={styles.button}
                        activeOpacity={1}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_BLUE}
                        onPress={this._onPress}>
                        <Image style={styles.accountImg} source={{uri: this.props.accountImg}}/>
                    </TouchableHighlight>
                </View>
                <View style={styles.accountInfo}>
                    <TouchableHighlight
                        style={styles.nameLink}
                        activeOpacity={1}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}
                        onPress={this._onPress}>
                        <Text style={styles.account}>
                            {this.props.account}
                        </Text>
                    </TouchableHighlight>
                    <Text style={styles.date}>
                        {' 于 ' + this.props.date + ' 发表'}
                    </Text>
                </View>
            </View>
        );
    },
    _onPress: function () {
        this.props.navigator.push({
            name: 'account',
            id  : this.props.account
        })
    }
});

var TitleBar = React.createClass({
    render  : function () {
        return (
            <View>
                <TouchableHighlight
                    style={styles.titleBar}
                    activeOpacity={1}
                    underlayColor={Constants.color.TOUCH_UNDERLAY_BLUE}
                    onPress={this._onPress}>
                    <Text style={styles.title}>
                        {this.props.title}
                    </Text>
                </TouchableHighlight>
            </View>
        );
    },
    _onPress: function () {
        this.props.globalNavigator.push({
            name: 'detail',
            url : this.props.url,
        })
    }
});

var SummaryBar = React.createClass({
    render  : function () {
        return (
            <View>
                <TouchableNativeFeedback
                    style={styles.summaryBar}
                    onPress={this._onPress}
                    background={TouchableNativeFeedback.SelectableBackground()}
                >
                    <View>
                        <Text
                            style={styles.summary}
                            numberOfLines={3}>
                            {this.props.summary}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    },
    _onPress: function () {
        this.props.globalNavigator.push({
            name: 'detail',
            url : this.props.url,
        })
    }
});


var Cards = {
    CardsWithAccountBar   : CardsWithAccountBar,
    CardsWithoutAccountBar: CardsWithoutAccountBar,
    LoadingMoreCard       : LoadingMoreCard,
    NoMoreCard            : NoMoreCard
};

module.exports = Cards;
