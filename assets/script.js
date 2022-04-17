const baseURL = "http://localhost:3000/armaduras";

async function findAllArmaduras() {
    const resp = await fetch(`${baseURL}/todas-armaduras`);

    const armaduras = await resp.json();

    armaduras.forEach(function(armadura) {
        document.querySelector('#container').insertAdjacentHTML('beforeend',`

         <div class= "card" id="card_${armadura.id}">

            <img class="arm_imagem" src="${armadura.imagem}" alt="armadura sagrada">
            <div class="content-card">
                <div class="arm_nome">${armadura.nome}</div>
                <div class="arm_usuarios">Usuários: ${armadura.usuarios}</div>
                 <div class="btns-card">
                    <button onclick ="abrirCadastro(${armadura.id})" class="edit">Editar</button>
                    <button  onclick = "abrirDelete(${armadura.id})" class="del" >Apagar</button>
                 </div>
            </div>
           
        </div>
        
        `)
    });
}

async function armadurasByID(){
    const id = document.querySelector("#id_arm").value

    const resp = await fetch(`${baseURL}/armadura/${id}`);
    const armadura = await resp.json();

    const armaduraDiv = document.querySelector('#arm_selecionada');

    armaduraDiv.innerHTML = `
        <div class= "card_s" id="card_s_${armadura.id}">
            <img class="arm_s_imagem" src="${armadura.imagem}" alt="armadura sagrada">
            <div>
                <div class="arm_s_nome">${armadura.nome}</div>
                <div class="arm_s_usuarios">Usuários: ${armadura.usuarios}</div>
            </div>
         </div>
    `

} 

findAllArmaduras()

async function abrirCadastro (id = null){

    if(id != null){
    document.querySelector("#titulo-modal").innerText = "Atualizar Armadura Sagrada"

    document.querySelector("#btn-modal").innerText = "Atualizar"
    
    const resp = await fetch(`${baseURL}/armadura/${id}`);
    const armadura = await resp.json();

        document.querySelector('#id').value = armadura.id

        document.querySelector('#nome').value = armadura.nome

        document.querySelector('#descricao').value = armadura.descricao

        document.querySelector('#usuarios').value = armadura.usuarios

        document.querySelector('#background').value = armadura.background

        document.querySelector('#imagem').value = armadura.imagem

    }else{
        document.querySelector("#titulo-modal").innerText = "Cadastrar Armadura Sagrada"

        document.querySelector("#btn-modal").innerText = "Cadastrar"
    

    }

    const modal = document.querySelector("#overlay").style.display = "flex";
}



function fecharCadastro (){
    const modal = document.querySelector("#overlay").style.display = "none";

        document.querySelector('#id').value = "";

        document.querySelector('#nome').value = "";

        document.querySelector('#descricao').value = "";

        document.querySelector('#usuarios').value = "";

        document.querySelector('#background').value = "";

        document.querySelector('#imagem').value = "";
}

async function createArmadura(){

    let id = document.querySelector('#id').value;

    let nome = document.querySelector('#nome').value;

    let descricao = document.querySelector('#descricao').value;

    let usuarios = document.querySelector('#usuarios').value;

    let background = document.querySelector('#background').value;

    let imagem = document.querySelector('#imagem').value;

    let armadura = {

        id,
        nome,
        descricao,
        usuarios,
        background,
        imagem,
    };

    const modoEdit = id>0;

    const endpoint = baseURL + (modoEdit ? `/update/${id}` : `/create`)

    const resp = await fetch(endpoint, {
        method: modoEdit ? "put" : "post",
        headers:{
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(armadura),
    });

    

    const newArmadura = await resp.json();

    const html =  `
    <div class= "card" id="card_${armadura.id}">

            <img class="arm_imagem" src="${newArmadura.imagem}" alt="armadura sagrada">
            <div>
                <div class="arm_nome">${newArmadura.nome}</div>
                <div class="arm_usuarios">Usuários: ${newArmadura.usuarios}</div>
                 <div class="btns-card">
                    <button onclick ="abrirCadastro(${newArmadura.id})" class="edit">Editar</button>
                    <button class="del">Apagar</button>
                 </div>
            </div>
           
        </div>
        `

    if(modoEdit){
        document.querySelector(`#card_${id}`).outerHTML = html
    } else{
        document.querySelector("#card_container").insertAdjacentElement("beforeend", html);
    }

    fecharCadastro();
}

function abrirDelete(id){
    document.querySelector("#overlay-del").style.display  = "flex";

    const btnS = document.querySelector(".btn-s")

    btnS.addEventListener("click", function(){
        armaduraDel(id)
    })
}

function fecharDelete(){
    const modal = document.querySelector("#overlay-del").style.display = "none";
}

async function armaduraDel(id){
    const resp = await fetch(`${baseURL}/delete/${id}`, {
        method: "delete",
        headers:{
            "Content-Type": "application/json",
        },
        mode: "cors",
    });
    const result = await resp.json();
    alert(result.message);

     document.querySelector('#container').innerHTML = "";

    fecharDelete();
    findAllArmaduras();
}