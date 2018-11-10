function textJustification(words) {
    let index = 0;
    let count=0
    var textJustifie= '';
    
    while(index < words.length) {
        let x=0
        while(words[index][x]=='\n'){
            x++;
        }
        //pour que les retours à la ligne ne seront pas compté comme caractère
        if(words[index].substr(0,1)=='\n') textJustifie= textJustifie.substr(0,textJustifie.length-1); 
        count = words[index].length-x;

        //position du dernier mot lu
        let last = index + 1;
 
        while(last < words.length) {
            var retourAlaLigne= false;
            if (words[last].length + count + 1 > 80) break;

            //si il ya retour à la ligne, la ligne ne sera pas justifiée
            if( words[last][0]==='\n') {
                retourAlaLigne=true;
                break;
            }
            count += words[last].length + 1;
            last++;
        }
        
        let line = "";
        let difference = last - index - 1; // nombre de mots
        
        //si on est dans la dernière ligne ou il existe un retour à la ligne
        
        if (last === words.length || retourAlaLigne ) {
            for (let i = index; i < last; i++) {
                line += words[i] + " ";
            }
            
            line = line.substr(0, line.length - 1); //pour enlever l'espace qui se situe apres le dernier mot
      
             } else {
            
            let espaces = (80 - count) / difference; //nombre des espaces par mot à ajouter
            let reste = (80 - count) % difference; //le reste des espaces
            
            //l'ajout des espaces
            for (let i = index; i < last; i++) {
                line += words[i];
                if( i < last - 1) {
                    let limit = espaces + ((i - index) < reste ? 1 : 0)
                    for (let j = 0; j <= limit; j++) {
                        line += " ";
                    } 
                }
            }
        }
        index = last;
        if(line[line.length-1]==='\n' ){
            textJustifie+= line
        }else{
            textJustifie+= line+'\n'
        }
    }
    return textJustifie
}
module.exports = textJustification;