function MainWindow() {
var AddWindow = require('ui/AddWindow').AddWindow;
var window1=Ti.UI.createWindow({
backgroundColor:'white',
title:'Yapılacaklar Listesi'
});

window1.open();
var isDone=0;

var ustPanel=Ti.UI.createView({
	height:'8%',
	top:0
});

var ortaPanel=Ti.UI.createView({
	height:'87%',
	top:50
});
var altPanel=Ti.UI.createView({
	height:'5%',
	bottom:0
});

// Create a Button.
var yapilacakBtn = Ti.UI.createButton({
	title : 'Yapacaklarım',
	height : '100%',
	width : '50%',
	backgroundColor:'#f4511e',
	color:'white',
	left:0,
	 font : {
			        fontSize : '16dp',
			        fontWeight : 'bold'
			    }
});

// Listen for click events. 99b3ff
yapilacakBtn.addEventListener('click', function() {
	list.setData(getTableData(0));
	isDone=0;
	yapilacakBtn.setBackgroundColor("#80ff80");
	yapilacakBtn.setColor("black");
	tamamlananBtn.setColor("white");
	tamamlananBtn.setBackgroundColor("#f4511e");
});
yapilacakBtn.setBackgroundColor("#80ff80");
yapilacakBtn.setColor("black");
// Add to the parent view.
ustPanel.add(yapilacakBtn);

// Create a Button.
var tamamlananBtn = Ti.UI.createButton({
	title : 'Tamamlanan',
	height : '100%',
	width : '50%',
	backgroundColor:'#f4511e',
	color:'white',
	left:'50%',
	 font : {
			        fontSize : '16dp',
			        fontWeight : 'bold'
			    }
	
});

// Listen for click events.
tamamlananBtn.addEventListener('click', function() {
	list.setData(getTableData(1));
	isDone=1;
	tamamlananBtn.setBackgroundColor("#80ff80");
	tamamlananBtn.setColor("black");
	yapilacakBtn.setColor("white");
	yapilacakBtn.setBackgroundColor("#f4511e");
});
 
// Add to the parent view.
ustPanel.add(tamamlananBtn);


var list=Ti.UI.createTableView({
	separatorColor:'#0040ff',
	top:3
	
});
list.setData(getTableData(0));

list.addEventListener('click', function(e) {
		createConfirmDialog(e.row.id, e.row.title, isDone).show();
	});
Ti.App.addEventListener('app:updateTables', function() {
		list.setData(getTableData(isDone));
	});

ortaPanel.add(list);

 
// Create a Button.
var ekleBtn = Ti.UI.createButton({
	title : 'EKLE',
	height : '100%',
	width:'100%',
	backgroundColor:'#0040ff',
	color:'white'
});

// Listen for click events.
var i=0;
ekleBtn.addEventListener('click', function() {

		new AddWindow().open();		
});

// Add to the parent view.
altPanel.add(ekleBtn);

window1.add(ustPanel);
window1.add(ortaPanel);
window1.add(altPanel);
	return window1;
}

var createConfirmDialog = function(id, title, isDone) {
	var db = require('db');
	var buttons, doneIndex, clickHandler;

	if (isDone) {
		buttons = ['Sil', 'İptal'];
		clickHandler = function(e) {
			if (e.index === 0) {
				db.deleteItem(id);
				Ti.App.fireEvent('app:updateTables');
			}
		};
	} else {
		buttons = ['Yapıldı', 'Sil', 'İptal'];
		clickHandler = function(e) {
			if (e.index === 0) {
				db.updateItem(id, 1);
				Ti.App.fireEvent('app:updateTables');
			} else if (e.index === 1) {
				db.deleteItem(id);
				Ti.App.fireEvent('app:updateTables');
			}
		};
	}

	var confirm = Ti.UI.createAlertDialog({
		title: 'Tamamladın Mı?',
		message: title,
		buttonNames: buttons
	});
	confirm.addEventListener('click', clickHandler);

	return confirm;
};


var getTableData = function(done) {
	var db = require('db');
	var sectionData=null;
	var data = [];
	var row = null;
	var todoItems = db.selectItems(done);
	var sections=db.selectTarih(done);

	var j=0;
	for (var i = 0; i < sections.length; i++) {
		sectionData=Ti.UI.createTableViewSection({
			headerTitle:sections[i].tarih
		});
	
		for (var j = 0; j < todoItems.length; j++) {
			if(sections[i].tarih==todoItems[j].tarih){
				row = Ti.UI.createTableViewRow({
				id: todoItems[j].id,
				title: todoItems[j].item,	
				color:'#000',
			    font : {
			        fontSize : '16dp',
			        fontWeight : 'bold'
			    }
			});
			sectionData.add(row);
			}//if		
		}//for
		data.push(sectionData);
	}
	return data;
};

module.exports = MainWindow;
