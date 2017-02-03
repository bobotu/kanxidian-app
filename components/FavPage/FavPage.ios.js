var React = require('react-native');
var CardsWithAccountBar = require('../Cards/Cards').CardsWithAccountBar;
var LoadingMoreCard = require('../Cards/Cards').LoadingMoreCard;
const Constants = require('../../constants/Constants');
var FavPageActions = require('../../actions/FavPageActions');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var NavigationBarStyle = require('../../utilities/NavigationBarStyle');

var {
        ListView,
        TouchableHighlight,
        Text,
        ActivityIndicatorIOS,
        View,
        StyleSheet,
        RefreshControl,
        Navigator
        } = React;

const styles = StyleSheet.create({
    container     : {
        flex           : 1,
        backgroundColor: '#FFF',
    },
    CardsFlow     : {
        paddingHorizontal: 10,
        backgroundColor  : '#FFF',
    },
    sectionHeader : {
        flexDirection    : 'row',
        justifyContent   : 'flex-start',
        alignItems       : 'center',
        backgroundColor  : '#FFF',
        borderTopWidth   : Constants.style.hairLineWidth,
        borderBottomWidth: Constants.style.hairLineWidth,
        borderStyle      : 'solid',
        borderColor      : Constants.color.CARD_BORDER_GREY,
        paddingVertical  : 5,
        marginLeft       : -10,
        paddingLeft      : 10
    },
    accountImg    : {
        flex        : 0,
        width       : 46,
        height      : 46,
        borderRadius: 23,
    },
    accountName   : {
        flex      : 0,
        fontSize  : 15,
        color     : '#000',
        textAlign : 'left',
        marginLeft: 15
    },
    loadMoreButton: {
        flex           : 0,
        height         : 30,
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'center',
        backgroundColor: '#FFF'
    },
    loadMoreText  : {
        color: Constants.color.TIP_LOADING_FONT
    },
    slideView     : {
        position       : 'absolute',
        right          : 5,
        top            : 80,
        bottom         : 20,
        opacity        : 0.8,
        flex           : 1,
        flexDirection  : 'column',
        justifyContent : 'center',
        alignItems     : 'center',
        width          : 26,
        backgroundColor: Constants.color.OPACITY_BACKGROUND
    },
    icon          : {
        height      : 24,
        width       : 24,
        borderRadius: 12,
    },
    slideIcon     : {
        flex        : 0,
        width       : 24,
        height      : 24,
        borderRadius: 12,
        marginBottom: 20
    },
    tipButton     : {
        height         : 30,
        width          : 100,
        flexDirection  : 'column',
        justifyContent : 'center',
        alignItems     : 'center',
        backgroundColor: Constants.color.TOUCH_UNDERLAY_BLUE,
        marginTop      : 10
    },
    ...NavigationBarStyle,
});


var FavPage = React.createClass({
    mixins             : [PureRenderMixin],
    dataSource         : new ListView.DataSource({
        rowHasChanged: (pRow, nRow) => pRow.docid != nRow.docid,
    }),
    getInitialState    : function () {
        return {
            isRefreshing: false
        }
    },
    componentWillUpdate: function (nP) {
        if (nP.pageData != this.props.pageData) {
            this.setState({isRefreshing: false});
        }
    },
    render             : function () {
        var mainView;
        if (this.props.pageData.get('isLoading')) {
            mainView = <ActivityIndicatorIOS style={{marginTop: 30}}/>
        }
        else if (this.props.pageData.get('isEmpty')) {
            mainView = (
                <View
                    style={[styles.container, {flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
                    <Text>好像没有设置关注的人呀</Text>
                    <TouchableHighlight
                        style={styles.tipButton}
                        activeOpacity={1}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}
                        onPress={() => {this.props.globalNavigator.push({name: 'loveList', configureScene: Navigator.SceneConfigs.FloatFromBottom})}}>
                        <Text style={{textAlign: 'center'}}>去设置</Text>
                    </TouchableHighlight>
                </View>
            )
        }
        else if (this.props.pageData.get('isNeedLogIn')) {
            mainView = (
                <View
                    style={[styles.container, {flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
                    <Text>大爷,登录一个呗?</Text>
                    <TouchableHighlight
                        style={styles.tipButton}
                        activeOpacity={1}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}
                        onPress={() => {this.props.globalNavigator.push({name: 'loginAndSignUp', configureScene: Navigator.SceneConfigs.FloatFromBottom})}}>
                        <Text style={{textAlign: 'center'}}>走,去登录</Text>
                    </TouchableHighlight>
                </View>
            )
        }
        else {
            mainView = (
                <ListView
                    ref={(list) => this._list = list}
                    style={styles.CardsFlow}
                    dataSource={this.dataSource = this.dataSource.cloneWithRows(this.props.pageData.get('dataBlob').toJS())}
                    renderSectionHeader={this.renderSection}
                    renderRow={(data) => (<CardsWithAccountBar {...data} key={data.docid} navigator={this.props.navigator} globalNavigator={this.props.globalNavigator}/>)}
                    onEndReachedThreshold={40}
                    onEndReached={FavPageActions.loadMore}
                    renderFooter={() => <LoadingMoreCard/>}
                    initialListSize={6}
                    pageSize={6}
                    automaticallyAdjustContentInsets={false}
                    removeClippedSubviews={true}
                    refreshControl={<RefreshControl
                                         refreshing={this.state.isRefreshing}
                                         onRefresh={this._onRefresh}
                                         tintColor={Constants.color.TIP_LOADING_FONT}
                                         title={this.state.isRefreshing ? "刷新中" : "下拉刷新"}
                                         progressBackgroundColor="#000"
                                         colors={Constants.color.LOADING_AI_ARRAY}
                                    />}>
                </ListView>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.navigationBar}>
                    <View style={styles.closeButton}/>
                    <Text style={styles.navBatTitle}>关注</Text>
                    <View style={styles.rightButton}/>
                </View>
                {mainView}
            </View>
        )

    },
    _onRefresh         : function () {
        FavPageActions.refresh();
        this.setState({isRefreshing: true})
    },
});


module.exports = FavPage;