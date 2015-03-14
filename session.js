///////////////////////////////////////////////////////////////////////////////////////////////
//		
//		CLIENT SIDE SESSION OBJECT
//		author: paul i
//		date:   3/14/2015 
//		notes:  -----------------------------------------------------------------------------------------------
//				-- created to add ability to track user interaction that should control session timeout 
//				-- as opposed to server (c# .net in my case) using page requests alone to determine when to abandon the session.
//				-- (so a user can be activley using a site but not send a page request to the server, can cause loss of data etc... and should be an active session)
//              --
//				-- SESSION.HTM is just to validate with console.logs basic functionality (please remove console logs before using on production :) )
//				-----------------------------------------------------------------------------------------------
//
//
//		NOTE (editable values):  
//			timeOutLength property = session length
//			userEvents[] array = events that keep session active
//			timeOutLengthCountDown() method = used to call a server controller that handles killing the session, edit as needed for your environment
//      
//
//		BASIC INFO ON MPSESSION METHODS:
//
//		bindUserEvents()
//			Binds events to window to track if user is utilizing the site so we do not kill session
//			User Events (userEvents[]) that are bound to window obj and cause the session time to increase
//				* click, scroll, resize, keydown
//				* Page requests cause the existing object be removed from memory and a new instance is created (i.e. no page load event is needed here)
//
//		pageCountDownValidateSession()
//			If the timer reaches (2 minutes) POST to the 
//			Account/LogOff and validate server session time.
//      	2 cases exist now:  
//				a.) server time matches client time = do nothing
//				b.) server time does not match = match server time to client (add time to servers session)
//
//		timeOutLengthCountDown()
//			If the timer expires (10 minutes) POST to the 
//			Account/LogOff and controller will kill 
//			session and handle redirect to Login Page
//
//		TODO:
//			add dialog before session ends that allows user to click 'OK' to reset session
///////////////////////////////////////////////////////////////////////////////////////////////


(function(parameter){

	mpSession = {

		timeOutLength: 10,

		userEvents: [
			'click','scroll','resize','keydown'
		],

		bindUserEvents: function() {
			for(i=0;i<=mpSession.userEvents.length;i++)
			{
				$(window).on(mpSession.userEvents[i],function(event){
					
					console.log("USER INTERACTION = " + event.type + " reset the session timer")
					
					mpSession.resetTimeOutLength();
				});
			}

			//event listeners are attached to the window object, start count down
			mpSession.timeOutLengthCountDown();		
		},

		resetTimeOutLength: function() {
			mpSession.timeOutLength = 10;

			console.log("IN RESET . length = " + mpSession.timeOutLength);

			//can remove session count here if desired, cough cough like development in localhost for example...
			//clearInterval(mpSessionInterval);
		},

		pageCountDownValidateSession: function() {
			setInterval(function(){
				
				if(mpSession.timeOutLength > 2)
				{
					timeToAdd = mpSession.timeOutLength - 2;
					// Ajax to your servers SessionTimeout method to check server session time and add to it.

					$.ajax({
						data: { 'timeToAdd' : timeToAdd },
                        url: '/Account/SessionTimeout', 
                        dataType: 'json',
                        
                        type: "POST",

                        error: function () {
                            console.log(" An error occurred.");
                        },
                        success: function (data) {
                        	//add piece here to display warning
                            console.log("success" + data);
                        }
                    });
				}

			}, 80000)
		},

		timeOutLengthCountDown: function() {
			setInterval(function(){
				mpSession.timeOutLength --;
				
				console.log("IN count down INTERVAL TICK and length = " + mpSession.timeOutLength);
				
				//redirect user to login / send flag to server to end session
				//TODO add dialog to display warning to user that session is ending (add countdown). 
				//TODO user may click OK to reset session.				
				if(mpSession.timeOutLength <= 0) 
				{ 
					console.log("SESSION END, submit logout form, controller will redirect user to login and end the session"); 

					$('#logoutForm').submit(); 					
				}
			}, 10000);
		},
	}
	//call bind method then return object to global namespace
	mpSession.bindUserEvents();

	return mpSession;

})('pageLoadBeginSession');
