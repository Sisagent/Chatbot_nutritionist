// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

//to use Firestore database
var admin = require("firebase-admin");
var serviceAccount = require('./mr-diet-f2c65-firebase-adminsdk-7x165-695698fdbe');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://mr-diet-f2c65.firebaseio.com"
});

var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);
//-------------------------

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    //match with intent 2.1 - consiglio_attivita_fisica
    function attivitaFisica(agent){
        
        let cardConsiglio = new Card('CONTATTA UN ESPERTO');
        const intensita = agent.parameters.intensitaAllenamento;
        if (intensita == 'leggero'){
            agent.add('bene. Ti consiglio di mangiare un paio d’ore prima dell’inizio dell’allenamento cibi con prevalenza di carboidrati(anche un po di pasta o'+
            ' pane va bene). Per quanto riguarda il post allenamento va bene della frutta o un bicchiere di latte,  al limite se si ha molta fame andrebbe bene un '+
            'piccolo panino, senza esagerare. In ogni caso ti consiglio di consultare questo link per maggiori informazioni: '+
            ' https://www.fondazioneveronesi.it/magazine/articoli/lesperto-risponde/cosa-mangiare-prima-di-fare-sport ');
            agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
        } else{
            agent.add('Bene. Innazitutto ricorda di bere regolarmente anche prima dell’inizio dell’allenamento. Un pasto completo va consumato almeno 2-3 ore prima '+
            'dell’allenamento, molto importante è la presenza di proteine. Va bene anche uno snack ricco di carboidrati 10 minuti prima dell’inizio dell’allenamento.'+
            ' Per maggiori informazioni puoi consultare la seguente fonte https://www.runtastic.com/blog/it/sport-cosa-mangiare-prima-e-dopo-un-allenamento/');
            agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
        }

    }

    //match with intent 2.2 consiglio_pasto_dietetico
    function pastoDietetico (agent){
            const pasto = agent.parameters.pastoDietetico;
            let card = new Card('scelta 1'); 
            let card2= new Card('scelta 2');
            let card3= new Card('scelta 3');
            let card4= new Card('scelta 4');
            let cardConsiglio = new Card('CONTATTA UN ESPERTO');

            switch (pasto){
                case 'colazione dietetica':
                    agent.add ('Per una colazione dietetica per la linea posso consigliarti yogurt addensato magro con fiocchi di cereali misti, spremuta di'+
                    ' arancia e pompelmo con toast integrale al prosciutto crudo, macedonia di frutta e biscotti secchi, fiocchi di latte light con gallette'+
                     'integrali, latte parzialmente scremato con cacao amaro e cereali aggregati con frutta secca.  ');
                     agent.add('Per approfondire ti consiglio di consultare il link: https://www.my-personaltrainer.it/alimentazione/colazione-dietetica.html');
                     card.setTitle('Cereali'); 
                     card.setImage('https://image.ibb.co/idHyAL/colazdiet.jpg');
                     agent.add(card);
                     card2.setTitle('Cereali e latte'); 
                     card2.setImage('https://image.ibb.co/mzfh4f/colaz2.jpg');
                     agent.add(card2);
                     card3.setTitle('Spremuta di arance'); 
                     card3.setImage('https://image.ibb.co/cU2Rx0/colaz3.jpg');
                     agent.add(card3);
                     card4.setTitle('Toast'); 
                     card4.setImage('https://image.ibb.co/hPo5qL/colaz4.jpg');
                     agent.add(card4);
                     
                     agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                     ' Consulta sempre il tuo medico di fiducia');
                    cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                     });
                    agent.add(cardConsiglio);
                    agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
                     break;

                case 'pranzo dietetico':
                    agent.add('Una dieta proteica per dimagrire prevede a pranzo pasti come pasta al pomodoro (90 g di pasta), oppure un risotto alla rucola (80 g '+
                    'di riso) o un piatto di patate e fagioli lessi');
                    agent.add('Per approfondire ti consiglio di consultare il link: https://www.my-personaltrainer.it/alimentazione/esempio-dieta-proteica-per-dimagrire.html');
                     card.setTitle('Pasta col pomodoro'); 
                     card.setImage('https://image.ibb.co/mS2C4f/pranzo1.jpg');
                     agent.add(card);
                     card2.setTitle('Risotto alla rucola'); 
                     card2.setImage('https://image.ibb.co/ckYKjf/pranzo2.jpg');
                     agent.add(card2);
                     card3.setTitle('Patate e fagioli lessi'); 
                     card3.setImage('https://image.ibb.co/f6FRVL/pranzo3.jpg');
                     agent.add(card3);
                    
                     agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                     ' Consulta sempre il tuo medico di fiducia');
                     cardConsiglio.setButton({
                         text: 'Contatta',
                         url: 'https://www.paginegialle.it/nutrizionista.htm'
                     });
                     agent.add(cardConsiglio);
                     agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
                     break;

                case 'cena dietetica':
                    agent.add('In una dieta proteica dimagrante potresti mangiare per cena un petto di pollo con contorno di zucchine, oppure un filetto di tonno'+
                    ' alla piastra o una spigola al forno.');
                    agent.add('Per approfondire ti consiglio di consultare il link: https://www.my-personaltrainer.it/alimentazione/esempio-dieta-proteica-per-dimagrire.html');
                     card.setTitle('Petto di pollo e zucchine'); 
                     card.setImage('https://image.ibb.co/eoYxLL/cena1.jpg');
                     agent.add(card);
                     card2.setTitle('Filetto di pesce'); 
                     card2.setImage('https://image.ibb.co/f8oa70/cena2.jpg');
                     agent.add(card2);
                    
                     agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                     ' Consulta sempre il tuo medico di fiducia');
                     cardConsiglio.setButton({
                         text: 'Contatta',
                         url: 'https://www.paginegialle.it/nutrizionista.htm'
                     });
                     agent.add(cardConsiglio);
                     agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
                     break;

                case 'spuntino dietetico' || 'snack dietetico'|| 'spuntino':
                    agent.add('Esempi di spuntini veloci e salutari possono essere: yogurt al naturale parzialmente scremato, un frutto e qualche fetta di '+
                    'affettato magro, un frutto e una fetta di formaggio magro, un frutto e un po’ di frutta secca (noci o mandorle).');
                    agent.add('Per approfondire ti consiglio di consultare il link: https://www.my-personaltrainer.it/bar-spuntini.htm');
                    card.setTitle('Yogurt'); 
                    card.setImage('https://preview.ibb.co/iq4jZf/spuntdie1.jpg');
                    agent.add(card);
                    card2.setTitle('Frutta e frutta secca'); 
                    card2.setImage('https://image.ibb.co/hZrWEf/spudie3.jpg');
                    agent.add(card2);
                    card3.setTitle('Frutta e formaggio'); 
                    card3.setImage('https://preview.ibb.co/kNzU0L/spundie2.jpg');
                    agent.add(card3);
                    
                    agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                     ' Consulta sempre il tuo medico di fiducia');
                    cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                    });
                    agent.add(cardConsiglio);
                    agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)'); 
                    break;

                default:
                    agent.add('Non credo di aver capito, puoi riformulare la domanda?');
            }
    }


    function noIntolleranzeAllergie(agent){
        const pasto = agent.parameters.pasto;
        const intoll = agent.parameters.intolleranzeAllergie;
        agent.add("ecco per te un" + pasto + " sei intollerante a " + intoll);

    }

    
    //ESEMPIO DI CARD

        //let card = new Card('Hai scelto la dieta'+' ' + tipodieta);                     //inizializza direttamente il costruttore col titolo
        //card.setImage('https://image.ibb.co/mOT9Pf/photo-2018-11-15-19-08-04.jpg');     //setta immagine. Deve essere i link diretto al png o jpg
        //card.setText('con questa dieta dimagrirai molto 💁');                           //setta testo della card e supporta le emoji
        
        
        /*const card = new Card({
            title: 'Hai scelto la dieta' + ''+ tipodieta,
            text: 'Dieta generica per dimagrire',
            imageUri: 'https://ibb.co/g77fVL',
            buttonText: Bottone,
            buttonUrl: 'https://assistant.google.com/',
            platform: 'FACEBOOK'
            });*/
   //end consiglioDieta








    function consiglioGrasso(agent){

        const zona1 = agent.parameters.zoneCorpo;
        const zona2 = agent.parameters.zoneCorpo1;
        let cardConsiglio = new Card('CONTATTA UN ESPERTO');

        switch(zona1){

            case 'cosce' || 'gambe' ||'quadricipiti' || 'glutei' || 'natiche':
                agent.add('In generale, il grasso localizzato in eccesso non è un problema risolvibile soltanto con una dieta'+ 
                'e in breve termine. Per tale motivo il primo consiglio è quello di rivolgersi ad un esperto per un programma dettagliato.'+ 
                'Tuttavia ci sono alimenti che vanno preferiti ed altri fortemente sconsigliati. ' + 'Vediamone alcuni: prediligere in generale cibi integrali a zuccheri e grassi saturi.' + 
                'Altri alimenti consigliati sono la frutta, le verdure,'+ 
                'le carni magre(pollo,tacchino),uova e i semi. Assumente i carboidrati ad assorbimento più lento, come le patate dolci,la farina d’avena e il riso integrale.');
                
                agent.add('per le gambe e i glutei ti consiglio di approfondire https://www.my-personaltrainer.it/allenamento/allenamento-femminile.html ');
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');                
                break;
            
            case 'braccia' || 'braccio' || 'bicipite' || 'bicipiti' || 'tricipite' || 'tricipiti':
                agent.add('In generale, il grasso localizzato in eccesso non è un problema risolvibile soltanto con una dieta'+ 
                'e in breve termine. Per tale motivo il primo consiglio è quello di rivolgersi ad un esperto per un programma dettagliato.'+ 
                'Tuttavia ci sono alimenti che vanno preferiti ed altri fortemente sconsigliati. ' + 'Vediamone alcuni: prediligere in generale cibi integrali a zuccheri e grassi saturi.' + 
                'Altri alimenti consigliati sono la frutta, le verdure,'+ 
                'le carni magre(pollo,tacchino),uova e i semi. Assumente i carboidrati ad assorbimento più lento, come le patate dolci,la farina d’avena e il riso integrale.');

                agent.add('per il grasso in eccesso sulle braccia ti consiglio https://www.my-personaltrainer.it/allenamento-definizione.html ');
                
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');    
                break;

            case 'addominali' || 'addominale' || 'addome' || 'pancia' || 'fianchi' || 'ventre':
                agent.add('In generale, il grasso localizzato in eccesso non è un problema risolvibile soltanto con una dieta'+ 
                'e in breve termine. Per tale motivo il primo consiglio è quello di rivolgersi ad un esperto per un programma dettagliato.'+ 
                'Tuttavia ci sono alimenti che vanno preferiti ed altri fortemente sconsigliati. ' + 'Vediamone alcuni: prediligere in generale cibi integrali a zuccheri e grassi saturi.' + 
                'Altri alimenti consigliati sono la frutta, le verdure,'+ 
                'le carni magre(pollo,tacchino),uova e i semi. Assumente i carboidrati ad assorbimento più lento, come le patate dolci,la farina d’avena e il riso integrale.');

                agent.add('Per il grasso addominale si consigliano esercizi mirati come crunch. Per approndire https://www.my-personaltrainer.it/alimentazione/dimagrire-la-pancia.html');
                
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
                break;
            
            default:
                agent.add('Non credo di aver capito, puoi riformulare la domanda?');
            





        }


    }

    function consiglioCrampi(agent){

        let card = new Card('Per i crampi');
        let card2 = new Card('Per i crampi');
        let card3 = new Card('Per i crampi');
        let cardConsiglio = new Card('CONTATTA UN ESPERTO');
        

        var prova = db.collection('bevande').doc('WmQ65KyXQKyd0xyMZNgI');
         return prova.get()
          .then(doc => {
            if (!doc.exists) {
                agent.add('documento inesistente');
              return console.log('No such document!');
            } else {
                agent.add('I crampi possono essere indice di svariate patologie ma solitamente per le categorie di persone come gli anziani,'+
                ' le donne in stato di gravidanza, le mamme in allattamento e gli sportivi. Sono una chiara manifestazione di carenza di magnesio.' +
                'Purtroppo l’agricoltura dei nostri giorni fa si che le verdure sulle nostre tavole siano sempre più povere di questo sale eccezionale.');
                
                agent.add('Per chi soffre di '+ doc.data().patologia + ' il consiglio principale '+
                'è quello di bere ogni giorno almeno 2 litri d’acqua ricca di magnesio'+' con valori maggiori di '+ doc.data().magnesio + ' mg/l');
                card.setImage(doc.data().img.url1);
                card2.setImage(doc.data().img.url2);
                card3.setImage(doc.data().img.url3);
                agent.add(card);
                agent.add(card2);
                agent.add(card3);
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
              return console.log('nome: ', doc.data().patologia);
              
            }
          })
          .catch(err => {
              agent.end('errore');
            return console.log('Error getting document', err);
          });

    }



    function consiglioCalcoli(agent){
        let card = new Card('Per saperne di più');
        let card2 = new Card('Prodotti consigliati per i calcoli');
        let cardConsiglio = new Card('CONTATTA UN ESPERTO');
        
        var prova = db.collection('bevande').doc('MIrb27h75Zu1kw49to8M');
         return prova.get()
          .then(doc => {
            if (!doc.exists) {
                agent.add('documento inesistente');
              return console.log('No such document!');
            } else {
                agent.add(' Per chi soffre di ' + doc.data().patologia + ' sono preferibili acque oligominerali' + 
                ' o minimamente mineralizzate per limitare la quantità di sodio e Sali.'+
               ' Il valore ideale di sodio non deve superare i '+ doc.data().sodio + 'mg/l');
                
                agent.add('Per saperne di più https://www.my-personaltrainer.it/rimedi/calcoli-renali.html');
                card2.setImage(doc.data().img.url1);
                card.setImage(doc.data().img.url2);
                agent.add(card);
                agent.add(card2);
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
              return console.log('nome: ', doc.data().patologia);
              
            }
          })
          .catch(err => {
              agent.end('errore');
            return console.log('Error getting document', err);
          });

    }



    function consiglioOsteoporosi(agent){

        let card = new Card('Per saperne di più');
        let card2 = new Card('Per osteoporosi');
        let card3 = new Card('Per osteoporosi');
        let cardConsiglio = new Card('CONTATTA UN ESPERTO');
        
        var prova = db.collection('bevande').doc('lmc7Shlt8SgBWMJnUxXA');
         return prova.get()
          .then(doc => {
            if (!doc.exists) {
                agent.add('documento inesistente');
              return console.log('No such document!');
            } else {
                agent.add(' Per chi soffre di ' + doc.data().patologia + ' sono consigliate acque ricche di calcio e povere di sodio.' + 
                ' Alcune acque mediominerali e le stesse acque potabili ad alto contenuto in calcio contribuiscono in maniera non trascurabile ' + 
                'alla copertura del fabbisogno quotidiano di questo prezioso minerale.'+ 
                ' Come valore nutrizionale il livello di calcio in mg/lt deve essere preferibilmente pari o superiore a '+ doc.data().calcio);

                agent.add('Approfondisci: https://www.my-personaltrainer.it/dieta/dieta-osteoporosi.html');
                card2.setImage(doc.data().img.url1);
                card3.setImage(doc.data().img.url2);
                
                agent.add(card2);
                agent.add(card3);
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');
              return console.log('nome: ', doc.data().patologia);
              
            }
          })
          .catch(err => {
              agent.end('errore');
            return console.log('Error getting document', err);
          });


    }

    function consiglioNopatologie(agent){
        let card = new Card('Prodotti consigliati ');
        let cardConsiglio = new Card('CONTATTA UN ESPERTO');
        var prova = db.collection('bevande').doc('s9GRjmyssuIleFh80x0V');
        
        return prova.get()
          .then(doc => {
            if (!doc.exists) {
                agent.add('documento inesistente');
              return console.log('No such document!');
            } else {
                agent.add('La bevanda ideale deve possedere diverse caratteristiche: innanzitutto deve '+
                'essere facilmente assorbibile ma senza causare problemi gastrointestinali. Per essere rapidamente'+
                ' assorbibile l\'acqua dev\'essere moderatamente refrigerata (circa 10°) e  deve contenere una '+
                'minima quantità di carboidrati (5-8%) non superiore al 10%. ');

                agent.add('Approfondisci qui: https://www.my-personaltrainer.it/idratazione.htm');
                card.setImage(doc.data().img.url1);
                agent.add(card);
                agent.add('Ricorda che questi sono semplici consigli che non sostituiscono un parere medico.'+ 
                ' Consulta sempre il tuo medico di fiducia');
                cardConsiglio.setButton({
                    text: 'Contatta',
                    url: 'https://www.paginegialle.it/nutrizionista.htm'
                });
                agent.add(cardConsiglio);
                agent.add('Per qualsiasi altra informazione sono disponibile ad aiutarti ;)');

              return console.log('nome: ', doc.data().patologia);
            }
          })
          .catch(err => {
              agent.end('errore');
            return console.log('Error getting document', err);
          });
    }





    function dammiAlimento(agent){

        var alimento = agent.parameters.alimenti;
        let url;
        let nomeAlimento;
        let proteineAlimento;
        let categoriaAlimento;
        let carboidratiAlimento;
        let grassiAlimento;
        var queryRef = db.collection('alimenti').where('nome', '==', alimento);
         return queryRef.get()
          .then((snapshot) => {
              snapshot.forEach((doc) =>{
            nomeAlimento = doc.data().nome;
            proteineAlimento = doc.data().nutrienti.proteine;
            categoriaAlimento = doc.data().categoria;
            carboidratiAlimento = doc.data().nutrienti.carboidrati;
            grassiAlimento = doc.data().nutrienti.grassi;
            
            
          });
            
            console.log(agent.parameters.alimenti); 

            if(alimento !== nomeAlimento){
                url = 'https://www.google.it/search?q=';
                agent.add('Il mio database è in continuo aggiornamento e per questo non conosco ancora tutti gli alimenti.' +
                 ' Ti mostrerò cosa ho trovato su internet:');
    
                agent.add('https://www.google.it/search?q=nutrienti+' + alimento);

            }else{
            agent.add('Ecco i valori nutrizionali per '+ nomeAlimento);
            agent.add('L\'alimento '+ nomeAlimento + ' è nella categoria '+ categoriaAlimento+ ' ed ha i seguenti valori nutrizionali per 100g di prodotto ');
            agent.add('carboidrati = '+ carboidratiAlimento + ' Kcal');
            agent.add('grassi = '+ grassiAlimento + ' Kcal');
            agent.add('proteine = '+ proteineAlimento + ' Kcal');
            }
            
            return console.log('errore_then');

        })

          .catch(err => {
              agent.end('errore_catch');
            return console.log('Error getting document', err);
          });
   
      }




   /*   db.collection('users').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  }); */












    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('2.1 consiglio_attivita_fisica - custom', attivitaFisica );
    intentMap.set('2.2 consiglio_pasto_dietetico', pastoDietetico);
    intentMap.set('2.3 consiglio_intolleranze_allergie', noIntolleranzeAllergie);
    intentMap.set('2.4 consiglio_idratazione - crampi', consiglioCrampi);
    intentMap.set('2.4 consiglio_idratazione - calcoli', consiglioCalcoli );
    intentMap.set('2.4 consiglio_idratazione - osteoporosi', consiglioOsteoporosi);
    intentMap.set('2.4 consiglio_idratazione - nopatologie', consiglioNopatologie);
    intentMap.set('2.5 consiglio_grasso_locale - custom', consiglioGrasso);
    





    intentMap.set('3.1 ottieni_alimento', dammiAlimento);

    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});
