var React = require('react-native');
var Cards = require('../Cards/Cards').CardsWithoutAccountBar;
var LoadingMoreCard = require('../Cards/Cards').LoadingMoreCard;
const Constants = require('../../constants/Constants');
var AccountPageActions = require('../../actions/AccountPageActions');
var shallowEqual = require('fbjs/lib/shallowEqual');

var {
        ListView,
        TouchableHighlight,
        Image,
        Text,
        ActivityIndicatorIOS,
        View,
        StyleSheet,
        RefreshControl,
        InteractionManager,
        LayoutAnimation
        } = React;

const styles = StyleSheet.create({
    container                  : {
        flex: 1,
    },
    CardsFlow                  : {
        backgroundColor  : '#FFF',
        paddingHorizontal: 10
    },
    sectionHeader              : {
        flexDirection          : 'row',
        justifyContent         : 'flex-start',
        alignItems             : 'center',
        backgroundColor        : Constants.color.LIST_SECTION_HEADER_BACKGROUND,
        borderBottomLeftRadius : 5,
        borderBottomRightRadius: 5,
        marginLeft             : -10,
        marginRight            : -10
    },
    sectionTitle               : {
        marginLeft: 10,
        textAlign : 'center'
    },
    accountTopBar              : {
        height         : 190,
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'flex-end',
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        position       : 'relative'
    },
    topBarBackgroundImg        : {
        paddingTop: Constants.style.STATUS_BAR_HEIGHT,
        height         : 190,
        flex           : 1,
        flexDirection  : 'column',
        justifyContent : 'flex-end',
        alignItems     : 'center',
        paddingBottom  : 30,
        backgroundColor: Constants.color.NAVIGATION_BAR_BACKGROUND
    },
    accountImg                 : {
        width       : 100,
        height      : 100,
        borderRadius: 50,
        marginBottom: 15
    },
    accountName                : {
        fontSize : 15,
        color    : '#000',
        textAlign: 'center'
    },
    closeButton                : {
        position       : 'absolute',
        top            : 10,
        left           : 5,
        alignSelf      : 'flex-start',
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        flex           : 0,
        width          : 40,
        height         : 40,
        flexDirection  : 'row',
        alignItems     : 'flex-end',
        justifyContent : 'center',
    },
    accountTopBarScrolled      : {
        height         : 90,
        flexDirection  : 'row',
        justifyContent : 'center',
        alignItems     : 'center',
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        position       : 'relative',
    },
    accountImgScrolled         : {
        width       : 100,
        height      : 100,
        borderRadius: 50,
        transform   : [{scale: 0.6}],
        marginLeft  : 40,
    },
    accountNameScrolled        : {
        fontSize : 17,
        color    : '#000',
        textAlign: 'center',
    },
    topBarBackgroundImgScrolled: {
        paddingTop: Constants.style.STATUS_BAR_HEIGHT,
        height         : 90,
        flex           : 1,
        flexDirection  : 'row',
        justifyContent : 'flex-start',
        alignItems     : 'center',
        backgroundColor: Constants.color.NAVIGATION_BAR_BACKGROUND
    },
});

var dateReg = /([0-9]{1,4})[-|年]([0-9]{1,2})[-|月]([0-9]{1,2})[日]?/i;

