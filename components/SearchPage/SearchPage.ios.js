/**
 * 搜索视图
 * TODO:: Flux来实现更细致的状态提示
 * @type {ReactNative|exports|module.exports}
 */

"use strict";

var React = require('react-native');
var Cards = require('../Cards/Cards').CardsWithAccountBar;
var NoMoreCard = require('../Cards/Cards').NoMoreCard;
var LoadingMoreCard = require('../Cards/Cards').LoadingMoreCard;
const Constants = require('../../constants/Constants');
var SearchPageActions = require('../../actions/SearchPageActions');

var {
        ListView,
        StyleSheet,
        ActivityIndicatorIOS,
        View,
        TextInput,
        Text,
        TouchableHighlight,
        Animated
        } = React;

const styles = StyleSheet.create({
    container    : {
        flex: 1,
    },
    CardsFlow    : {
        paddingHorizontal: 10,
        paddingTop       : 5,
    },
    navigationBar: {
        height           : Constants.style.NAV_BAR_HEIGHT + Constants.style.STATUS_BAR_HEIGHT,
        borderStyle      : 'solid',
        borderColor      : Constants.color.CARD_BORDER_GREY,
        borderBottomWidth: Constants.style.hairLineWidth,
        flexDirection    : 'row',
        justifyContent   : 'center',
        alignItems       : 'flex-end',
        paddingLeft      : 20,
        paddingBottom    : 7,
        paddingTop       : Constants.style.STATUS_BAR_HEIGHT,
        backgroundColor  : '#FFF',
        position         : 'relative',
    },
    searchInput  : {
        flex           : 1,
        height         : 30,
        textAlign      : 'center',
        backgroundColor: Constants.color.CARD_BORDER_GREY,
        alignSelf      : 'flex-end',
        borderRadius   : 5,
    },
    closeButton  : {
        position      : 'absolute',
        right         : 5,
        bottom        : 7,
        width         : 40,
        height        : 30,
        flexDirection : 'row',
        alignItems    : 'center',
        justifyContent: 'center',
        overflow      : 'hidden',
    },
    stateView    : {
        flexDirection : 'column',
        justifyContent: 'flex-start',
        alignItems    : 'center',
        marginTop     : 40
    }
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.docid != r2.docid});

var SearchPage = React.createClass({
    _keywords        : null,
    getInitialState  : function () {
        return {
            searchBarMarginRight: new Animated.Value(20),
            closeButtonOpacity  : new Animated.Value(0),
            closeButtonDeg      : new Animated.Value(180),
            isSearching         : false
        }
    },
    componentDidMount: function () {
        Animated
            .sequence([
                Animated.timing(
                    this.state.searchBarMarginRight,
                    {
                        toValue : 50,
                        duration: 200,
                    }),
                Animated.parallel([
                    Animated.timing(
                        this.state.closeButtonOpacity,
                        {
                            toValue : 1,
                            duration: 500
                        }
                    ),
                    Animated.spring(
                        this.state.closeButtonDeg,
                        {
                            toValue: 0,
                        }
                    )
                ])
            ])
            .start();
    },
    componentWillReceiveProps: function(nP) {
        this.setState({isSearching: false});
    },
    render           : function () {
        var MainView = null;
        if (this.state.isSearching) {
            MainView = (
                <View style={styles.stateView}>
                    <ActivityIndicatorIOS/>
                    <Text style={{marginTop: 10}}>搜索中</Text>
                </View>
            )
        }
        else if (this.props.searchPageData.get('dataBlob').size < 1 && this.props.searchPageData.get('isEnded')) {
            MainView = (
                <View style={styles.stateView}>
                    <Text>没有结果</Text>
                </View>
            )
        }
        else {
            MainView = (
                <ListView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={styles.CardsFlow}
                    removeClippedSubviews={true}
                    dataSource={ds = ds.cloneWithRows(this.props.searchPageData.get('dataBlob').toJS())}
                    onEndReached={() => {if(!this.props.searchPageData.get('isEnded')) SearchPageActions.loadMore()}}
                    onScroll={this._onScroll}
                    renderRow={this._renderRow}
                    initialListSize={6}
                    pageSize={6}
                    onEndReachedThreshold={100}
                    automaticallyAdjustContentInsets={false}
                    scrollRenderAheadDistance={40}
                    renderFooter={() => this.props.searchPageData.get('dataBlob').size > 0 ? this.props.searchPageData.get('isEnded') ? <NoMoreCard/> :  <LoadingMoreCard/> : null}
                />
            )
        }
        return (
            <View style={styles.container}>
                <View style={[styles.navigationBar]}>
                    <Animated.View style={{
                                        marginRight: this.state.searchBarMarginRight,
                                        flex       : 1,
                                        height     : 30,
                                        alignSelf  : 'flex-end',
                                        flexDirection: 'row',
                                        justifyContent: 'center'
                                    }}>
                        <TextInput
                            ref={input => {this._input = input}}
                            style={styles.searchInput}
                            onSubmitEditing={() => {this._onSearchPress(this._keywords)}}
                            onChangeText={(text) => {this._keywords = text}}
                            autoFocus={true}
                            placeholder="搜索"
                            placeholderTextColor={Constants.color.SEARCH_BUTTON_FONT}
                            clearButtonMode="while-editing"
                            enablesReturnKeyAutomatically={true}
                            returnKeyType="search"/>
                    </Animated.View>
                    <TouchableHighlight
                        style={[styles.closeButton]}
                        onPress={this._onClosePress}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}>
                        <Animated.Image
                            source={require('../../img/close.png')}
                            style={{
                            height: 25,
                            width: 25,
                            opacity: this.state.closeButtonOpacity,
                            transform: [{rotate: this.state.closeButtonDeg.interpolate({
                                 inputRange: [0,180],
                                 outputRange:['0deg', '180deg']
                            })}]
                            }}/>
                    </TouchableHighlight>
                </View>
                {MainView}
            </View>
        )
    },
    _renderRow       : function (data) {
        if (data.note) {
            return <Text style={{textAlign: 'center', marginTop: 40}}>{data.noteText}</Text>
        }
        else {
            return <Cards {...data} key={data.docid} navigator={this.props.navigator}
                                    globalNavigator={this.props.globalNavigator}/>
        }
    },
    _onClosePress    : function () {
        this._input.blur();
        Animated
            .sequence([
                Animated.timing(
                    this.state.closeButtonOpacity,
                    {
                        toValue : 0,
                        duration: 300
                    }
                ),
                Animated.timing(
                    this.state.searchBarMarginRight,
                    {
                        toValue : 20,
                        duration: 150,
                    }),
            ])
            .start(() => {
                this.props.navigator.pop();
            });
    },
    _onSearchPress   : function (keywords) {
        this.setState({isSearching: true});
        if(keywords.length > 0 && typeof keywords == 'string') {
            SearchPageActions.search(keywords);
        }
    },
    componentWillUnmount: function() {
        SearchPageActions.close();
    }
});


module.exports = SearchPage;