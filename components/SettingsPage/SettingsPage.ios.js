/**
 * 设置页面
 * @type {ReactNative|exports|module.exports}
 */

var React = require('react-native');
var CustomConfigureScene = require('../../utilities/CustomConfigureScene');
var SettingWithSwitch = require('./SettingsButtons').SettingWithSwitch;
var SettingWithNavigatorPush = require('./SettingsButtons').SettingWithNavigatorPush;
var FavList = require('./FavList');
var LoginAndSignUp = require('./LoginAndSignUp');
var UserDataActions = require('../../actions/UserDataActions');
const Constants = require('../../constants/Constants');
const Configs = require('../../configs');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var NavigationBarStyle = require('../../utilities/NavigationBarStyle');

var {
        View,
        Text,
        Image,
        ScrollView,
        Navigator,
        StyleSheet,
        AlertIOS,
        TouchableHighlight,
        ActionSheetIOS
        } = React;


const styles = StyleSheet.create({
    navPageContainer    : {
        flex           : 1,
        backgroundColor: Constants.color.SETTING_BACKGROUND,
    },
    settingsScrollView  : {},
    settingHome         : {
        flex                : 1,
        borderTopLeftRadius : 10,
        borderTopRightRadius: 10,
        backgroundColor     : Constants.color.SETTING_BACKGROUND,
        flexDirection       : 'column',
        justifyContent      : 'flex-start',
        alignItems          : 'stretch'
    },
    topWidget           : {
        flex             : 0,
        height           : 250,
        flexDirection    : 'row',
        justifyContent   : 'flex-start',
        alignItems       : 'flex-end',
        borderBottomWidth: Constants.style.hairLineWidth,
        borderColor      : Constants.color.CARD_BORDER_GREY,
        borderStyle      : 'solid'
    },
    backgroundImg       : {
        width         : 710,
        height        : 400,
        flex          : 1,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems    : 'flex-end',
        paddingBottom : 30,
    },
    userInfo         : {
        height         : 120,
        width          : 100,
        flexDirection  : 'column',
        justifyContent : 'flex-start',
        alignItems     : 'center',
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
    },
    userIcon         : {
        width       : 100,
        height      : 100,
        borderRadius: 50,
    },
    userName         : {
        fontSize : 18,
        fontWeight: '400',
        color    : '#FFF',
        textAlign: 'center',
        marginTop: 10
    },
    settingSegmentTitle : {
        fontSize    : 11,
        marginBottom: 15,
        marginLeft  : 15,
        marginTop   : 15
    },
    settingSegmentFooter: {
        fontSize    : 9,
        marginBottom: 15,
        marginLeft  : 15,
        marginTop   : 15
    },
    settingRowsContainer: {
        backgroundColor  : '#FFF',
        borderColor      : Constants.color.CARD_BORDER_GREY,
        borderStyle      : 'solid',
        borderTopWidth   : Constants.style.hairLineWidth,
        borderBottomWidth: Constants.style.hairLineWidth
    },
    withoutTopBorder    : {
        borderTopWidth: 0,
    },
    pageContent         : {
        flex             : 1,
        flexDirection    : 'column',
        justifyContent   : 'center',
        alignItems       : 'center',
        paddingHorizontal: 20,
        marginTop        : -20,
        backgroundColor  : '#FFF'
    },
    logo                : {
        width          : 100,
        height         : 100,
        borderRadius   : 50,
        flex           : 0,
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        alignSelf      : 'center',
        marginTop      : -30,
        marginBottom   : 10
    },
    ...NavigationBarStyle
});

