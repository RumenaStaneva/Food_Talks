const DB = firebase.firestore();

const app = Sammy('#root', function(){
    this.use('Handlebars', 'hbs');

     //GET
    this.get('/home', function(context){
        
         DB.collection('recepies')
             .get()
                 .then((res) => {

                     context.recepies = res.docs.map((recepie) => {
                         console.log(recepie.data());
                         
                         return { id: recepie.id, ...recepie.data()}
                     })
                     loadHeaderAndFooter(context).then(function(){
                         this.partial('./templates/home.hbs')
                     }); 
             });
            
            
            
         })

    this.get('/register', function(context){
        
         loadHeaderAndFooter(context).then(function(){
             this.partial('./templates/register.hbs')
         });
     });

    this.get('/login', function(context){
        
         loadHeaderAndFooter(context)
             .then(function(){
             this.partial('./templates/login.hbs')
         })
     });

    this.get('/logout', function(context){
         firebase.auth()
             .signOut()
             .then(() => {
                 localStorage.removeItem('userInfo');
                 alert('Logged out!');
                 context.redirect('/home');
             })
             .catch(e => errorHandling(e))
     });

    this.get('/myRecepies', function(context){
        
        loadHeaderAndFooter(context)
            .then(function(){
            this.partial('./templates/myRecepies.hbs')
        })
    });

    this.get('/aboutUs', function(context){
        
        loadHeaderAndFooter(context)
            .then(function(){
            this.partial('./templates/aboutUs.hbs')
        })
    });

    this.get('/createRecipe', function(context){
        
        loadHeaderAndFooter(context)
            .then(function(){
            this.partial('./templates/createRecipe.hbs')
        })
    });



     //POST
     this.post('/register', function(context) {
         let {email, password, repeatPassword} = context.params;

         if(password.length < 6){
             alert('Password should be at least 6 characters long!');
             email = '';
             password = '';
             repeatPassword = '';
             return;
         }
         if (password !== repeatPassword && password.length >= 6) {
             alert('Passwords are not the same!');
             return;
         }
         if (!email) {
             alert('Please enter your email!');
             return; 
         }
     
         firebase.auth()
         .createUserWithEmailAndPassword(email, password)
          .then(() => {
             alert('Congrats! You are registered!');
              context.redirect('/login');
          }).catch(e => errorHandling(e))
     });

     this.post('/login', function(context) {
         let {email, password} = context.params;
         console.log(email + password)
         firebase.auth().signInWithEmailAndPassword(email, password)
         .then((res) => {
             saveUserdata(res)
             alert(`Hello ${res.user.email}`);
             context.redirect('/home')
        
         }).catch(e => errorHandling(e));
        
     });

     this.post('/createRecipe', function(context) {
         const {recipeName, ingredients, hours, minutes, instructions, imgUrl} = context.params;

         DB.collection('recepies').add({
            recipeName,
            ingredients,
            hours,
            minutes,
            instructions, 
            imgUrl,
            creator: getUserData().uid,
            peopleWhoLiked: [],
         })
             .then((createdRecipe) => {
                 console.log(createdRecipe);
                 this.redirect('/home');
             })
             .catch(e => errorHandling(e));
        
     });


});

function loadHeaderAndFooter(context) {
    const user = getUserData();
    context.loggedIn = Boolean(user);
    context.email = user ? user.email : '';
    return context.loadPartials({
        'header': './templates/common/header.hbs',
        'footer': './templates/common/footer.hbs'
    });
};

 function errorHandling(error){ 
     alert(error)
 }

 function saveUserdata(data){
     const {user: {email, uid}} = data
     localStorage.setItem('userInfo', JSON.stringify({email, uid}))
 }

 function getUserData(){

     const user = localStorage.getItem('userInfo');
     return user ? JSON.parse(user) : null;
 }

(() => {
    app.run('/home')
})();
