// Feedback


const btn = document.querySelector('.telephone'),
      feedback = document.querySelector('.feedback'),
      ex = document.querySelector('.modal__close');
      let pos = 0;

function openAnimation () {
    pos+=10;
    feedback.style.bottom = pos + 'px';

    if (pos < 10) {
        requestAnimationFrame(openAnimation);
    }
 
    btn.style.display = 'none';
}

function closeAnimation () {
    pos-=10;
    feedback.style.bottom = pos + 'px';
    if(pos > -700){
        requestAnimationFrame(closeAnimation);
    }else{
        btn.style.display = '';
    }
}

btn.addEventListener('click', () => requestAnimationFrame(openAnimation));
ex.addEventListener('click', () => requestAnimationFrame(closeAnimation));
// document.addEventListener('click', (e) => {
//     console.dir(e);
//     if(e.target.className == 'order' || e.target.className == 'telephone'){

//     }else{
//         requestAnimationFrame(closeAnimation);
//     }
// });

// Post Feedback

const postData = async (url, data) => {
  
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body:  data
    });

    return await res.json();
};

const forms = document.querySelectorAll('.order__form');
    
const message = {
    loading: 'img/forms/spinner.svg',
    success: 'Спасибо! Скоро с вами свяжемся',
    failure: 'Что-то пошло не так..'
};

forms.forEach(item =>{
    bindPostData(item);
});




function bindPostData(form){
    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        const statusMessege = document.createElement('img');
        statusMessege.src = message.loading;
          feedback.style.height = '600px';
        statusMessege.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMessege);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));
    

        postData('http://localhost:3000/posts', json)
        .then(data => {
            
            showThanksModal(message.success);
          
            statusMessege.remove();
        }).catch(() => {
            showThanksModal(message.failure);
        }).finally(() => {
            form.reset();
          
        });


    });
}




function showThanksModal (message) {

   

    const prevModalDialog = document.querySelector('.order');

    prevModalDialog.classList.add('hide');


    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
        <div class="modal__close" data_close>×</div>
        <div class="modal__title">${message}</div>
        </div>
    `;

   setTimeout(()=>{
    requestAnimationFrame(closeAnimation);
   }, 2000);

    document.querySelector('.feedback').append(thanksModal);
    
    setTimeout(()=>{
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
       
        thanksModal.remove();
    }, 4000);

    

}

document.addEventListener('keydown', (e) => {
    if(e.code === "Escape" && feedback.classList.contains('show')){
        requestAnimationFrame(closeAnimation);

    }
 });

 // GET comments

 const comments = document.querySelectorAll('.comment__form');

 comments.forEach(com =>{
    bindPostCom(com);
 });


 function bindPostCom(com){
    com.addEventListener('submit', (e)=>{
        e.preventDefault();

       

        const formData = new FormData(com);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));
    

        postData('http://localhost:3000/comments', json);
      


    });
}


// POST comments


    //   Использовать классы для карточек

    class omment {
        constructor (namecom, comment, parentSelector) {
            this.namecom = namecom;
            this.comment = comment;
            this.parent = document.querySelector(parentSelector);
        }


        render() {
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.classes = 'new_comment';
                element.classList.add(this.classes)
            }else{
                 this.classes.forEach(className => element.classList.add(className));
            }
           
            element.innerHTML = `
                <h3 class="name">${this.namecom}</h3>
                <h3 class="comment">${this.comment}</h3>
            `;
            
            this.parent.append(element);
            
        }

        
    }


    getResourse('http://localhost:3000/comment')
        .then(data => {
            data.forEach(({name, comment}) =>{
                new comment(name, comment, '.admin').render();
            });
        });

    // axios.get('http://localhost:3000/menu')
    //     .then(data => {
    //         data.data.forEach(({img, altimg, title, descr, price}) =>{
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });
