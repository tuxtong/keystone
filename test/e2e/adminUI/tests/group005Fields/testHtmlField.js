var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Html');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Html',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Html field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Html');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Html',
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Html',
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Html',
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		})
	},
	'Html field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Html',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Html field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Html',
			fields: {
				'fieldB': {value: 'Some test html code for field B'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Html',
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
				'fieldB': {value: 'Some test html code for field B'}
			}
		})
	},
};
