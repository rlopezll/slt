var all_langs = [
  {code:"us", url:"/images/countries/usa.png",name:'English'},
  {code:"en-gb", url:"/images/countries/kingdom.png",name:'English UK'},
  {code:"it", url:"/images/countries/italy.png",name:'Italy'},
  {code:"fr", url:"/images/countries/france.png",name:'France'},
  {code:"es", url:"/images/countries/spain.png",name:'Spanish'},
  {code:"el", url:"/images/countries/greece.png",name:'Greek'},
  {code:"pt", url:"/images/countries/portugal.png",name:'Portugal'},
  {code:"pt-br", url:"/images/countries/brazil.png",name:'Brazil'},
  {code:"cn", url:"/images/countries/china.png",name:'China'},
  {code:"jp", url:"/images/countries/japan.png",name:'Japan'},
  {code:"ko", url:"/images/countries/korea.png",name:'Korea'},
  {code:"ar-ma", url:"/images/countries/morocco.png",name:'Arabic'},
];


module.exports.get_lang = function (lang) {
  var value = all_langs.find(element => element.code === lang);
  if(value)
    return value;
  return all_langs[0];
}

module.exports.get_all_langs = function () {
  return all_langs;
}

module.exports.get_all_langs_actived = function (active_langs) {
  var custom_all_langs = [];
  for(var idx in all_langs)
  { 
    var value = all_langs[idx];
    if(Array.isArray(active_langs)) {
      value.is_active = (active_langs.indexOf(value.code) >= 0);
    } else {
      //console.log('Error! active_langs is not array');
      value.is_active = false;
    }
    custom_all_langs.push(value);
  }
  return custom_all_langs;
}
