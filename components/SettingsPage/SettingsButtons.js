var React = require('react-native');
const Constants = require('../../constants/Constants');

var {
        View,
        Text,
        SwitchIOS,
        TouchableHighlight,
        StyleSheet,
        } = React;

const styles = StyleSheet.create({
    settingWithNavigatorPush: {
        flexDirection  : 'row',
        justifyContent : 'flex-start',
        alignItems     : 'center',
        backgroundColor: '#FFF',
        paddingLeft    : 10,
        paddingRight   : 10,
        marginLeft     : 10,
        marginRight    : 10,
        borderStyle    : 'solid',
        borderColor    : Constants.color.CARD_BORDER_GREY,
        height         : 45,
        borderTopWidth : Constants.style.hairLineWidth,
    },
    settingWithSwitch       : {
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center',
        backgroundColor: '#FFF',
        paddingLeft    : 10,
        paddingRight   : 10,
        marginLeft     : 10,
        marginRight    : 10,
        borderStyle    : 'solid',
        borderColor    : Constants.color.CARD_BORDER_GREY,
        height         : 45,
        borderTopWidth : Constants.style.hairLineWidth,
    },
    settingText             : {
        fontSize  : 17,
        color     : '#000',
        textAlign : 'center',
        fontWeight: '200',
        flex      : 0
    },
    settingSwitch           : {
        flex: 0,
        left: 0
    },
});

var SettingWithNavigatorPush = React.createClass({
    render: function () {
        var finalStyle = [styles.settingWithNavigatorPush];
        this.props.style && finalStyle.push(this.props.style);
        return (
            <TouchableHighlight
                style={finalStyle}
                underlayColor={Constants.color.TOUCH_UNDERLAY_GREY}
                onPress={()=>{
                    if(this.props.isNeedLogIn) {
                        this.props.navigator.push({name: 'loginAndSignUp', configureScene: React.Navigator.SceneConfigs.FloatFromBottom})
                    } else {
                        this.props.navigator.push(this.props.route);
                    }
                }}>
                <Text style={styles.settingText}>{this.props.text}</Text>
            </TouchableHighlight>
        );
    }
});

var SettingWithSwitch = React.createClass({
    render: function () {
        var finalStyle = [styles.settingWithSwitch];
        this.props.style && finalStyle.push(this.props.style);
        return (
            <View style={finalStyle}>
                <Text style={styles.settingText}>{this.props.text}</Text>
                <SwitchIOS/>
            </View>
        );
    }
});

module.exports = {
    SettingWithNavigatorPush: SettingWithNavigatorPush,
    SettingWithSwitch       : SettingWithSwitch
};