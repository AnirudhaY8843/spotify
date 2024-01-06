console.log("Lets begin with javascript....😁")


let currentSong = new Audio();

let songs ;
let currFolder;


// console.log(songs)
async function  getSongs(folder){
    currFolder =folder;
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();

    let div=document.createElement("div");
    div.innerHTML=response;
    let as = div.getElementsByTagName("a");

    songs=[];
   
   for (let index = 0; index < as.length; index++) {
        const element =as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    
   }
  
   
//    return songs
        
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        songUL.innerHTML ="";
        // show all the ongs in playlist
        console.log(songUL);
        for (const song of songs) {
            let artist ;
            if(song.includes("(")){
                artist= song.split("(")[1];
            artist= artist.split(")")[0];
            }
            songUL.innerHTML = songUL.innerHTML + `<li>
                                <img class="invert music" src="./images/music.svg" alt="music">
                                <div class="info">
                                    <div class="songname">${song.replaceAll("%20"," ")}</div>
                                    <div class="artist">${artist}</div>
                                </div>
                                <div class="playnow">
                                    <span>play now</span>
                                    <img class="invert" src="./images/play.svg" alt="play">
                                </div>
                            </li>`;
        }
        //attach an event listner to each song

        console.log("hello")
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
            e.addEventListener("click",element=>{
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
                console.log("Executed");
            });
        });
        return songs;
        

}




//time conversion

function secondsToTimeFormat(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Use String interpolation and toFixed to format the output as "00.00"
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    return formattedTime;
}
//music controller

const playMusic = (track ,pause=false)=>{
    // let audio =new Audio("/songs/"+track);
    currentSong.src = `/${currFolder}/`+track;
    if(!pause){
        currentSong.play();
        play.src="./images/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00.00";


}

//display album function

async function displayAlbum(){
    let a= await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a");

   let array =  Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        
        if(e.href.includes("/songs/")){
            // console.log(e.href.split("/").slice(-1)[0]);
            let folder= e.href.split("/").slice(-1)[0];
            let a =await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            // console.log(a)
            let response =await a.json();
            // console.log(response);
            let cardContainer=document.querySelector(".card-container");
            cardContainer.innerHTML=cardContainer.innerHTML+`
                    <div data-folder="${folder}" class="card radius">
                        <img src="/songs/${folder}/cover.jpg" alt="img">
                        <div class="play">
                            <img src="./images/playbutton.svg" alt="playbutton">
                        </div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
            `
        }
    };
      //loading playlist
      Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async (item) =>{
            // console.log(item.currentTarget.dataset.folder)
           songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    });
    
}


async function main(){
     //get the list of all songs
   
    
    songs =await getSongs("songs/cs");
    console.log(songs);
    playMusic(songs[0].replaceAll("%20"," "),true);

   
    
    displayAlbum();
    

    
    
    // attach eventlistner to play pause previous
    // play pause song
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="./images/pause.svg";

        }
        else{
            currentSong.pause();
            play.src="./images/play.svg";
        }
    })


    //listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(`${secondsToTimeFormat(currentSong.currentTime)}/${secondsToTimeFormat(currentSong.duration)}`)
        document.querySelector(".songtime").innerHTML = `${secondsToTimeFormat(currentSong.currentTime)}/${secondsToTimeFormat(currentSong.duration)}`
        let circle = document.querySelector(".circle");
        circle.style.left =(currentSong.currentTime/currentSong.duration)*100 + "%";
    })


    //add eventlistner for seekbar

    document.querySelector(".seekbar").addEventListener("click",(e)=>{

        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent+"%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100;
        
    })


    //add an event listner to the hamburgeer

    let hamburger = document.querySelector(".hamburger");
    hamburger.addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0px";
    })

    //add an event listner to the close

    let close = document.querySelector(".close");
    close.addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-140%";
    })

    //add eventlistner for previous and next

    // let previous= document.querySelector("#previous");
    //if previous is id then you can directly use that element without querySelector
    previous.addEventListener("click",()=>{
        currentSong.pause();
        console.log("previous clicked");
        console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1) >=0){
            playMusic(songs[index-1].replaceAll("%20"," "))
         }
     
    });

    next.addEventListener("click",()=>{
        currentSong.pause();
        console.log("next clicked");
        console.log(currentSong.src.split("/").slice(-1)[0])
        console.log(songs);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if((index+1) <songs.length){
           playMusic(songs[index+1].replaceAll("%20"," "))
        }
        console.log("executed");
    
    });


    //volume evnets
    let vol = document.querySelector(".range").getElementsByTagName("input")[0];
    console.log(vol)
    vol.addEventListener("change", (e)=>{
        console.log(e,e.target ,e.target.value);
        currentSong.volume = parseInt(e.target.value)/100;
    });

  //add event listner to mute
  document.querySelector(".volume>img").addEventListener("click",(e)=>{
    console.log(e.target)
        if(e.target.src.includes("/images/volume.svg")){
            e.target.src =e.target.src.replace("/images/volume.svg","/images/mute.svg");
            currentSong.volume=0;
        }else{
            currentSong.volume=.1;
            e.target.src=e.target.src.replace("/images/mute.svg","/images/volume.svg");
        }
  })
   

}

main();