var AccountPage = React.createClass({
    _id                  : null,
    dataSource           : new ListView.DataSource({
        getSectionHeaderData   : function (dataBlob, sectionID) {
            return sectionID.replace(dateReg, '$1年$2月$3日');
        },
        getRowData             : function (dataBlob, sectionID, RowID) {
            return dataBlob[sectionID][RowID];
        },
        rowHasChanged          : (pRow, nRow) => pRow.docid != nRow.docid,
        sectionHeaderHasChanged: (pSec, nSec) => pSec != nSec,
    }),
    getInitialState      : function () {
        return {
            isRefreshing: false,
            isNavigating: true,
            isScrolled  : false,
        }
    },
    componentDidUpdate   : function (nP, nS) {
        if (this.state.isRefreshing && nP.accountPageData != this.props.accountPageData) {
            this.setState({isRefreshing: false});
        }
    },
    componentWillMount   : function () {
        this._id = `${this.props.name}&${Date.now()}`;
        AccountPageActions.init(this._id);
    },
    componentDidMount    : function () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({isNavigating: false})
        });
    },
    componentWillUnmount : function () {
        AccountPageActions.del(this._id);
    },
    renderRow            : function (data) {
        return (
            <Cards {...data} key={data.docid} navigator={this.props.navigator}
                             globalNavigator={this.props.globalNavigator}/>
        )
    },
    renderSection        : function (data) {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {data}
                </Text>
            </View>
        )
    },
    shouldComponentUpdate: function (nextProps, nextStates) {
        return (
            !shallowEqual(this.props.accountPageData.get(this._id), nextProps.accountPageData.get(this._id)) || !shallowEqual(this.state, nextStates)
        )
    },
    render               : function () {
        if (this.props.accountPageData.get(this._id)) {
            var dataBlob   = this.props.accountPageData.getIn([this._id, 'dataBlob']).toJS(),
                sectionIDs = this.props.accountPageData.getIn([this._id, 'sectionIDs']).toJS(),
                rowIDs     = this.props.accountPageData.getIn([this._id, 'rowIDs']).toJS();
        }
        return (
            <View style={styles.container}>
                <View style={this.state.isScrolled ? styles.accountTopBarScrolled: styles.accountTopBar}>
                    <View
                        style={this.state.isScrolled ? styles.topBarBackgroundImgScrolled : styles.topBarBackgroundImg}
                        source={{uri: 'http://img.xiaba.cvimage.cn/4cbb4ebb53cc4a23645e0000.jpg'}}>
                        <TouchableHighlight
                            style={styles.closeButton}
                            onPress={()=>{this.props.navigator.pop()}}
                            underlayColor={Constants.color.OPACITY_BACKGROUND}>
                            <Image source={require('../../img/back.png')} style={{height: 20, width: 20}}/>
                        </TouchableHighlight>
                        {
                            !this.props.accountPageData.get(this._id) || this.state.isNavigating ?
                                <View
                                    style={[styles.accountImg,{backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
                                    <ActivityIndicatorIOS
                                        animating={true}
                                        size="large"
                                    />
                                </View> :
                                <Image style={this.state.isScrolled ? styles.accountImgScrolled : styles.accountImg}
                                       source={{uri: this.props.accountPageData.getIn([this._id, 'accountImg'])}}/>
                        }
                        {
                            !this.props.accountPageData.get(this._id) || this.state.isNavigating ?
                                null :
                                <Text style={this.state.isScrolled ? styles.accountNameScrolled: styles.accountName }>
                                    {this.props.name}
                                </Text>
                        }
                    </View>
                </View>
                {
                    !this.props.accountPageData.get(this._id) || this.state.isNavigating ?
                        <ActivityIndicatorIOS
                            animating={true}
                            size="small"
                        /> :
                        <ListView
                            style={styles.CardsFlow}
                            dataSource={this.dataSource = this.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)}
                            renderSectionHeader={this.renderSection}
                            renderRow={this.renderRow}
                            renderFooter={() => <LoadingMoreCard/>}
                            onEndReachedThreshold={40}
                            initialListSize={6}
                            pageSize={6}
                            automaticallyAdjustContentInsets={false}
                            scrollRenderAheadDistance={40}
                            onEndReached={() => {AccountPageActions.loadMore(this._id)}}
                            removeClippedSubviews={true}
                            onScroll={this._onScroll}
                            refreshControl={<RefreshControl
                                                refreshing={this.state.isRefreshing}
                                                onRefresh={this._onRefresh}
                                                tintColor={Constants.color.TIP_LOADING_FONT}
                                                title={this.state.isRefreshing ? "刷新中" : "下拉刷新"}
                                                progressBackgroundColor="#000"
                                                colors={Constants.color.LOADING_AI_ARRAY}
                            />}/>

                }

            </View>
        );
    },
    _onRefresh           : function () {
        this.setState({isRefreshing: true});
        AccountPageActions.refresh(this._id);
    },
    _onScroll            : function (e) {
        if (e.nativeEvent.contentOffset.y > 40 && !this.state.isScrolled) {
            LayoutAnimation.easeInEaseOut();
            this.setState({isScrolled: true});
        }
        else if (e.nativeEvent.contentOffset.y < 40 && this.state.isScrolled) {
            LayoutAnimation.easeInEaseOut();
            this.setState({isScrolled: false});
        }
    }
});


module.exports = AccountPage;
