var React = require('react-native');
const Constants = require('../../constants/Constants');
const Configs = require('../../configs');
var UserDataActions = require('../../actions/UserDataActions');
var NavigationBarStyle = require('../../utilities/NavigationBarStyle');

var {
        View,
        Text,
        Image,
        ScrollView,
        SwitchIOS,
        TouchableHighlight,
        StyleSheet,
        ActivityIndicatorIOS,
        AlertIOS,
        InteractionManager,
        } = React;

const styles = StyleSheet.create({
    container        : {
        flex           : 1,
        backgroundColor: Constants.color.SETTING_BACKGROUND,
    },
    ...NavigationBarStyle,
    settingText      : {
        fontSize  : 17,
        color     : '#000',
        textAlign : 'center',
        fontWeight: '200',
        flex      : 0
    },
    settingSwitch    : {
        flex: 0,
        left: 0
    },
    settingIcon      : {
        width       : 40,
        height      : 40,
        borderRadius: 20,
        flex        : 0
    },
    settingWithSwitch: {
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center',
        backgroundColor: '#FFF',
        paddingLeft    : 30,
        paddingRight   : 10,
        borderStyle    : 'solid',
        borderColor    : Constants.color.CARD_BORDER_GREY,
        height         : 45,
        borderTopWidth : Constants.style.hairLineWidth,
    },
});
var favList = [];
var FavList = React.createClass({
    wholeList                : [],
    componentWillReceiveProps: function (nP) {
        if (nP.result === 'success') {
            this.props.navigator.pop();
        }
        else if (nP.result) {
            AlertIOS.alert(
                '出错啦',
                nP.result,
                [
                    {
                        text: '朕知道了...', onPress: () => {
                        this.setState({isProgressing: false})
                    }
                    },
                ]
            )
        }
    },
    getInitialState          : function () {
        return {
            isLoading    : true,
            isProgressing: false,
            isNavigating : true
        }
    },
    componentDidMount        : function () {
        favList = this.props.favList;
        InteractionManager.runAfterInteractions(() => {
            this.setState({isNavigating: false})
        });
        fetch(Configs.allListURL())
            .then((res) => res.json())
            .then((data) => {
                this.wholeList = data.items;
                this.setState({isLoading: false})
            });
    },
    render                   : function () {
        return (
            <View style={styles.container}>
                <View style={styles.navigationBar}>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={()=>{this.props.navigator.pop()}}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}>
                        <Image source={require('../../img/cancel.png')} style={{height: 20, width: 20}}/>
                    </TouchableHighlight>
                    <Text
                        numberOfLines={1}
                        style={styles.navBatTitle}>
                        关注列表
                    </Text>
                    {
                        this.state.isLoading && !this.state.isNavigating ?
                            <View style={styles.rightButton}/> :
                            <TouchableHighlight
                                style={styles.rightButton}
                                onPress={()=>{this._saveList()}}
                                underlayColor={Constants.color.OPACITY_BACKGROUND}>
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    {
                                        this.state.isProgressing ?
                                            <ActivityIndicatorIOS style={{marginRight: 10}}/> :
                                            <Text style={styles.rightButtonText}>保存</Text>
                                    }
                                </View>
                            </TouchableHighlight>
                    }
                </View>
                {
                    this.state.isLoading || this.state.isNavigating ?
                        <ActivityIndicatorIOS
                            animating={this.state.loading}
                            size="small"
                            style={{marginTop: 100}}
                        /> :
                        <ScrollView
                            style={[styles.settingsScrollView, {paddingTop: 30}]}
                            alwaysBounceVertical={false}
                            automaticallyAdjustContentInsets={false}>
                            <View style={styles.settingRowsContainer}>
                                {this.wholeList.map(this._renderRow)}
                            </View>
                        </ScrollView>
                }
            </View>
        );
    },
    _renderRow               : function (row, count) {
        var finalStyle = [styles.settingWithSwitch];
        count == 0 && finalStyle.push(styles.withoutTopBorder);
        return (
            <FavListRow
                {...row}
                key={row.accountname}
                finalStyle={finalStyle}
                _onSwitchChange={this._onSwitchChange}
                state={this.props.favList.indexOf(row.accountname) != -1}/>
        )
    },
    _onSwitchChange          : function (value, name) {
        if (!value) favList.splice(favList.indexOf(name), 1);
        else favList.push(name);
    },
    _saveList                : function () {
        this.setState({isProgressing: true});
        UserDataActions.saveFavList(favList);
    }
});

var FavListRow = React.createClass({
    getInitialState  : function () {
        return {
            state: true
        };
    },
    componentDidMount: function () {
        this.setState({
            state: this.props.state
        })
    },
    render           : function () {
        return (
            <View
                style={this.props.finalStyle}>
                <Image style={styles.settingIcon} resizeMode='cover' source={{uri: this.props.accountimg}}/>
                <Text style={styles.settingText}>{this.props.accountname}</Text>
                <SwitchIOS
                    style={styles.settingSwitch}
                    onValueChange={(value) => {
                        this.setState({
                            state: !this.state.state
                        });
                        this.props._onSwitchChange(value, this.props.accountname);
                    }}
                    value={this.state.state}
                />
            </View>
        );
    }
});

module.exports = FavList;