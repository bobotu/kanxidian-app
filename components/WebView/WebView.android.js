var React = require('react-native');
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
                            url={this.props.url}
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