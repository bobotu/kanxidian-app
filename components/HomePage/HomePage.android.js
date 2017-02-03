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
        ProgressBarAndroid,
        View,
        RefreshControl,
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
        }
    },
    render            : function () {
        var isLoading = this.props.pageData.get('dataBlob').size < 1;
        return (
            <View style={styles.container}>
                <View style={styles.statusBar}/>
                {
                    isLoading ?
                        <ProgressBarAndroid
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
});


module.exports = HomePage;
