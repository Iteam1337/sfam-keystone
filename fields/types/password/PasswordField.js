var _ = require('underscore'),
	React = require('react'),
	Field = require('../Field'),
	Note = require('../../components/Note');

module.exports = Field.create({
	
	displayName: 'PasswordField',

	focusTarget: 'password',
	
	getInitialState: function() {
		return {
			passwordIsSet: this.props.value ? true : false,
			showChangeUI: this.props.mode === 'create' ? true : false,
			password: '',
			confirm: ''
		};
	},
	
	componentDidUpdate: function() {
		if (this._focusAfterUpdate) {
			this._focusAfterUpdate = false;
			this.focus();
		}
	},
	
	valueChanged: function(which, event) {
		this.setState(_.object([which], [event.target.value]));
		if (which === 'password') {
			this.props.onChange({
				path: this.props.path,
				value: event.target.value
			});
		}
	},
	
	showChangeUI: function() {
		this._focusAfterUpdate = true;
		this.setState({
			showChangeUI: true
		});
	},
	
	renderValue: function() {
		return <div className="field-value">{this.props.value ? 'lösenord satt' : 'lösenord ej satt'}</div>;
	},
	
	renderField: function() {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},
	
	renderFields: function() {
		return (
			<div className="form-row">
				<div className="col-sm-6">
					<input type="password" name={this.props.path} placeholder="Nytt lösenord" ref="password" value={this.state.password} onChange={this.valueChanged.bind(this, 'password')} autoComplete="off" className="form-control" />
				</div>
				<div className="col-sm-6">
					<input type="password" name={this.props.paths.confirm} placeholder="Bekräfta nytt lösenord" ref="confirm" value={this.state.confirm} onChange={this.valueChanged.bind(this, 'confirm')} autoComplete="off" className="form-control" />
				</div>
			</div>
		);
	},
	
	renderChangeButton: function() {
		var label = this.state.passwordIsSet ? 'Ändra lösenord' : 'Sätt nytt lösenord';
		return (
			<button type="button" className="btn btn-default" onClick={this.showChangeUI}>{label}</button>
		);
	}
	
});
