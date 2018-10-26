// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

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
        
        const intensita = agent.parameters.intensitaAllenamento;
        const contesto = agent.getContext('21-consiglio_attivita_fisica-followup');
        const allenamento = contesto.parameters.allenamento;

        if(intensita == 'leggero' || intensita == 'leggera'){
            
            agent.add('bene. Ti consiglio di mangiare un paio d’ore prima dell’inizio dell’allenamento'+ 
            'cibi con prevalenza di carboidrati(anche un po di pasta o pane va bene).'+ 
            'Per quanto riguarda il post allenamento va bene della frutta o un bicchiere di latte,' +  
            'al limite se si ha molta fame andrebbe bene un piccolo panino, senza esagerare. In ogni caso ti consiglio di consultare questo link'
            +'per maggiori informazioni:  https://www.fondazioneveronesi.it/magazine/articoli/lesperto-risponde/cosa-mangiare-prima-di-fare-sport ');
        }
        else{

            agent.add('Bene. Innanzitutto ricorda di bere regolarmente anche prima dell’inizio dell’allenamento.' +
            'Un pasto completo va consumato almeno 2-3 ore prima dell’allenamento, molto importante è la presenza di proteine.'+ 
            'Va bene anche uno snack ricco di carboidrati 10 minuti prima dell’inizio dell’allenamento.'+ 
            'Per maggiori informazioni puoi consultare la seguente fonte https://www.runtastic.com/blog/it/sport-cosa-mangiare-prima-e-dopo-un-allenamento/');
            agent.add ('buon allenamento');

        }

    }

    //match with intent 2.2 consiglio_pasto_dietetico
    function pastoDietetico (agent){
            const pasto = agent.parameters.pastoDietetico;
            switch (pasto){
                case 'colazione dietetica':
                    agent.add ('Per una prima colazione completa e leggera sono ottimi i carboidrati forniti'+
                    'dalla frutta e dai frullati. Carboidrati complessi arriveranno dai fiocchi d’avena, muesli non zuccherati, '+
                    'gallette di riso e fette biscottate. È preferibile un leggero latte scremato o parzialmente scremato, senza dimenticare il latte di soia. '+
                    'Per approfondire  https://www.my-personaltrainer.it/alimentazione/colazione-dietetica.html ');
                    break;
                case 'pranzo dietetico':
                    agent.add('Bene, anzitutto cereali integrali , aiutano a placare il senso di fame per più tempo. Quindi verdure, legumi e quinoa, che danno'+
                    'il giusto apporto proteico e non contengono grassi. Per approfondire ti consiglio un articolo di un esperto'+
                    ' https://www.vanityfair.it/vanityfood/ricevere/15/06/11/10-piatti-light-da-mangiare-in-pausa-pranzo-per-dimagrire');
                    break;
                case 'cena dietetica':
                    agent.add('Per una cena dietetica scegli innanzitutto la cottura giusta:  no quindi alla frittura, sì alle cottura a vapore, al cartoccio '+
                    'o al forno! Gli alimenti preferibili sono quelli ricchi di fibre e proteine, pochi carboidrati. Ricorda che un consiglio di un esperto'+
                    ' è sempre la prima scelta. Altre informazioni le trovi anche qui https://www.alfemminile.com/dieta-dimagrante/cena-dietetica-s2866728.html' );
                    break;
                case 'spuntino dietetico' || 'snack dietetico':
                    agent.add('Ottimo! Ci sono diversi alimenti che puoi usare come idee snack! Per esempio potresti fare uno spuntino con carote, 1-2 uova'+
                     'sode con olio sale e pepe, 1 toast con petto di tacchino, formaggio spalmabile e sottaceti come salato. Se preferisci uno spuntino dolce'+
                     ' puoi pensare a 1 yogurt, 1 fetta di melone o 1 barretta ai cereali. Se vuoi altri consigli consulta'+
                     ' https://www.donnaclick.it/salute-donna/dieta/9563/spuntini-dietetici-23-idee-anti-fame-per-tutta-la-giornata/');
                    break;

                default:
                    agent.add('Non credo di aver capito, puoi riformulare la domanda?');
            }
    }

    function provadue(agent){
        const pasto = agent.parameters.pasto;
        const tipopasto = agent.parameters.tipoPasto;
        agent.add('ok' + pasto + tipopasto);
    }


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
    intentMap.set('2.1 consiglio_attivita_fisica - custom',attivitaFisica );
    intentMap.set('2.2 consiglio_pasto_dietetico', pastoDietetico);

    intentMap.set('prova', provadue);

    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});
