const classes=[
["Espace de cours 1","https://classroom.google.com/c/ODkyMTAxMDQyNTk1"],
["Espace de cours 2","https://classroom.google.com/c/ODg4NDM0NzEwOTgw"],
["Espace de cours 3","https://classroom.google.com/c/ODg2NzYwNzAyNDE0"],
["Espace de cours 4","https://classroom.google.com/c/ODg1MzU5NzEyMDE4"],
["Espace de cours 5","https://classroom.google.com/c/ODg1MTk1NjU3NTgw"],
["Espace de cours 6","https://classroom.google.com/c/ODc4NTc1NTk0NjIx"],
["Espace de cours 7","https://classroom.google.com/c/ODQ0Nzg4NTMxMjU0"],
["Espace de cours 8","https://classroom.google.com/c/ODQ0OTE0NjMzMzYy"],
["Espace de cours 9","https://classroom.google.com/c/NzEzMjQ2OTQyNzkx"],
["Espace de cours 10","https://classroom.google.com/c/ODg3MDE4MDMzNDcx"]
];
document.getElementById("classLinks").innerHTML=classes.map(([name,url])=>'<a class="class-link" href="'+url+'" target="_blank" rel="noopener">'+name+' <span>↗</span></a>').join("");
const subjects={
digital:["Digital Skills","Outils numériques, bureautique, recherche d'information, cybersécurité et travail collaboratif."],
it:["Fundamental IT","Découvrir les composants d'un ordinateur, le processeur, la mémoire, le stockage et les réseaux."],
c:["Algorithmique & C","Construire un raisonnement logique, écrire des algorithmes et programmer en langage C."],
electric:["Système électrique","Comprendre les grandeurs électriques, les composants, les circuits et les mesures en TP."],
system:["Systèmes d'exploitation","Manipuler les fichiers, les dossiers, les commandes et les environnements Windows/Linux."],
web:["HTML & CSS","Créer des pages web structurées, styliser les contenus et réaliser des mini-projets."]
};
document.querySelectorAll(".map-node").forEach(node=>node.addEventListener("click",()=>{
 document.querySelectorAll(".map-node").forEach(n=>n.classList.remove("active"));node.classList.add("active");
 const [title,desc]=subjects[node.dataset.key];document.getElementById("detail").innerHTML='<span>✦</span><div><b>'+title+'</b><p>'+desc+'</p></div>';
}));
document.getElementById("search").addEventListener("input",e=>{
 const q=e.target.value.toLocaleLowerCase("fr").trim();
 document.querySelectorAll(".subject").forEach(card=>card.hidden=!(card.dataset.name+" "+card.innerText).toLocaleLowerCase("fr").includes(q));
});
document.getElementById("menu").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));