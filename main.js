

const $ =  document.querySelector.bind(document);
const $$ =  document.querySelector.bind(document);
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio  = $('#audio')
const cd = $('.cd')
const playBnt = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom : false,
    isRepeat : false,
    songs :
    [
        {
            name: 'Waiting for you',
            singer: 'MONO',
            path: './assets/music/song1.mp3',
            image: './assets/img/1.jpg',
        },
        {
            name: 'Chiều thu họa bóng nàng',
            singer: 'DatKa',
            path: './assets/music/song2.mp3',
            image: './assets/img/2.jpg',
        },
        {
            name: 'Anh không thể 1',
            singer: 'MONO',
            path: './assets/music/song3.mp3',
            image: './assets/img/1.jpg',
        },
        {
            name: 'Anh không thể 2',
            singer: 'MONO',
            path: './assets/music/song3.mp3',
            image: './assets/img/1.jpg',
        },
        {
            name: 'Anh không thể 3',
            singer: 'MONO',
            path: './assets/music/song3.mp3',

            image: './assets/img/1.jpg',
        },
        {
            name: 'Anh không thể 4',
            singer: 'MONO',
            path: './assets/music/song3.mp3',

            image: './assets/img/1.jpg',
        },
        {
            name: 'Anh không thể 5',
            singer: 'MONO',
            path: './assets/music/song3.mp3',

            image: './assets/img/1.jpg',
        },
        {
            name: 'Anh không thể 6',
            singer: 'MONO',
            path: './assets/music/song3.mp3',

            image: './assets/img/1.jpg',
        },
        
        
    ],
    render: function (){
        
        const htmls = this.songs.map((song, index)=>{
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index = ${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `

        });
        playList.innerHTML = htmls.join('');
        
    
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
            
    },

    loadCurrentSong: function(){
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
  

            

    handleEvents : function(){
        const _this = this;
        const cdWidth = cd.offsetWidth
        
        //xử lí CD quay
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }],{
            duration: 10000,
            iterations : Infinity
        })
        cdThumbAnimate.pause()




        // xử lí phóng to thu nhỏ khi croll
        document.onscroll = function(){
           const scrollTop = window.scrollY || document.documentElement.scrollTop
           const newCdWidth = cdWidth - scrollTop

           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
           cd.style.opacity = newCdWidth / cdWidth
        };

        // xử li button play
        playBnt.onclick = function(){
            if (_this.isPlaying){ 
                audio.pause()
            } else {   
                audio.play()
            }
            
        }
        // khi play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()


        }
        //khi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //tiến độ bài hát khi thay đổi
        audio.ontimeupdate = function(){
            if (audio.duration) {
                const progressPercen = Math.floor(audio.currentTime/audio.duration *100)
                progress.value = progressPercen
            }
        }
        // xử lí khi tua song
        progress.onchange = function(e){

            const seekTime = audio.duration/100 * e.target.value
            audio.currentTime = seekTime
        }

        //khi next song ->
        nextBtn.onclick = function(){
            if (_this.isRandom){
                _this.randomSong ()
            }
            else
            {_this.nextSong()}
            audio.play()
            _this.render()
            _this.scollToActiveSong()
        }
        //khi prev song ->
        prevBtn.onclick = function(){
            if (_this.isRandom){
                _this.randomSong ()

            }else{_this.prevSong()}
            audio.play()
            _this.render()
            _this.scollToActiveSong()

        }
        //khi bật/tắt random song
        randomBtn.onclick = function(){
           _this.isRandom = !_this.isRandom
           randomBtn.classList.toggle('active',_this.isRandom)   
        
        }
        //xử lý next khi ended

        audio.onended = function(){

            if (_this.isRepeat){

                audio.play()

            }else{

                nextBtn.click()
            }
        }
        // xử lí khi bấm repeat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // lắng ngh click vào play list
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if ( songNode || e.target.closest('.option'))
            {
                if (songNode) {
                    _this.currentIndex =Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                    


                }
            }
           
        }
        



    },
    scollToActiveSong: function(){
        setTimeout(() => {
            const scrollAll = $('.song.active')
            if (this.currentIndex < 1)
            {
                scrollAll.scrollIntoView({
                    behavior:'smooth',
                    block:'center',
                    inline:'nearest'
                })
            }else{
                scrollAll.scrollIntoView({
                    behavior:'smooth',
                    block:'nearest',
                    inline:'nearest'
    
                })
            }
        },300)





     },

    nextSong: function(){
        this.currentIndex ++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    randomSong: function (){
        let newIndex

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    
    },
    



    start: function(){
       

        this.handleEvents();

        this.render();
        this.defineProperties();
        this.loadCurrentSong();
        

    }



}

app.start()
