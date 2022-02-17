require ("@babel/polyfill"); 
import Search from "./model/Search";

let search = new Search("pasta");

//doSearch('pizza');
search.doSearch().then(r => console.log('sdf dsfdsfsfd' + r));
