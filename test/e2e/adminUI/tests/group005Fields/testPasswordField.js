var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Password');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Password',
			fields: ['name', 'fieldA'],
			args: {'editForm': false}, // To check for @value instead of @button
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Password');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
				'fieldA': {value: 'password1', confirm: 'wrongPassword1'},
			}
		});
		browser.initialFormPage.save();
		browser.initialFormPage.assertFlashError("Passwords must match");
		browser.initialFormPage.fillInputs({
			listName: 'Password',
			fields: {
				'fieldA': {value: 'password1', confirm: 'password1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
	'Password field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Password',
			fields: ['fieldA', 'fieldB'],
			args: {'editForm': true}, // To check for @button instead of @value
		});
	},
	'Password field can be filled via the edit form': function(browser) {
		browser.itemPage.section.form.section.passwordList.section.fieldB.clickSetPassword();
		browser.itemPage.fillInputs({
			listName: 'Password',
			fields: {
				'fieldB': {value: 'password2', confirm: 'wrongPassword2'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashError('Passwords must match');
		browser.itemPage.fillInputs({
			listName: 'Password',
			fields: {
				'fieldB': {value: 'password2', confirm: 'password2'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
};
