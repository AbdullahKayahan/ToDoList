var DATABASE_NAME = 'todo';



exports.createDb = function() {
	//Ti.Database.install('todo.sqlite', DATABASE_NAME);
	
Ti.Database.install('todo.sqlite',DATABASE_NAME);
};

exports.selectItems = function(_done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from tableToDo where done = ?', _done);
	while (rows.isValidRow()) {
		retData.push({item:rows.fieldByName('item'),tarih:rows.fieldByName('tarih'), id:rows.fieldByName('id')});
		rows.next();
	}
	db.close();
	return retData;
};
exports.selectTarih= function(_done) {
	var sectionData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select DISTINCT tarih from tableToDo where done = ?', _done);
	while (rows.isValidRow()) {
		sectionData.push({tarih:rows.fieldByName('tarih')});
		rows.next();
	}
	db.close();
	return sectionData;
};
exports.updateItem = function(_id, _done) { 
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('update tableToDo set done = ? where id = ?', _done, _id);
	var rows = mydb.execute('select * from tableToDo where done = ?', _done);
	mydb.close();
	return rows;
};

 function getLastId() { 
	var mydb = Ti.Database.open(DATABASE_NAME);
	var lastId;
	var	rows=mydb.execute('select id from tableToDo ORDER BY id DESC limit 1');
	lastId=rows.fieldByName('id');
	mydb.close();
	return lastId;
};

exports.addItem = function(_item,_date) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	var lastId=getLastId()+1;
	mydb.execute('insert into tableToDo values (?,?,?,?)',lastId, _item,_date, 0);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('delete from tableToDo where id = ?', _id);
	mydb.close();
};