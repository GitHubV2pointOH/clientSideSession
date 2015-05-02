# clientSideSession
javascript session

NOTE:  session.js is commented and provides a more detailed description as to the specifics of the objects methods / functionality.

uses client events declared in a anonymous closure to determine session timeout (events and time are dynamic) in the browser, afterwhich the server is 'updated'
  (server will kill session only after the mpSession object calls controller method (or whatever you env requires)... no longer solely determined
  by page requests (default behavior with .net c# sessions).   
  
  the above default behavior created issues with users on our site as they were potentially active on a page (reading , creating artwork and lingo, editing settings , etc..)
  but did not make a page request (save a form , attempt to go to another page etc...) within the server session timeframe... so the session
  was ending but the client had no knowledge of this, caused loss of data and angry people :)
  (click, key press, scroll, resize window). 
  
  however your environment handles killing the session, the mpSessions timeOutLengthCountDown() method should replace any functionality
  that determines when to kill / abandon the session.
