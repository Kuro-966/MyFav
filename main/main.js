const gallery = document.getElementById("gallery");
const search = document.getElementById("search");
const tagArea = document.getElementById("tagArea");

const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");

const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const counter = document.getElementById("counter");

let data = [];
let selectedTag = "";

let currentImages = [];
let currentIndex = 0;

fetch("main.json")
.then(r=>r.json())
.then(json=>{

    data = json;

    createTags();
    render();

});

function createTags(){

    const tags = new Set();

    data.forEach(item=>{

        item.tags.forEach(tag=>{

            tags.add(tag);

        });

    });

    tags.forEach(tag=>{

        const btn = document.createElement("div");

        btn.className = "tag";
        btn.textContent = tag;

        btn.onclick = ()=>{

            if(selectedTag === tag){

                selectedTag = "";

            }else{

                selectedTag = tag;

            }

            document
            .querySelectorAll(".tag")
            .forEach(t=>t.classList.remove("active"));

            if(selectedTag){

                btn.classList.add("active");

            }

            render();

        };

        tagArea.appendChild(btn);

    });

}

function render(){

    gallery.innerHTML = "";

    const keyword =
        search.value.toLowerCase();

    data
    .filter(item=>{

        const nameMatch =
            item.name.toLowerCase()
            .includes(keyword);

        const tagMatch =
            item.tags.some(tag=>
                tag.toLowerCase()
                .includes(keyword)
            );

        const searchMatch =
            keyword === "" ||
            nameMatch ||
            tagMatch;

        const selectedMatch =
            selectedTag === "" ||
            item.tags.includes(selectedTag);

        return searchMatch &&
               selectedMatch;

    })
    .forEach(item=>{

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.tags.join(" / ")}</p>
        `;

        const img =
            document.createElement("img");

        img.src = item.images[0];

        img.onclick = ()=>{

            openGallery(
                item.images,
                0
            );

        };

        card.appendChild(img);

        gallery.appendChild(card);

    });

}

function openGallery(images,index){

    currentImages = images;
    currentIndex = index;

    document.body.style.overflow =
        "hidden";

    popup.style.display = "flex";

    updateImage();

}

function updateImage(){

    popupImg.src =
        currentImages[currentIndex];

    counter.textContent =
        `${currentIndex + 1} / ${currentImages.length}`;

}

function nextImage(){

    currentIndex++;

    if(currentIndex >= currentImages.length){

        currentIndex = 0;

    }

    updateImage();

}

function prevImage(){

    currentIndex--;

    if(currentIndex < 0){

        currentIndex =
            currentImages.length - 1;

    }

    updateImage();

}

function closeGallery(){

    popup.style.display = "none";

    document.body.style.overflow =
        "";

}

search.addEventListener(
    "input",
    render
);

nextBtn.onclick =
    nextImage;

prevBtn.onclick =
    prevImage;

closeBtn.onclick =
    closeGallery;

popup.onclick = (e)=>{

    if(e.target === popup){

        closeGallery();

    }

};

document.addEventListener(
    "keydown",
    (e)=>{
if(
            popup.style.display !==
            "flex"
        ) return;

        if(e.key === "ArrowRight"){

            nextImage();

        }

        if(e.key === "ArrowLeft"){

            prevImage();

        }

        if(e.key === "Escape"){

            closeGallery();

        }

    }
);

let startX = 0;

popup.addEventListener(
    "touchstart",
    (e)=>{

        startX =
            e.touches[0].clientX;

    }
);

popup.addEventListener(
    "touchend",
    (e)=>{

        const endX =
            e.changedTouches[0]
            .clientX;

        const diff =
            startX - endX;

        if(diff > 50){

            nextImage();

        }

        if(diff < -50){

            prevImage();

        }

    }
);