var SettingsPage = React.createClass({
    mixins         : [PureRenderMixin],
    getInitialState: function () {
        var date = new Date();
        return {
            name            : 'settingHome',
            backgroundImgURL: `${Configs.settingPageBackgroundImg()}?date=${Date.parse(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)}`
        };
    },
    render         : function () {
        return (
            <Navigator
                initialRoute={{name: 'settingHome'}}
                renderScene={this.renderScene}
                sceneStyle={styles.navPageContainer}
                configureScene={(route) => {
                    if(route.name == 'user') {
                        return Navigator.SceneConfigs.FloatFromBottomAndroid;
                    } else {
                        return CustomConfigureScene.NavigatorScenePushFromRightIOS;
                    }
                }}/>
        );
    },
    renderScene    : function (route, navigator) {
        switch (route.name) {
            case 'settingHome':
                return (
                    <View style={styles.settingHome}>
                        <ScrollView
                            style={styles.settingsScrollView}
                            automaticallyAdjustContentInsets={false}>
                            <View style={styles.topWidget}>
                                <Image style={styles.backgroundImg}
                                       key={Configs.settingPageBackgroundImg()}
                                       source={{uri: this.state.backgroundImgURL}}
                                       resizeMode='cover'
                                       defaultSource={require('../../img/white.png')}>
                                    <UserInfo isNeedLogIn={this.props.userData.get('isNeedLogIn')}
                                              userName={this.props.userData.get('userName')}
                                              userIcon={this.props.userData.get('userIcon')}
                                              navigator={this.props.globalNavigator}
                                    />
                                </Image>
                            </View>

                            <Text style={styles.settingSegmentTitle}>个人设置</Text>
                            <View style={styles.settingRowsContainer}>
                                {
                                    //<SettingWithNavigatorPush
                                    //route={{name: 'test'}}
                                    //isNeedLogIn={this.props.userData.get('isNeedLogIn')}
                                    //navigator={this.props.globalNavigator}
                                    //style={styles.withoutTopBorder}
                                    //text='账号设置'/>
                                }
                                <View style={styles.settingRowsContainer}>
                                    <SettingWithNavigatorPush
                                        text='关注列表'
                                        route={{name: 'loveList', configureScene: Navigator.SceneConfigs.FloatFromBottom}}
                                        isNeedLogIn={this.props.userData.get('isNeedLogIn')}
                                        navigator={this.props.globalNavigator}
                                        style={styles.withoutTopBorder}/>
                                </View>
                            </View>
                            {
                                /*<Text style={styles.settingSegmentTitle}>通知与推送</Text>
                                 <View style={styles.settingRowsContainer}>
                                 <SettingWithSwitch style={styles.withoutTopBorder} text='通知'/>
                                 <SettingWithNavigatorPush route={{name: 'test'}} navigator={navigator} text='推送设置'/>
                                 </View>
                                 <Text style={styles.settingSegmentFooter}>
                                 您已经打开了通知功能。如需要关闭，情前往 设置->通用->通知 中手动关闭
                                 </Text>*/
                            }
                            <Text style={styles.settingSegmentTitle}>其他</Text>
                            <View style={styles.settingRowsContainer}>
                                <SettingWithNavigatorPush navigator={navigator} route={{name: 'openSourceList'}}
                                                          text='开源组件'/>
                                <SettingWithNavigatorPush navigator={navigator} route={{name: 'about'}} text='关于'/>
                            </View>
                        </ScrollView>
                    </View>
                );
            case 'test':
                return (
                    <TestPage navigator={navigator}/>
                );
            case 'openSourceList':
                return (
                    <OpenSourceList navigator={navigator}/>
                );
            case 'about':
                return (
                    <About navigator={navigator}/>
                );
        }
    }
});

var UserInfo = React.createClass({
    render  : function () {
        return (
            <View style={styles.userInfo}>
                <TouchableHighlight
                    underlayColor={Constants.color.OPACITY_BACKGROUND}
                    onPress={this._onPress}
                >
                    <Image style={styles.userIcon}
                           key="userIcon"
                           source={this.props.userIcon ? {uri: this.props.userIcon} : require('../../img/white.png')}/>
                </TouchableHighlight>
                <Text style={styles.userName}>
                    {this.props.isNeedLogIn ? '登录/注册' : this.props.userName}
                </Text>
            </View>
        )
    },
    _onPress: function () {
        if (this.props.isNeedLogIn) {
            this.props.navigator.push({name: 'loginAndSignUp', configureScene: Navigator.SceneConfigs.FloatFromBottom})
        }
        else {
            ActionSheetIOS.showActionSheetWithOptions({
                    options               : ['注销', '取消'],
                    cancelButtonIndex     : 1,
                    destructiveButtonIndex: 0
                },
                (buttonIndex) => {
                    if (buttonIndex === 0) {
                        UserDataActions.logOut();
                    }
                })
        }
    }
});

