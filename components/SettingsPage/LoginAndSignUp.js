var React = require('react-native');
var UserDataActions = require('../../actions/UserDataActions');
const Constants = require('../../constants/Constants');
var NavigationBarStyle = require('../../utilities/NavigationBarStyle');

var {
        View,
        TextInput,
        Text,
        TouchableHighlight,
        StyleSheet,
        Navigator,
        Image,
        ScrollView,
        ActivityIndicatorIOS,
        AlertIOS,
        } = React;

const styles = StyleSheet.create({
    container      : {
        flex           : 1,
        backgroundColor: '#FFF',
        overflow       : 'visible'
    },
    ...NavigationBarStyle,
    inputBox       : {
        borderBottomWidth: Constants.style.hairLineWidth,
        borderBottomColor: Constants.color.CARD_BORDER_GREY,
        borderStyle      : 'solid',
        flexDirection    : 'row',
        justifyContent   : 'flex-start',
        alignItems       : 'center',
    },
    input          : {
        flex  : 1,
        height: 20
    },
    inputTip       : {
        flex       : 0,
        fontSize   : 17,
        marginRight: 5
    },
    submit         : {
        backgroundColor: 'rgba(0,65,130,0.2)',
        height         : 30,
        flexDirection  : 'row',
        alignItems     : 'center',
        justifyContent : 'center',
        borderRadius   : 5
    },
    submitText     : {
        flex       : 1,
        textAlign  : 'center',
        marginRight: 10
    },
    pageContent    : {
        flex             : 1,
        flexDirection    : 'column',
        justifyContent   : 'center',
        alignItems       : 'stretch',
        paddingHorizontal: 20,
        marginTop        : -20
    },
    logo           : {
        width          : 100,
        height         : 100,
        borderRadius   : 50,
        flex           : 0,
        backgroundColor: Constants.color.OPACITY_BACKGROUND,
        alignSelf      : 'center',
        marginTop      : -30,
        marginBottom   : 30
    },
    errTip         : {
        marginVertical: 5,
    }
});

var LoginAndSignUp = React.createClass({
    render     : function () {
        return (
            <Navigator
                renderScene={this.renderScene}
                initialRoute={{name: 'login'}}
                configureScene={(route, stack) => {if(route.name == 'loading') return Navigator.SceneConfigs.FloatFromBottom}}
            />
        )
    },
    renderScene: function (route, navigator) {
        switch (route.name) {
            case 'login':
                return (
                    <Login navigator={this.props.navigator}
                           LASNavigator={navigator}
                           globalNavigator={this.props.globalNavigator}
                           result={this.props.result}
                    />
                );
            case 'signUp':
                return (
                    <SignUp
                        navigator={this.props.navigator}
                        LASNavigator={navigator}
                        result={this.props.result}
                        globalNavigator={this.props.globalNavigator}/>
                );
        }
    }
});

var Login = React.createClass({
    _inputs : [],
    userName: null,
    password: null,

    getInitialState          : function () {
        return {
            isUserNameOK : false,
            isProgressing: false
        }
    },
    componentWillReceiveProps: function (nP) {
        if (nP.result === 'success') {
            this.props.navigator.pop()
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
    render                   : function () {
        return (
            <View style={styles.container}>
                <View style={styles.navigationBar}>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={()=>{if(!this.state.isProgressing)this.props.navigator.pop()}}
                        underlayColor={Constants.color.OPACITY_BACKGROUND}>
                        <Image source={require('../../img/cancel.png')} style={{height: 20, width: 20}}/>
                    </TouchableHighlight>
                    <Text style={styles.navBatTitle}>登录</Text>
                    <TouchableHighlight
                        style={styles.rightButton}
                        onPress={()=>{if(!this.state.isProgressing)this.props.LASNavigator.replace({name: 'signUp'})}}
                        underlayColor={Constants.color.OPACITY_BACKGROUND}>
                        <Text style={styles.rightButtonText}>我要注册</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView contentContainerStyle={styles.pageContent}>
                    <View style={styles.logo}>
                        <Image
                            style={{width: 100, height: 100}}
                            source={require('../../img/icon.png')}/>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTip}>帐号</Text>
                        <TextInput
                            ref={(input) => {this._inputs[0] = input}}
                            autoCapitalize="none"
                            style={styles.input}
                            autoCorrect={false}
                            onChangeText={(str) => {this.userName = str}}
                            onEndEditing={() => {this.setState({isUserNameOK: checkUserName(this.userName) || checkEmail(this.userName)})}}
                            placeholder="用户名/邮箱"
                        />
                    </View>
                    <View style={styles.errTip}>
                        <Text style={{color: 'red'}}>
                            {!this.userName || this.state.isUserNameOK ? null : "账户格式错误"}
                        </Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTip}>密码</Text>
                        <TextInput
                            ref={(input) => {this._inputs[1] = input}}
                            autoCapitalize="none"
                            style={styles.input}
                            autoCorrect={false}

                            secureTextEntry={true}
                            onChangeText={(str) => {this.password = str}}
                            placeholder="密码"
                        />
                    </View>
                    <View style={styles.errTip}><Text>{null}</Text></View>
                    <TouchableHighlight
                        style={styles.submit}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_BLUE}
                        onPress={this._onPress}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            {
                                this.state.isProgressing ?
                                    <ActivityIndicatorIOS/> :
                                    <Text style={styles.submitText}>登录</Text>
                            }
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        )
    },
    _onPress                 : function () {
        this._inputs.forEach(el => {
            el.blur()
        });
        if (this.state.isUserNameOK) {
            this.setState({isProgressing: true});
            UserDataActions.logIn({
                userName: this.userName,
                password: this.password
            })
        }
    }
});

