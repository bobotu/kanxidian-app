var React = require('react-native');
var Cards = require('../Cards/Cards').CardsWithAccountBar;
var LoadingMoreCard = require('../Cards/Cards').LoadingMoreCard;
const Constants = require('../../constants/Constants');
var HomePageActions = require('../../actions/HomePageActions');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var CustomConfigureScene = require('../../utilities/CustomConfigureScene');


var {
        ListView,
        StyleSheet,
        ActivityIndicatorIOS,
        View,
        Text,
        TouchableHighlight,
        RefreshControl,
        Animated
        } = React;

const styles = StyleSheet.create({
    container       : {

        flex: 1,
    },
    CardsFlow       : {
        paddingHorizontal: 10,
        paddingTop       : 5,
    },
    navigationBar   : {
        borderStyle      : 'solid',
        borderColor      : Constants.color.CARD_BORDER_GREY,
        borderBottomWidth: Constants.style.hairLineWidth,
        flexDirection    : 'row',
        justifyContent   : 'center',
        alignItems       : 'flex-end',
        paddingHorizontal: 20,
        backgroundColor  : '#FFF',
        paddingBottom    : 7,
        marginTop        : Constants.style.STATUS_BAR_HEIGHT,
        overflow         : 'hidden',
    },
    statusBar       : {
        height         : Constants.style.STATUS_BAR_HEIGHT,
        backgroundColor: '#FFF',
        position       : 'absolute',
        top            : 0,
        right          : 0,
        left           : 0
    },
    searchButton    : {
        flex           : 1,
        height         : 30,
        backgroundColor: Constants.color.CARD_BORDER_GREY,
        alignSelf      : 'flex-end',
        borderRadius   : 5,
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'center'
    },
    searchButtonText: {
        color    : Constants.color.SEARCH_BUTTON_FONT,
        textAlign: 'center',
        fontSize : 18
    },
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.docid != r2.docid});

var HomePage = React.createClass({
    mixins            : [PureRenderMixin],
    offsetY           : 0,
    isHidden          : false,
    componentDidUpdate: function (nP, nS) {
        if (this.state.isRefreshing && nP.pageData != this.props.pageData) {
            this.setState({isRefreshing: false})
        }
    },
    getInitialState   : function () {
        return {
            isRefreshing: false,
            navBarHeight: new Animated.Value(Constants.style.NAV_BAR_HEIGHT),
        }
    },
    componentDidMount : function () {
        if (this.props.isInitSearch) {
            this.props.navigator.push({
                name          : 'search',
                configureScene: CustomConfigureScene.NoTransition
            })
        }
    },
    render            : function () {
        var isLoading = this.props.pageData.get('dataBlob').size < 1;
        return (
            <View style={styles.container}>
                <View style={styles.statusBar}/>
                <Animated.View style={[styles.navigationBar, {height: this.state.navBarHeight}]}>
                    <TouchableHighlight
                        style={styles.searchButton}
                        activeOpacity={1}
                        underlayColor={Constants.color.CARD_BORDER_GREY}
                        onPress={this._onSearchPress}>
                        <Text style={styles.searchButtonText}>搜索</Text>
                    </TouchableHighlight>
                </Animated.View>
                {
                    isLoading ?
                        <ActivityIndicatorIOS
                            style={{marginTop: 40}}
                        /> :
                        <ListView
                            ref={(listView) => this._list = listView}
                            keyboardDismissMode="on-drag"
                            contentContainerStyle={styles.CardsFlow}
                            dataSource={ds = ds.cloneWithRows(this.props.pageData.get('dataBlob').toJS())}
                            renderRow={(data) => (<Cards {...data} key={data.docid} navigator={this.props.navigator} globalNavigator={this.props.globalNavigator}/>)}
                            renderFooter={() => <LoadingMoreCard/>}
                            onEndReached={HomePageActions.load}
                            onEndReachedThreshold={100}
                            initialListSize={6}
                            pageSize={6}
                            automaticallyAdjustContentInsets={false}
                            scrollRenderAheadDistance={40}
                            onScroll={this._onScroll}
                            refreshControl={<RefreshControl
                                                refreshing={this.state.isRefreshing}
                                                onRefresh={this._onRefresh}
                                                tintColor={Constants.color.TIP_LOADING_FONT}
                                                title={this.state.isRefreshing? "刷新中" : "下拉刷新"}
                                                progressBackgroundColor="#000"
                                                colors={Constants.color.LOADING_AI_ARRAY}
                                            />}
                        />
                }
            </View>
        )

    },
    _onRefresh        : function () {
        this.setState({isRefreshing: true});
        HomePageActions.refresh();
    },
    _onSearchPress    : function () {
        this.props.navigator.push({
            name          : 'search',
            configureScene: CustomConfigureScene.NoTransition
        })
    },
    _onScroll         : function (e) {
        //console.log(`${this.offsetY}   ${e.nativeEvent.contentSize.height} ${e.nativeEvent.layoutMeasurement.height}`);
        var currentOffset = e.nativeEvent.contentOffset.y > 0 ? e.nativeEvent.contentOffset.y : 0; //刷新时offset将是负数,动画将会错误
        //解决下拉超出内容长度时引发的错误动画
        currentOffset = currentOffset < e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - 50 ? currentOffset : e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - 50;
        var ANIMATED_MIN_DISTANCE = 20;
        if (Math.abs(currentOffset - this.offsetY) > ANIMATED_MIN_DISTANCE)  //当滑动距离大于MIN_DISTANCE时才会进入判断,实现最小触发距离
        {
            if (this.offsetY < currentOffset && !this.isHidden) {
                Animated.timing(this.state.navBarHeight, {
                    toValue : 0,
                    duration: 100
                }).start();
                this.isHidden = true;
            }
            else if (this.offsetY > currentOffset && this.isHidden) {
                Animated.timing(this.state.navBarHeight, {
                    toValue : Constants.style.NAV_BAR_HEIGHT,
                    duration: 100
                }).start();
                this.isHidden = false;
            }
            this.offsetY = currentOffset;
        }
    }
});


module.exports = HomePage;
