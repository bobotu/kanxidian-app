var React = require('react-native');
var NavigationBarStyle = require('../../utilities/NavigationBarStyle');
const Constants = require('../../constants/Constants');
var {
        StyleSheet,
        View,
        Text,
        WebView,
        TouchableHighlight,
        ActivityIndicatorIOS,
        Image,
        InteractionManager,
        } = React;

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        backgroundColor: '#FFF',
    },
    ...NavigationBarStyle
});

var KxdWebView = React.createClass({
    getInitialState  : function () {
        return {
            isNavigating: true
        }
    },
    componentDidMount: function () {
        InteractionManager.runAfterInteractions(() => {
            this.setState({isNavigating: false})
        });
    },
    render           : function () {
        return (
            <View
                style={styles.container}
                onResponderTerminationRequest={() => true}>
                <View style={styles.navigationBar}>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={()=>{this.props.navigator.pop()}}
                        underlayColor={Constants.color.OPACITY_BACKGROUND}
                    >
                        <Image source={require('../../img/back.png')} style={{height: 20, width: 20}}/>
                    </TouchableHighlight>
                    <Text
                        style={styles.navBatTitle}>
                        看西电-微信文章
                    </Text>
                    <View style={styles.rightButton}/>
                </View>
                {
                    this.state.isNavigating ?
                        <ActivityIndicatorIOS
                            style={{marginTop: 90}}
                            size="small"
                        /> :
                        <WebView
                            ref={(web) => this._web = web}
                            bounces={true}
                            startInLoadingState={true}
                            scalesPageToFit={false}
                            source={{uri: this.props.url}}
                            renderLoading={()=>
                                <View style={{flex:1, backgroundColor: '#FFF'}}>
                                    <ActivityIndicatorIOS
                                        style={{marginTop: 90}}
                                        size="small"
                                    />
                                </View>
                            }
                            style={styles.webView}>
                        </WebView>
                }
            </View>
        )
    },
});

module.exports = KxdWebView;