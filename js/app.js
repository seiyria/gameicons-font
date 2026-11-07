
const Data = {
    glyphs: () => m.request({ method: 'GET', url: 'data/glyphs.json' })
};

const Filter = {
    controller: function() {
        this.searchTerm = m.prop('');
    },
    view: (ctrl) => {
        return m('input.form-control', { placeholder: 'Filter icons...', oninput: m.withAttr('value', ctrl.searchTerm) });
    }
};

const ForegroundColor = {
    controller: function() {
        this.fgColor = m.prop('');
    },
    view: (ctrl) => {
        return m('input.form-control', { placeholder: 'Set FG Color', oninput: m.withAttr('value', ctrl.fgColor) });
    }
};

const List = {
    controller: function(options) {
        return {
            glyphs: Data.glyphs(),
            visible: options.visible,
            fgColor: options.fgColor
        };
    },
    view: (ctrl) => {
        return ctrl
            .glyphs()
            .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
            .filter(ctrl.visible)
            .map(glyph => m('div.col-md-1.col-sm-2.col-xs-3.icon-block.text-center', [
                m(`i.game-icon.game-icon-${glyph.name}.icon-md`, { style: { color: ctrl.fgColor() }}),
                m('br'),
                m(`a[target="_blank"][href="./svg/${glyph.name}.svg"]`, glyph.name)
            ]));
    }
};

const Page = {
    controller: function() {
        this.list = List.controller({
            visible: (item) => item.name.indexOf(this.filter.searchTerm()) > -1,
            fgColor: () => this.foregroundColor.fgColor()
        });

        this.foregroundColor = new ForegroundColor.controller();
        this.filter = new Filter.controller();
    },
    view: (ctrl) => {
        return [
            m('div.row.text-center', [
                m('div.col-sm-6', Filter.view(ctrl.filter)),
                m('div.col-sm-6', ForegroundColor.view(ctrl.foregroundColor))
            ]),
            m('div.row', List.view(ctrl.list))
        ];
    }
};

m.mount(document.getElementById('page'), Page);
