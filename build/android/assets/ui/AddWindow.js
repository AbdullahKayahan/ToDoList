exports.AddWindow = function() {

	var isWindows = (Ti.Platform.osname === "windowsphone" || Ti.Platform.osname === "windowsstore");

	var db = require('db');
	var self = Ti.UI.createWindow({
		modal: true,
		title: 'Yeni Kayıt Ekleyin',
		backgroundColor: isWindows ? '#000' : '#fff'
	});
	var itemField = Ti.UI.createTextField({
		width: '300dp',
		height: '45dp',
		top: '20dp',
		color:'black',
		hintText: 'Hatırlamak İçin Yazın',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType: Ti.UI.RETURNKEY_DONE
	});
	itemField.addEventListener('return', function(e) {
		addTask(itemField.value, self);
	});


	
var addButton = Ti.UI.createButton({
		title: 'Ekle',
		width: '300dp',
		height: '40dp',
		top: '80dp'
	});
	addButton.addEventListener('click', function() {
		
		addTask(itemField.value, self);
	});

	var cancelButton = Ti.UI.createButton({
		title: 'İptal',
		width: '300dp',
		height: '40dp',
		top: '130dp'
	});
	cancelButton.addEventListener('click', function(e) {
		self.close();
	});

	self.add(itemField);
	self.add(addButton);
	self.add(cancelButton);

	return self;
};

var addTask = function(value, win) {
	if (value === '') {
		alert('Lütfen Gerekli Alanlanı Doldurunuz');
		return;
	}
var tarih;
var d = new Date();
tarih=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear() ;
	require('db').addItem(value,tarih);
	Ti.App.fireEvent('app:updateTables');
	win.close();
};