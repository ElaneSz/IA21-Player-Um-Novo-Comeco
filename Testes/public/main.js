const { response } = require("express")
const domMovieList = document.querySelector("ul.movie-list")
const domFormAlterar = document.querySelector("form.form-alterar")
const loginModal = document.querySelector("dialog")
const loginForm = loginModal.querySelector("form")
const loginMsg = loginModal.querySelector(".msg")
const loginFormButtonSend = loginModal.querySelector(".bt-send")

// ---✀------------------------------------------------------------------

if (!localStorage.getItem("token")){
    loginModal.showModal()
} else {
    listarTodosOsFilmes()
}

loginFormButtonSend.addEventListener("click", async ev => {
    const { login, senha } = loginForm
    const response = await fetch(`/login?login=${login.value}&senha=${senha.value}`)
    const data = await response.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
      loginModal.close()
      listarTodosOsFilmes()
      return
    }
    loginMsg.innerHTML = `<strong>Usuário e/ou senha inválidos</strong>`
  })

// ---✀------------------------------------------------------------------
async function listarTodosOsFilmes() {
    const response = await fetch(`/movies?token=${localStorage.getItem("token")}`)
    const movies = await response.json()
    domMovieList.innerHTML = ""
    movies.forEach(movie => {
        domMovieList.innerHTML += `
                        <li class="movie">
                            <div>
                                <strong>Title:</strong> <input name="title" value="${movie.title}">
                            </div>
                            <ul>
                                <li>    
                                    <strong>Source:</strong> <input name="source" value="${movie.source}">
                                </li>
                                <li>
                                    <strong>Thumb:</strong> <input name="thumb" value="${movie.thumb}">
                                </li>
                                <li>
                                    <strong>Description:</strong> <input name="description" value="${movie.description}">
                                </li>
                                <li class="botoes">
                                    <button class="excluir" data-id="${movie.id}">Excluir</button>
                                    <button class="alterar" data-id="${movie.id}">Alterar</button>
                                </li>
                            </ul>
                        </li>
                        `
    });
}

// ---✀------------------------------------------------------------------
domFormAlterar.addEventListener("submit", async ev => {
    ev.preventDefault()
    ev.stopPropagation()
    ev.stopImmediatePropagation()

    const body = JSON.stringify({
        title: domFormAlterar.title.value,
        source: domFormAlterar.source.value,
        description: domFormAlterar.description.value,
        thumb: domFormAlterar.thumb.value,
    })

    const response = await fetch(`/movies?token=${localStorage.getItem("token")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    })

    const result = await response.json()
    domFormAlterar.reset()

    listarTodosOsFilmes()
})

// ---✀------------------------------------------------------------------
domMovieList.addEventListener("click", async ev => {
    const el = ev.target

    if (el.classList.contains("excluir")) {
        id = el.dataset.id
        const response = await fetch(`/movies/${id}`, { method: "DELETE" })
        const movies = await response.json()
        listarTodosOsFilmes()
        return
    }

    if (el.classList.contains("alterar")) {
        const parent = el.closest(".movie")
        const inputs = parent.querySelectorAll("[name]")
        const body = {}
        id = el.dataset.id
        //console.log(id,id,id,id,id,id,id);
        //console.log(body)
        inputs.forEach(input => body[input.name] = input.value)
        const response = await fetch(`/movies/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        const movies = await response.json()
        return
    }
})

// OAuth | Login com o FaceBook

//npm create vite@latest | TS + SWC
//58 | Descomentar e adicionar 'dist'