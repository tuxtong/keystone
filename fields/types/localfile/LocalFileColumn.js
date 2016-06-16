import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const IMAGE_SIZE = 18;

const linkStyle = {
	marginRight: 8,
};

const boxStyle = {
	borderRadius: 3,
	display: 'inline-block',
	height: IMAGE_SIZE,
	overflow: 'hidden',
	verticalAlign: 'middle',
	width: IMAGE_SIZE,
};

const imageStyle = {
	display: 'block',
	height: IMAGE_SIZE,
	left: '50%',
	position: 'relative',

	WebkitTransform: 'translateX(-50%)',
	MozTransform: 'translateX(-50%)',
	msTransform: 'translateX(-50%)',
	transform: 'translateX(-50%)',
};

var LocalFileColumn = React.createClass({
	getValue () {
		return this.props.data.fields[this.props.col.path];
	},

	isPicture () {
		return this.getValue().originalname.match(/\.(jpeg|jpg|gif|png)$/) != null;
	},

	renderImageThumbnail () {
		const url = this.getValue().href;
		return <img src={url} style={imageStyle} className="img-load" />;
	},

	renderValue: function () {
		var value = this.getValue();
		if (!value || !_.size(value)) return;
		// return value.href;
		return (
			<ItemsTableValue field={this.props.col.type}>
				<span style={linkStyle}>
					<span style={boxStyle}>
						{this.isPicture() && this.renderImageThumbnail()}
					</span>
					{this.getValue().filename}
				</span>
			</ItemsTableValue>
		);
	},

	render: function () {
		// return (
		// 	<td className="ItemList__col">
		// 		<div className="ItemList__value ItemList__value--local-file">{this.renderValue()}</div>
		// 	</td>
		// );
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

module.exports = LocalFileColumn;
