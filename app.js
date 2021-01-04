// const DB = firebase.firestore();

const app = Sammy('#root', function(){
    this.use('Handlebars', 'hbs');

     //GET
     this.get('/home', function(context){
        
//         DB.collection('recepies')
//             .get()
//                 .then((res) => {

//                     context.recepies = res.docs.map((recepie) => {
//                         return { id: recepie.id, ...recepie.data()}
//                     })
                     loadHeaderAndFooter(context).then(function(){
                         this.partial('./templates/home.hbs')
                     }); 
             });
            
            
            
//         })

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

//     this.get('/logout', function(context){
//         firebase.auth()
//             .signOut()
//             .then(() => {
//                 localStorage.removeItem('userInfo');
//                 alert('Logged out!');
//                 context.redirect('/home');
//             })
//             .catch(e => errorHandling(e))
//     })

//     //GET Offers
//     this.get('/createOffer', function(context){ 
//         loadHeaderAndFooter(context).then(function(){
//             this.partial('./templates/createOffer/createOffer.hbs')
//         });
//     });

//     this.get('/editOffer/:offerid', function(context){
//         const offerId = context.params.offerid;
//         console.log(offerId);
        
        
//          DB.collection('offers')
//           .doc(offerId)
//           .get()
//           .then((res) => {
//                 context.offer = {id: offerId, ...res.data()}
//              console.log(context.offer);
//              loadHeaderAndFooter(context).then(function(){
//                 this.partial('./templates/editOffer/editOffer.hbs')
//             });
//           })
        
        
//     });

//      this.get('/details/:offerId', function(context){
//          const {offerId} = context.params;
//          console.log(offerId);
         
//          DB.collection('offers')
//          .doc(offerId)
//          .get()
//          .then((res) => {
//              const {uid}  = getUserData();
//             console.log(uid);
            
//              const actualOfferData = res.data();
//              const imTheSalesman = actualOfferData.salesman === uid;
//              console.log(actualOfferData.clients);
             
//              const userIndex = actualOfferData.clients.indexOf(uid);
//              console.log(userIndex);
             
//              const imInTheClientsList = userIndex > -1
             
//              context.offer = {...actualOfferData, imTheSalesman, id: offerId, imInTheClientsList};
//              loadHeaderAndFooter(context).then(function(){
//                 this.partial('./templates/details/details.hbs')
//             });
//          })
//      });

//      this.get('/deleteOffer/:offerId', function(context){
//         const {offerId} = context.params;
//         console.log(offerId);
        
//         DB.collection('offers').doc(offerId).delete().then(function(){
//             alert(`Offer secessfully deleted!`)
//             context.redirect('/home')
//         }).catch(e => errorHandling(e))
        
//     });

//     //POST
//     this.post('/register', function(context) {
//         let {email, password, repeatPassword} = context.params;

//         if(password.length < 6){
//             alert('Password should be at least 6 characters long!');
//             email = '';
//             password = '';
//             repeatPassword = '';
//             return;
//         }
//         if (password !== repeatPassword && password.length >= 6) {
//             alert('Passwords are not the same!');
//             return;
//         }
//         if (!email) {
//             alert('Please enter your email!');
//             return; 
//         }
     
//         firebase.auth()
//         .createUserWithEmailAndPassword(email, password)
//          .then(() => {
//             alert('Congrats! You are registered!');
//              context.redirect('/login');
//          }).catch(e => errorHandling(e))
//     });

//     this.post('/login', function(context) {
//         let {email, password} = context.params;
//         console.log(email + password)
//         firebase.auth().signInWithEmailAndPassword(email, password)
//         .then((res) => {
//             saveUserdata(res)
//             alert(`Hello ${res.user.email}`);
//             context.redirect('/home')
        
//         }).catch(e => errorHandling(e));
        
//     })

//     this.post('/createOffer', function(context) {
//         const {productName, price, imageUrl, description, brand} = context.params;

//         DB.collection('offers').add({
//             productName,
//             price,
//             imageUrl,
//             description, 
//             brand,
//             salesman: getUserData().uid,
//             clients: [],
//         })
//             .then((createdProduct) => {
//                 console.log(createdProduct);
//                 this.redirect('/home');
//             })
//             .catch(e => errorHandling(e));
        
//     });

//     this.post('/editOffer/:offerId', function(context) {
//         const {offerId, productName, price, brand, description, imageUrl} = context.params;

//         DB.collection('offers')
//         .doc(offerId)
//         .get()
//         .then((res) => {
//             return DB.collection('offers')
//                 .doc(offerId)
//                 .set({
//                     ...res.data(),
//                     offerId, 
//                     productName, 
//                     price, 
//                     brand, 
//                     description, 
//                     imageUrl,
//             })

//         }).then(res => {
//             context.redirect(`/details/${offerId}`)
//         }).catch(e => errorHandling(e))
    
// });

// //for buy
// this.get('/buy/:offerId', function(context){
//     const {offerId} = context.params;
//     const userId = getUserData().uid;
//     DB.collection('offers')
//     .doc(offerId)
//     .get()
//     .then((res) => {
//         const offerData = { ...res.data()};
//         offerData.clients.push(userId)
//         return DB.collection('offers')
//         .doc(offerId)
//         .set(offerData)
//     })
//     .then(() => {
//         alert('Liked successfully!')
//         this.redirect(`#/details/${offerId}`)
//     })
//     .catch(e => errorHandling(e))
// })
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
