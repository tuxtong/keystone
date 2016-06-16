import Field from '../Field';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FormField, FormInput, FormNote } from 'elemental';
import Lightbox from '../../components/Lightbox';
import classnames from 'classnames';

const iconClassUploadPending = [
	'upload-pending',
	'mega-octicon',
	'octicon-cloud-upload',
];

const iconClassDeletePending = [
	'delete-pending',
	'mega-octicon',
	'octicon-x',
];

module.exports = Field.create({

	openLightbox (index) {
		event.preventDefault();
		this.setState({
			lightboxIsVisible: true,
			lightboxImageIndex: index,
		});
	},

	closeLightbox () {
		this.setState({
			lightboxIsVisible: false,
			lightboxImageIndex: null,
		});
	},

	renderLightbox () {
		const { value } = this.props;
		if (!value || !Object.keys(value).length) return;

		const images = [value.url];

		return (
			<Lightbox
				images={images}
				initialImage={this.state.lightboxImageIndex}
				isOpen={this.state.lightboxIsVisible}
				onCancel={this.closeLightbox}
			/>
		);
	},

	shouldCollapse () {
		return this.props.collapse && !this.hasExisting();
	},

	fileFieldNode () {
		return ReactDOM.findDOMNode(this.refs.fileField);
	},

	changeFile () {
		this.fileFieldNode().click();
	},

	getFileSource () {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			return this.props.value.url;
		} else {
			return null;
		}
	},

	getFileURL () {
		if (!this.hasLocal() && this.hasExisting()) {
			return this.props.value.url;
		}
	},

	undoRemove () {
		this.fileFieldNode().value = '';
		this.setState({
			removeExisting: false,
			localSource: null,
			origin: false,
			action: null,
		});
	},

	fileChanged (event) { // eslint-disable-line no-unused-vars
		this.setState({
			origin: 'local',
		});
	},

	removeFile (e) {
		var state = {
			localSource: null,
			origin: false,
		};

		if (this.hasLocal()) {
			this.fileFieldNode().value = '';
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = 'reset';
				}
			}
		}

		this.setState(state);
	},

	hasLocal () {
		return this.state.origin === 'local';
	},

	hasFile () {
		return this.hasExisting() || this.hasLocal();
	},

	hasExisting () {
		return this.props.value && !!this.props.value.filename;
	},

	getFilename () {
		if (this.hasLocal()) {
			return this.fileFieldNode().value.split('\\').pop();
		} else {
			return this.props.value.filename;
		}
	},

	getFullUrl () {
		var http = 'http://';
		return http + window.location.host + this.props.value.href;
	},

	renderFileDetails (add) {
		var isPicture = this.getFilename().match(/\.(jpeg|jpg|gif|png)$/) != null;
		var values = null;

		if (this.hasFile() && !this.state.removeExisting) {
			values = (
				<div className="file-values">
					{isPicture &&
						this.renderImagePreview()
					}
					<FormInput noedit>{this.getFullUrl()}</FormInput>
				</div>
			);
		}

		return (
			<div key={this.props.path + '_details'} className="file-details">
				{values}
				{add}
			</div>
		);
	},

	renderAlert () {
		if (this.hasLocal()) {
			return (
				<div className="file-values upload-queued">
					<FormInput noedit>File selected - save to upload</FormInput>
				</div>
			);
		} else if (this.state.origin === 'cloudinary') {
			return (
				<div className="file-values select-queued">
					<FormInput noedit>File selected from Cloudinary</FormInput>
				</div>
			);
		} else if (this.state.removeExisting) {
			return (
				<div className="file-values delete-queued">
					<FormInput noedit>File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm</FormInput>
				</div>
			);
		} else {
			return null;
		}
	},

	renderClearButton () {
		if (this.state.removeExisting) {
			return (
				<Button type="link" onClick={this.undoRemove}>
					Undo Remove
				</Button>
			);
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return (
				<Button type="link-cancel" onClick={this.removeFile}>
					{clearText}
				</Button>
			);
		}
	},

	renderFileField () {
		if (!this.shouldRenderField()) return null;

		return <input ref="fileField" type="file" name={this.props.paths.upload} className="field-upload" onChange={this.fileChanged} tabIndex="-1" />;
	},

	renderFileAction () {
		if (!this.shouldRenderField()) return null;

		return <input type="hidden" name={this.props.paths.action} className="field-action" value={this.state.action} />;
	},

	/**
	 * Render an image preview
	 */
	renderImagePreview () {
		var iconClassName;
		var className = ['image-preview'];
		var style = {
			float: 'left',
			margin: '0 10px 10px 0'
		};

		if (this.hasLocal()) {
			iconClassName = classnames(iconClassUploadPending);
		} else if (this.state.removeExisting) {
			className.push(' removed');
			iconClassName = classnames(iconClassDeletePending);
		}
		className = classnames(className);

		var body = [this.renderImagePreviewThumbnail()];
		if (iconClassName) body.push(<div key={this.props.path + '_preview_icon'} className={iconClassName} />);

		var url = this.props.value.href;

		if (url) {
			body = <a className="img-thumbnail" href={url} onClick={this.openLightbox.bind(this, 0)} target="__blank" style={style}>{body}</a>;
		} else {
			body = <div className="img-thumbnail">{body}</div>;
		}

		return (
			<div>
				{body}
			</div>
		);
	},

	renderImagePreviewThumbnail () {
		var url = this.props.value.href;

		return <img key={this.props.path + '_preview_thumbnail'} className="img-load" style={{ height: '90' }} src={url} />;
	},

	renderFileToolbar () {
		return (
			<div key={this.props.path + '_toolbar'} className="file-toolbar">
				<div className="u-float-left">
					<Button onClick={this.changeFile}>
						{this.hasFile() ? 'Change' : 'Upload'} File
					</Button>
					{this.hasFile() && this.renderClearButton()}
				</div>
			</div>
		);
	},

	renderNote () {
		if (!this.props.note) return null;

		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		console.log(this.props);
		var container = [];
		var body = [];
		var hasFile = this.hasFile();

		if (this.shouldRenderField()) {
			if (hasFile) {
				// container.push(this.renderImagePreview());
				container.push(this.renderFileDetails(this.renderAlert()));
			}
			body.push(this.renderFileToolbar());
		} else {
			if (hasFile) {
				// container.push(this.renderImagePreview());
				container.push(this.renderFileDetails());
			} else {
				container.push(<FormInput noedit>no file</FormInput>);
			}
		}

		return (
			<FormField label={this.props.label} className="field-type-localfile" htmlFor={this.props.path}>

				{this.renderFileField()}
				{this.renderFileAction()}

				<div className="file-container">{container}</div>
				{body}
				{this.renderNote()}

			</FormField>
		);
	},

});