var SignUp = React.createClass({
    _inputs                  : [],
    userName                 : null,
    email                    : null,
    password                 : null,
    confirmPassword          : null,
    getInitialState          : function () {
        return {
            isUserNameOK       : false,
            isPasswordOK       : false,
            isEmailOK          : false,
            isConfirmPasswordOK: false,
            isProgressing      : false
        }
    },
    componentWillReceiveProps: function (nP) {
        if (nP.result === 'success') {
            this.props.navigator.pop()
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
    render                   : function () {
        return (
            <View style={styles.container}>
                <View style={styles.navigationBar}>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={()=>{if(!this.state.isProgressing) this.props.navigator.pop()}}
                        underlayColor={Constants.color.OPACITY_BACKGROUND}>
                        <Image source={require('../../img/cancel.png')} style={{height: 20, width: 20}}/>
                    </TouchableHighlight>
                    <Text style={styles.navBatTitle}>注册</Text>
                    <TouchableHighlight
                        style={styles.rightButton}
                        onPress={()=>{if(!this.state.isProgressing) this.props.LASNavigator.replace({name: 'login'})}}
                        underlayColor={Constants.color.OPACITY_BACKGROUND}>
                        <Text style={styles.rightButtonText}>我要登录</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={styles.pageContent}>
                    <View style={styles.logo}>
                        <Image
                            style={{width: 100, height: 100}}
                            source={require('../../img/icon.png')}/>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTip}>帐号</Text>
                        <TextInput
                            ref={(input) => {this._inputs[0] = input}}
                            style={styles.input}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={(str) => {this.userName = str}}
                            onEndEditing={() => {this.setState({isUserNameOK: checkUserName(this.userName)})}}
                            placeholder="用户名"
                        />
                    </View>
                    <View style={styles.errTip}>
                        <Text style={{color: 'red'}}>
                            {!this.userName || this.state.isUserNameOK ? null : "长度为零的用户名肯定是不对的!"}
                        </Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTip}>邮箱</Text>
                        <TextInput
                            ref={(input) => {this._inputs[1] = input}}
                            style={styles.input}
                            autoCorrect={false}
                            autoCapitalize="none"

                            onChangeText={(str) => {this.email = str}}
                            onEndEditing={() => {this.setState({isEmailOK: checkEmail(this.email)})}}
                            placeholder="example@example.com"
                        />
                    </View>
                    <View style={styles.errTip}>
                        <Text style={{color: 'red'}}>
                            {!this.email || this.state.isEmailOK ? null : "邮箱格式错误"}
                        </Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTip}>密码</Text>
                        <TextInput
                            ref={(input) => {this._inputs[2] = input}}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(str) => {this.password = str}}
                            onEndEditing={() => {this.setState({isPasswordOK: checkPassword(this.password)})}}
                            placeholder="密码要以字母开头哦"
                        />
                    </View>
                    <View style={styles.errTip}>
                        <Text style={{color: 'red'}}>
                            {!this.password || this.state.isPasswordOK ? null : "密码只能包含大小写字母,数字,下划线和感叹号,不超过16位"}
                        </Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTip}>确认密码</Text>
                        <TextInput
                            ref={(input) => {this._inputs[3] = input}}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(str) => {this.confirmPassword = str}}
                            onEndEditing={() => {this.setState({isConfirmPasswordOK: this.password === this.confirmPassword})}}
                            placeholder="再次输入你的密码"
                        />
                    </View>
                    <View style={styles.errTip}>
                        <Text style={{color: 'red'}}>
                            {!this.confirmPassword || this.state.isConfirmPasswordOK ? null : "两次密码不一样啊!"}
                        </Text>
                    </View>
                    <TouchableHighlight
                        style={styles.submit}
                        underlayColor={Constants.color.TOUCH_UNDERLAY_BLUE}
                        onPress={this._onPress}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            {
                                this.state.isProgressing ?
                                    <ActivityIndicatorIOS/> :
                                    <Text style={styles.submitText}>注册</Text>
                            }
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        )
    },
    _onPress                 : function () {
        this._inputs.forEach(el => {
            el.blur()
        });
        if (this.state.isUserNameOK && this.state.isPasswordOK && this.state.isEmailOK && this.state.isConfirmPasswordOK) {
            this.setState({isProgressing: true});
            UserDataActions.signUP({
                userName: this.userName,
                password: this.password,
                email   : this.email
            })
        }
    }
});

function checkUserName(str) {
    //var usernameCheckReg = /^[a-zA-Z0-9_]{3,16}$/;
    //return usernameCheckReg.test(str);
    return str.length > 0;
}

function checkEmail(str) {
    var emailCheckReg = /^[0-9a-z][a-z0-9._-]*@[a-z0-9-]+[a-z0-9].[a-z.]+[a-z]$/;
    return emailCheckReg.test(str);
}

function checkPassword(str) {
    var passwordReg = /^[a-zA-Z][a-z0-9A-Z_!]{2,15}/;
    return passwordReg.test(str);
}

module.exports = LoginAndSignUp;