var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Markdown');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Markdown',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Markdown field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Markdown');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.initialFormPage.section.form.section.markdownList.section.fieldA.togglePreview();
		browser.initialFormPage.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		})
	},
	'Markdown field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Markdown',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Markdown field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Markdown',
			fields: {
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		/* TODO Work out why this was breaking travis, and re-implement
		See https://travis-ci.org/keystonejs/keystone/builds/130040822#L2215
		browser.itemPage.section.form.section.markdownList.section.fieldA.togglePreview();
		browser.itemPage.section.form.section.markdownList.section.fieldB.togglePreview();
		browser.itemPage.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
				'fieldB': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'}
			}
		});
		*/
	},
};
