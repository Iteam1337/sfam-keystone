var React = require('react/addons'),
	ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
	AltText = require('./AltText');

var Header = React.createClass({
	
	displayName: 'ItemViewHeader',
	
	getInitialState: function() {
		return {
			searchIsVisible: false,
			searchIsFocused: false,
			searchString: ''
		};
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.searchIsVisible && !prevState.searchIsVisible) {
			this.refs.searchField.getDOMNode().focus();
		}
	},
	
	toggleCreate: function(visible) {
		this.props.toggleCreate(visible);
	},
	
	toggleSearch: function(visible) {
		this.setState({
			searchIsVisible: visible,
			searchIsFocused: visible,
			searchString: ''
		});
	},
	
	searchFocusChanged: function(focused) {
		this.setState({
			searchIsFocused: focused
		});
	},
	
	searchStringChanged: function(event) {
		this.setState({
			searchString: event.target.value
		});
	},
	
	renderDrilldown: function() {
		if (this.state.searchIsVisible) return null;
		return (
			<ul className="item-breadcrumbs" key="drilldown">
				<li>
					<a href="javascript:;" title={'Sök ' + this.props.list.plural} onClick={this.toggleSearch.bind(this, true)}>
						<span className="ion-search"></span>
					</a>
				</li>
				{this.renderDrilldownItems()}
			</ul>
		);
	},
	
	renderDrilldownItems: function() {
		
		var list = this.props.list,
			items = this.props.drilldown.items;
		
		var els = items.map(function(dd) {
			
			var links = [];
			
			dd.items.forEach(function(el, i) {
				links.push(<a key={'dd' + i} href={el.href} title={dd.list.singular}>{el.label}</a>);
				if (i < dd.items.length - 1) {
					links.push(<span key={'ds' + i} className="separator">,</span>);
				}
			});
			
			var more = dd.more ? <span>...</span> : '';
			
			return (
				<li>
					{links}
					{more}
				</li>
			);
			
		});
		
		var backIcon = (!els.length) ? <span className="mr-5 ion-arrow-left-c"></span> : '';
		
		els.push(
			<li key="back">
				<a href={'/keystone/' + list.path} title={'Back to ' + list.plural}>
					{backIcon}
					{list.plural}
				</a>
			</li>
		);
		
		return els;
		
	},
	
	renderSearch: function() {
		if (!this.state.searchIsVisible) return null;
		var list = this.props.list;
		var submitButtonClass = 'btn ' + (this.state.searchIsFocused ? 'btn-primary' : 'btn-default');
		return (
			<div className="searchbox" key="search">
				<form action={'/keystone/' + list.path} className="form-inline searchbox-form">
					<div className="searchbox-field">
						<input
							ref="searchField"
							type="search"
							name="search"
							value={this.state.searchString}
							onChange={this.searchStringChanged}
							onFocus={this.searchFocusChanged.bind(this, true)}
							onBlur={this.searchFocusChanged.bind(this, false)}
							placeholder={'Sök ' + list.plural}
							className="form-control searchbox-input"
						/>
					</div>
					<div className="searchbox-button">
						<button type="submit" className={submitButtonClass}>Sök</button>
					</div>
					<button type="button" className="btn btn-link btn-cancel" onClick={this.toggleSearch.bind(this, false)}>Avbryt</button>
				</form>
			</div>
		);
	},
	
	renderInfo: function() {
		return (
			<ul className="item-toolbar-info">
				{this.renderKeyOrId()}
				{this.renderCreateButton()}
			</ul>
		);
	},
	
	renderKeyOrId: function() {
		var list = this.props.list;
		if (list.autokey && this.props.data[list.autokey.path]) {
			return (
				<li>
					<AltText
						normal={list.autokey.path + ': ' + this.props.data[list.autokey.path]}
						modified={'id: ' + this.props.data.id}
					/>
				</li>	
			);
		}
		return <li>id: {this.props.data.id}</li>;
	},
	
	renderCreateButton: function() {
		if (this.props.list.nocreate) return null;
		return (
			<li>
				<a className="item-toolbar-create-button" href="javascript:;" onClick={this.toggleCreate.bind(this, true)}>
					<span className="mr-5 ion-plus"></span>
					Ny {this.props.list.singular}
				</a>
			</li>
		);
	},
	
	render: function() {
		return (
			<div>
				<div className="item-toolbar item-toolbar--header">
					<ReactCSSTransitionGroup transitionName="ToolbarToggle" className="ToolbarToggle-wrapper" component="div">
						{this.renderDrilldown()}
						{this.renderSearch()}
					</ReactCSSTransitionGroup>
					{this.renderInfo()}
				</div>
			</div>
		);
	}
	
});

module.exports = Header;
