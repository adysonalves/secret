const form = document.querySelector('.form-ask');
const containerCadastro = document.querySelector('.cadastro');
const popup = document.querySelector('.popup');
const urlUser = document.querySelector('.urlUser');
const url = window.location.href;

form.action = url + '/ask';

function copiarPerfil(){
    const perfilAtual = urlUser.value
    urlUser.value = `${location.origin}${urlUser.value}`;
    urlUser.select();
    document.execCommand('copy');
    setTimeout(() => {
        urlUser.value = perfilAtual
        alert('Perfil copiado com sucesso!')
    }, 100);
    
}



function closePopup(){
    popup.style.display = 'none';
    containerCadastro.style.opacity = '1'
}






