const containers = document.querySelectorAll("div.ia21-player")/*'querySelectorAll' = pega todos daquele tipo*/
        
        containers.forEach(container => { /*forEach = Para cada elemento*/
            const playPause = container.querySelector("button.player-pause")
            const video = container.querySelector("video")
            const timeline = container.querySelector(".dragbar.timeline")
            const timelineDrag = timeline.querySelector(".draggable")
            const timer = container.querySelector(".timer")
            /*playPause.addEventListener("click", () => alert("ELANE!"))
            playPause.onclick = () => video.play()*/

            playPause.addEventListener("click", () => { /*Pausar e dar play*/
                if (video.paused) {
                    video.play()
                    playPause.innerText = playPause.dataset.pauseIcon
                    return
                }
                video.pause()
                playPause.innerText = playPause.dataset.playIcon
            })

            video.addEventListener("timeupdate", () => {/*Evento para verificação do tempo atual do video*/
                const percent = (video.currentTime / video.duration) * 100
                /*timelineDrag.style.setProperty("--porcent",`${percent}%`)
                timer.innerText = Math.floor(video.currentTime) Para mostrar o tempo em valores inteiros | em segundos (sem os zeros)*/
                /*seg = timer.innerText - 60
                if (timer.innerText >= 60) {
                    min = Math.floor(timer.innerText/60)
                    seg = Math.floor(timer.innerText%60)
                    timer.innerText = min + ":" + seg
                }*/
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
            
            // ---------------------------------------------------------
            
            const dragbars = container.querySelectorAll(".dragbar") /*'Div' onde fica a barra*/
            
            dragbars.forEach(dragbar => {
                const dragabble = dragbar.querySelector(".draggable") /*Div da barra em si*/
                if (dragbar.classList.contains("volume")) { /*Deixa o volume no maximo*/
                    dragabble.style.setProperty("--percent", `100%`)
                }

                dragbar.addEventListener("mousedawn", ev => {
                    dragbar.classList.add("dragging") /*Fornece classe*/
                })

                dragbar.addEventListener("mouseup", ev => {
                    dragbar.classList.remove("dragging")
                })

                dragbar.addEventListener("mouseout", ev => {
                    dragbar.classList.remove("dragging") /*Permite que arraste até o fim do elemento*/
                })

                dragbar.addEventListener("mousemove", ev => {
                    if (ev.target != dragbar || !dragbar.classList.contains("dragging")) /*Se tem a classe 'dragging' ou esta sendo movido na 'dragbar'*/
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