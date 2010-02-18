var getClassName = Y.ClassNameManager.getClassName,
    TABVIEW = 'tabview',
    TAB = 'tab',
    CONTENT = 'content',
    PANEL = 'panel',
    SELECTED = 'selected',
    HIDDEN = 'hidden',
    EMPTY_OBJ = {},
    DOT = '.',

    _classNames = {
        tabview: getClassName(TABVIEW),
        tabviewPanel: getClassName(TABVIEW, PANEL),
        tabviewList: getClassName(TABVIEW, 'list'),
        tab: getClassName(TAB),
        tabLabel: getClassName(TAB, 'label'),
        tabPanel: getClassName(TAB, PANEL),
        selectedTab: getClassName(TAB, SELECTED),
        selectedPanel: getClassName(TAB, PANEL, SELECTED),
        hiddenPanel: getClassName(TAB, PANEL, HIDDEN)
    },

    roles = {
        tabList: 'aria-tablist',
        tab: 'aria-tab',
        tabLabel: getClassName(TAB, 'label'),
        tabviewPanel: getClassName(TABVIEW, PANEL),
        tabPanel: getClassName(TAB, PANEL),
        selectedTab: getClassName(TAB, SELECTED),
        selectedPanel: getClassName(TAB, CONTENT, SELECTED)
    },

    _queries = {
        tabview: DOT + _classNames.tabview,
        tabviewList: '> ul',
        tab: '> ul > li',
        tabLabel: '> ul > li > a ',
        tabviewPanel: '> div',
        tabPanel: '> div > div',
        selectedTab: '> ul > ' + DOT + _classNames.selectedTab,
        selectedPanel: '> div ' + DOT + _classNames.selectedPanel,
        hiddenPanel: '> div ' + DOT + _classNames.hiddenPanel
    },

    TabviewBase = function(config) {
        this.init.apply(this, arguments);
    };

TabviewBase.NAME = 'tabviewBase';
TabviewBase._queries = _queries;
TabviewBase._classNames = _classNames;

Y.mix(TabviewBase.prototype, {
    init: function(config) {
        config = config || EMPTY_OBJ;
        this._node = config.host || Y.one(config.node);

        this.refresh();
    },

    initClassNames: function(index) {
        Y.Object.each(_queries, function(query, name) {
            // this === tabview._node
            if (_classNames[name]) {
                var result = this.all(query);
                
                if (index !== undefined) {
                    result = result.item(index);
                }

                if (result) {
                    result.addClass(_classNames[name]);
                }
            }
        }, this._node);

        this._node.addClass(_classNames.tabview);
    },

    _select: function(index) {
        var node = this._node,
            oldItem = node.one(_queries.selectedTab),
            oldContent = node.one(_queries.selectedPanel),
            newItem = node.all(_queries.tab).item(index),
            newContent = node.all(_queries.tabPanel).item(index);

        if (oldItem) {
            oldItem.removeClass(_classNames.selectedTab);
        }

        if (oldContent) {
            oldContent.removeClass(_classNames.selectedPanel);
        }

        if (newItem) {
            newItem.addClass(_classNames.selectedTab);
        }

        if (newContent) {
            newContent.addClass(_classNames.selectedPanel);
            newContent.removeClass(_classNames.hiddenPanel);
        }
    },

    initState: function() {
        var node = this._node,
            activeNode = node.one(_queries.selectedTab),
            activeIndex = activeNode ?
                    node.all(_queries.tab).indexOf(activeNode) : 0;

        this._select(activeIndex);
    },

    // base renderer only enlivens existing markup
    refresh: function() {
        this.initClassNames();
        this.initState();
        this.initEvents();
    },

    tabEventName: 'click',

    initEvents: function() {
        // TODO: detach prefix for delegate?
        // this._node.delegate('tabview|' + this.tabEventName),
        this._node.delegate(this.tabEventName,
            this.onTabEvent,
            _queries.tab,
            this
        );
    },

    onTabEvent: function(e) {
        e.preventDefault();
        this._select(this._node.all(_queries.tab).indexOf(e.currentTarget));
    },

    destroy: function() {
        this._node.detach('tabview|*');
    }
});

Y.TabviewBase = TabviewBase;