var OpenSourceList = React.createClass({
    render: function () {
        return (
            <View style={styles.navPageContainer}>
                <View style={styles.navigationBar}>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={()=>{this.props.navigator.pop()}}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}>
                        <Image source={require('../../img/back.png')} style={{height: 20, width: 20}}/>
                    </TouchableHighlight>
                    <Text
                        numberOfLines={1}
                        style={styles.navBatTitle}>
                        开源组件
                    </Text>
                </View>
                <ScrollView
                    style={[styles.settingsScrollView, {marginBottom: 49,paddingTop: 10, backgroundColor: '#FFF', flex: 1}]}
                    alwaysBounceVertical={false}
                    automaticallyAdjustContentInsets={true}>
                    <View style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 17}}>
                            {'React-Native\n'}
                        </Text>
                        <Text>
                            {`Copyright (c) 2014-2015, Facebook, Inc. All rights reserved.\nBSD licensed\n`}
                        </Text>
                        <Text style={{fontSize: 17}}>
                            {`Immutable.JS\n`}
                        </Text>
                        <Text>
                            {`Copyright (c) 2014-2015, Facebook, Inc. All rights reserved.\nBSD licensed\n`}
                        </Text>
                        <Text style={{fontSize: 17}}>
                            {`Flux\n`}
                        </Text>
                        <Text>
                            {`Copyright (c) 2014-2015, Facebook, Inc. All rights reserved.\nBSD licensed\n`}
                        </Text>
                        <Text style={{fontSize: 17}}>
                            {`node-md5\n`}
                        </Text>
                        <Text>
                            {`Copyright © 2009, Jeff Mott. All rights reserved.\nCopyright © 2011, Paul Vorbach. All rights reserved.BSD-3-Clause licensed\nhttps://github.com/pvorb/node-md5\n`
                            }
                        </Text>
                        <Text style={{fontSize: 17}}>
                            {`node-sha1\n`}
                        </Text>
                        <Text>
                            {`BSD-3-Clause license\nCopyright © 2011-2015, Paul Vorbach.\nCopyright © 2009, Jeff Mott.\n`}
                        </Text>
                        <Text style={{fontSize: 17}}>
                            {`react-native-quick-actions\n`}
                        </Text>
                        <Text>
                            {
                                `Copyright (c) 2015 Jordan Byron (http://github.com/jordanbyron/)
    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"), to deal in the Software
    without restriction, including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
    to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or
    substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
    FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
    https://github.com/jordanbyron/react-native-quick-actions`}
                        </Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
});


var About = React.createClass({
    render: function () {
        return (
            <View style={styles.navPageContainer}>
                <View style={styles.navigationBar}>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={()=>{this.props.navigator.pop()}}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}>
                        <Image source={require('../../img/back.png')} style={{height: 20, width: 20}}/>
                    </TouchableHighlight>
                    <Text
                        numberOfLines={1}
                        style={styles.navBatTitle}>
                        关于
                    </Text>
                </View>
                <ScrollView contentContainerStyle={styles.pageContent}>
                    <View style={styles.logo}>
                        <Image
                            style={{width: 100, height: 100}}
                            source={require('../../img/icon.png')}/>
                    </View>
                    <Text style={{fontSize: 20, fontWeight: '800', marginBottom: 20}}>看西电</Text>
                    <Text>一处看遍西电事</Text>
                </ScrollView>
            </View>
        )
    }
});


module.exports = SettingsPage;
