const bamenSyokiText = "場所: ,時間: ";
const maxPlot = 5;


document.getElementById("textarea1").value = "○登場人物○\n";
document.getElementById("bamenInput").value = bamenSyokiText;

class Plot{
  constructor(){
    this.name = "プロット";
    this.chara = [];
    this.p1 = "○登場人物○\n";
    this.p2 = "";
    
    
  }
  
  
  charaSelectSet(){
    let txt = '<option value="□">(キャラなし)</option>';
    for (let i = 0; i < this.chara.length; i++) {
      txt += '<option value = "' + this.chara[i]  + '">' + this.chara[i] + '</option>';
    }
    document.getElementById("serifuSelect").innerHTML = txt;
  }
}


class User{
  constructor(){
    this.plots = [new Plot(),new Plot(),new Plot(),new Plot(),new Plot()];
    this.plotNum = 0;
  }
  
  plotReturn(){
    return this.plots[this.plotNum];
  }
  
  nameChange(){
    this.plotReturn().name = document.getElementById("daimeiInput").value;
  }
}

let user = new User();

function inputCreate(x) {
  document.getElementById("charaNameDiv").innerHTML += "<input type='text' class='name' value = '" + user.plotReturn().chara[x] + "' id='name" + x + "'>"
  /*
  document.getElementById("name" + x).addEventListener("input", (event) => {
    const str = event.target.id;
    const regex = /[^0-9]/g;
    const result = str.replace(regex, "");
    const number = parseInt(result);

    user.plotReturn().chara[number] = event.target.value;
    user.plotReturn().charaSelectSet();
  });
  */
}

function test(){
  console.log(user.plotReturn().chara);
}

function charaB(){
  let t1 = document.getElementById("charaInput1").value;
  let t2 = document.getElementById("charaInput2").value;
  if(t1 == "")return;
  document.getElementById("charaInput1").value="";
  document.getElementById("charaInput2").value="";
  user.plotReturn().chara.push(t1);
  user.plotReturn().charaSelectSet();
  document.getElementById("textarea1").value += t1 + ":\n" + t2 + "\n";
  textareaHeightSet();
  
  let num = user.plotReturn().chara.length -1;
  inputCreate(num);
}

function charaChangeB(){
  let _plot = user.plotReturn();
  let charaLen = _plot.chara.length;
  for (var i = 0; i < charaLen; i++) {
    _plot.chara[i] = document.getElementById("name" + i).value;
  }
  _plot.charaSelectSet();
}

function bamenB(){
  let t1 = document.getElementById("bamenInput").value;
  if(t1 == bamenSyokiText)return;
  document.getElementById("bamenInput").value = bamenSyokiText;
  textarea2Add("\n" + t1 + "\n");
}

function serifuB(){
  let t1 = document.getElementById("serifuInput").value;
  if(t1 =="")return;
  document.getElementById("serifuInput").value = "";
  let t2 = document.getElementById("serifuSelect").value;
  if(document.getElementById("thinkCheck").checked){
    textarea2Add(t2 + "(" + t1 + ")\n");
  }else{
    textarea2Add(t2 + "「" + t1 + "」\n");
  }
}

function jouhouB(){
  let t1 = document.getElementById("jouhouInput").value;
if (t1 == "") return;
document.getElementById("jouhouInput").value = "";
textarea2Add("    " + t1 + "\n");
}

function hozonB(kakunin= true){
  if(kakunin){
    let co = window.confirm("ブラウザに保存します");
    if(co ==false)return;
  }
  
  let _plot = user.plotReturn();
  _plot.p1 = document.getElementById("textarea1").value;
  _plot.p2 = document.getElementById("textarea2").value;
  let _data = [_plot.name,[].concat(_plot.chara),_plot.p1,_plot.p2];
  
  var dbName = 'plotMakerDB2';
  var storeName  = 'sampleStore2';
  var dbVersion = 1;
  var keyValue = 'A1';
  var _plots = false;

  var openReq = indexedDB.open(dbName);

  openReq.onsuccess = function(event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, 'readwrite');
    var store = trans.objectStore(storeName);
    var getReq = store.get(keyValue);

    getReq.onsuccess = function(event) {
      //console.log(event.target.result); // {id : 'A1', plots : []}
      _plots = event.target.result.plots;
      db.close();
      if (_plots == false) {
        if(kakunin){
          window.alert("失敗");
        }else{
          return false;
        }
        return;
      }
      _plots[user.plotNum] = _data;
      
      
      var putReq = store.put({id:"A1",plots:_plots});

      putReq.onsuccess = function() {
        if(kakunin){
          console.log('put data success');
        }
      }

      trans.oncomplete = function() {
        // トランザクション完了時(putReq.onsuccessの後)に実行
        console.log('transaction complete');
        if(kakunin){
          window.alert("保存完了");
        }else{
          return true;
        }
      }
    }
  }
  
}

