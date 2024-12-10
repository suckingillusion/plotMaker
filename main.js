class Plot{
  constructor(){
    this.chara = [];
    this.bamenSyokiText = "場所: ,時間: ";
    
    document.getElementById("textarea1").value = "○登場人物○\n";;
    document.getElementById("bamenInput").value = this.bamenSyokiText;
  }
  
  
  charaSelectSet(){
    let txt = '<option value="□">(キャラなし)</option>';
    for (var i = 0; i < this.chara.length; i++) {
      txt += '<option value = "' + this.chara[i]  + '">' + this.chara[i] + '</option>';
    }
    document.getElementById("serifuSelect").innerHTML = txt;
  }
}

let plot = new Plot();

function charaB(){
  let t1 = document.getElementById("charaInput1").value;
  let t2 = document.getElementById("charaInput2").value;
  if(t1 == "")return;
  document.getElementById("charaInput1").value="";
  document.getElementById("charaInput2").value="";
  plot.chara.push(t1);
  plot.charaSelectSet();
  document.getElementById("textarea1").value += t1 + ":\n" + t2 + "\n";
  textareaHeightSet();
  
  let num = plot.chara.length -1;
  document.getElementById("charaNameDiv").innerHTML += "<input type='text' class='name' value = '" + t1 +   "' id='name" + num  + "'>"
  document.getElementById("name" + num ).addEventListener("input",(event)=>{
    plot.chara[num] = event.target.value;
    plot.charaSelectSet();
  });
}

function bamenB(){
  let t1 = document.getElementById("bamenInput").value;
  if(t1 == plot.bamenSyokiText)return;
  document.getElementById("bamenInput").value = plot.bamenSyokiText;
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

function textarea2Add(txt = ""){
  document.getElementById("textarea2").value += txt;
  textareaHeightSet();
}

document.getElementById("textarea1").addEventListener("input",textareaHeightSet);
document.getElementById("textarea2").addEventListener("input",textareaHeightSet);

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
