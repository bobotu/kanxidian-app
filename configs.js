var Configs = {
    homePageURL             : function (page) {
        return `http://kxd_server.leanapp.cn/index?p=${page}`;
    },
    allListURL              : function () {
        return `http://kxd_server.leanapp.cn/allaccounts`;
    },
    favPageURL              : function (page) {
        return `https://kxd_server.leanapp.cn/user/favlist?p=${page}`
    },
    accountPageURL          : function (name, page) {
        return `http://kxd_server.leanapp.cn/account?accountname=${encodeURI(name)}&p=${page}`;
    },
    settingPageBackgroundImg: function () {
        return `http://area.sinaapp.com/bingImg/`;
    },
    userURL                 : function () {
        return `https://kxd_server.leanapp.cn/user`
    },
    searchURL               : function (keywords, sid) {
        if(sid) return `https://leancloud.cn/1.1/search/select?q=${encodeURI(keywords)}&limit=${6}&fields=nature_context&highlights=${encodeURI("nature_context")}&sid=${sid}&order=-date`;
        else    return `https://leancloud.cn/1.1/search/select?q=${encodeURI(keywords)}&limit=${6}&fields=nature_context&highlights=${encodeURI("nature_context")}&order=-date`;
    },
    appID                   : '0Xt6qJcKnQNag8gOapOAfr3m',
    appKEY                  : 'lWmbPh7EfPwOsVleUbhY6nre'
};

module.exports = Configs;