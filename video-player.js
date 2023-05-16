// ---✀------------------------------------------------------
// ENCONTRANDO DOM DOS PLAYERS
// 

const containers = document.querySelectorAll("div.ia21-player")/*'querySelectorAll' = pega todos daquele tipo*/
        // ---✀------------------------------------------------------
        // PERCORRENDO TODOS OS PLAYERS
        // 

        containers.forEach(async container => { /*forEach = Para cada elemento*/
            // ---✀------------------------------------------------------
            // ENCONTRANDO ELEMENTOS DOM DO PLAYER 
            //

            const playPause = container.querySelector("button.player-pause")
            const video = container.querySelector("video")
            const timeline = container.querySelector(".dragbar.timeline")
            const timelineDrag = timeline.querySelector(".draggable")
            const timer = container.querySelector(".timer")
            const iconVolume = container.querySelector(".iconVolume")
            const dragbars = container.querySelectorAll(".dragbar") /*'Div' onde fica a barra*/
            const playlist = container.querySelector(".playlist")
            const ativar = container.querySelector(".abrir-playlist")

            // ---✀------------------------------------------------------
            // LER PLAYLIST DO ARQUIVO JSON
            //
            const requisicao = await fetch(container.dataset.playlist)
            const lista = await requisicao.json()
            
            lista.forEach(filme => {
                playlist.innerHTML += `
                <div>${filme.title}</div>
                `
            })
            
            ativar.addEventListener("click", () => {
                playlist.classList.toggle("escondido") /*Remover 'Classe'*/
            })

        
            // ---✀------------------------------------------------------
            // BOTÃO PLAY PAUSE
            //

            playPause.addEventListener("click", () => { /*Pausar e dar play*/
                if (video.paused) {
                    video.play()
                    playPause.innerText = playPause.dataset.pauseIcon
                    return
                }
                video.pause()
                playPause.innerText = playPause.dataset.playIcon
            })
            // ---✀------------------------------------------------------
            // CONTADOR DE TEMPO
            //
            
            video.addEventListener("timeupdate", () => {/*Evento para verificação do tempo atual do video*/
                const percent = (video.currentTime / video.duration) * 100
                // 
                const s = Math.floor(video.currentTime)
                const m = Math.floor(s / 60)
                const h = Math.floor(m / 60)
                // 
                const sh = `${h % 60}`.padStart(2, "0")
                const sm = `${m % 60}`.padStart(2, "0")
                const ss = `${s % 60}`.padStart(2, "0")
                //
                timelineDrag.style.setProperty("--percent", `${percent}%`)
                timer.innerText = `${sh}:${sm}:${ss}`

            })
            // ---✀------------------------------------------------------
            // BARRAS (TIMELINE E VOLUME) 
            //
            
            dragbars.forEach(dragbar => {
                const dragabble = dragbar.querySelector(".draggable") /*Div da barra em si*/

                if (dragbar.classList.contains("volume")) {
                    dragabble.style.setProperty("--percent", `100%`)
                }

                // ---✀------------------------------------------------------
                // ICONE DE AUDIO 
                //
                
                let audio = null

                iconVolume.addEventListener("click", () => { 
                    if (!dragbar.classList.contains("volume"))
                        return

                    if (video.volume > 0) { /*Deixa o volume no mudo*/
                        iconVolume.innerText = iconVolume.dataset.volumemudoIcon
                        dragabble.style.setProperty("--percent", `0%`)
                        Audio = true
                        audio = video.volume
                        video.volume = 0
                        return
                    }
                    
                    /*Deixa o volume no maximo*/
                    dragabble.style.setProperty("--percent", `${audio * 100}%`)
                    video.volume = audio
                    iconVolume.innerText = iconVolume.dataset.volumemaxIcon
                })

                dragbar.addEventListener("mousedown", ev => {
                    dragbar.classList.add("dragging") /*Fornece classe*/
                })

                dragbar.addEventListener("mouseup", ev => {
                    dragbar.classList.remove("dragging")
                })

                dragbar.addEventListener("mouseout", ev => {
                    dragbar.classList.remove("dragging") /*Permite que arraste até o fim do elemento*/
                })

                dragbar.addEventListener("mousemove", ev => {
                    if (ev.target != dragbar || !dragbar.classList.contains("dragging"))  /*Se tem a classe 'dragging' ou esta sendo movido na 'dragbar'*/
                      return
              
                    const width = Math.floor(dragbar.getBoundingClientRect().width)
                    const index = (ev.offsetX / width)
                    const percent = index * 100
              
                    dragabble.style.setProperty("--percent", `${percent}%`) /*Coloca a porcentagem no css | Para ficar no local correto*/
                  })

                dragbar.addEventListener("mouseup", ev => {
                    if (ev.target != dragbar)
                        return

                    const width = Math.floor(dragbar.getBoundingClientRect().width)/*Arredondar para menos*/
                    const index = ev.offsetX / width
                    const percent = index * 100
                    dragabble.style.setProperty("--percent", `${percent}%`)

                    if (dragbar.classList.contains("timeline")) {
                        video.currentTime = video.duration * index
                        return
                    }

                    if (dragbar.classList.contains("volume")) {
                        video.volume = index
                        return
                    }
                })
            })
        })