function textarea2Add(txt = ""){
  document.getElementById("textarea2").value += txt;
  textareaHeightSet();
}


function textareaHeightSet(){
  document.getElementById("textarea1").style.height = 0;
  document.getElementById("textarea1").style.height = document.getElementById("textarea1").scrollHeight + "px"
  if (document.getElementById("textarea1").offsetHeight < 1) {
    document.getElementById("textarea1").style.height = 15*5 + "px";
  }
  document.getElementById("textarea2").style.height = 0;
  document.getElementById("textarea2").style.height = document.getElementById("textarea2").scrollHeight + "px"
  if (document.getElementById("textarea2").offsetHeight < 1) {
    document.getElementById("textarea2").style.height = 15*5 + "px";
  }
}

window.onload = ()=>{
  document.getElementById("textarea1").addEventListener("input",textareaHeightSet);
  document.getElementById("textarea2").addEventListener("input",textareaHeightSet);
  document.getElementById("daimeiInput").addEventListener("input",user.nameChange);
  
  var dbName = 'plotMakerDB2';
  var storeName  = 'sampleStore2';
  var dbVersion = 1;

  var openReq = indexedDB.open(dbName, dbVersion);
  // オブジェクトストアの作成・削除はDBの更新時しかできないので、バージョンを指定して更新

  openReq.onupgradeneeded = function(event){
    //onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行
    console.log('db upgrade');
    
    var db = event.target.result;
    db.createObjectStore(storeName, {keyPath : 'id'})
    
    var transaction = event.target.transaction;

    transaction.oncomplete =
      function(ev) {
        // Now store is available to be populated
        var data = { id: "A1", plots: [[], [], [], [], []] };

        var trans = db.transaction(storeName, 'readwrite');
        var store = trans.objectStore(storeName);
        var putReq = store.put(data);

        putReq.onsuccess = function() {
          console.log('put data success');
        }

        trans.oncomplete = function() {
          // トランザクション完了時(putReq.onsuccessの後)に実行
          console.log('transaction complete');
        }
      }
    
    
  }


  openReq.onsuccess = function(event) {
    //onupgradeneededの後に実行。更新がない場合はこれだけ実行
    console.log('db open success');
    var db = event.target.result;
    
    var keyValue = 'A1';
    var _plots = false;
    var trans = db.transaction(storeName, 'readonly');
    var store = trans.objectStore(storeName);
    var getReq = store.get(keyValue);

    getReq.onsuccess = function(event) {
        //console.log(event.target.result); // {id : 'A1', plots : []}
        _plots = event.target.result.plots;
        for (var i = 0; i < _plots.length; i++) {
          if(_plots[i][0] ==null || _plots[i][0] ==undefined)continue;
          user.plots[i].name = _plots[i][0];
          user.plots[i].chara = _plots[i][1];
          user.plots[i].p1 = _plots[i][2];
          user.plots[i].p2 = _plots[i][3];
        }
        
        document.getElementById("daimeiInput").value = user.plotReturn().name;
        document.getElementById("textarea1").value = user.plotReturn().p1;
        document.getElementById("textarea2").value = user.plotReturn().p2;

        textareaHeightSet();
          
        user.plotReturn().charaSelectSet();
        document.getElementById("charaNameDiv").innerHTML = "";
        for (let n = 0; n < user.plotReturn().chara.length; n++) {
            let num = n;
            inputCreate(num);
        }
    }
    // 接続を解除する
    db.close();
  }
  openReq.onerror = function(event) {
    // 接続に失敗
    console.log('db open error');
  }
};


function dbDelete(){
  let con = window.confirm("really?");
  if(con == false)return;
  var dbName = 'plotMakerDB2';
  var deleteReq = indexedDB.deleteDatabase(dbName);
  window.alert("deleted.");

}
