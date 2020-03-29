var myLanguage = navigator.language || navigator.userLanguage;

var languages = {
  'nl-NL': {
    'subtitle': 'Anoniem chatten',
    'join-a-chat': 'Begin met chatten',
    'slogan': 'Begin een gesprek met andere mensen die zich eenzaam voelen vanwege de corona-maatregelen. Je blijft anoniem.', 
    'chat-name-label': 'Naam',
    'chat-name': 'Chat naam',
    'join-button': 'Meedoen',
    'rooms-label': 'Kamers'
  }
}

if (languages[myLanguage]) {
  for (const property in languages[myLanguage]) {
    document.getElementById(property).innerHTML = languages[myLanguage][property];
  }
}

console.log("Your language is " + myLanguage);