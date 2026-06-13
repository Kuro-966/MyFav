const gallery = document.getElementById("gallery");
const search = document.getElementById("search");
const tagArea = document.getElementById("tagArea");

const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const closeBtn = document.getElementById("close");

let data = [];
let selectedTag = "";

fetch("main.json")
.then(r => r.json())
.then(json => {

    data = json;

    createTags();
    render();

});

function createTags(){

    const tags = new Set();

    data.forEach(item => {

        item.tags.forEach(tag => {

            tags.add(tag);

        });

    });

    tags.forEach(tag => {

        const btn = document.createElement("div");

        btn.className = "tag";
        btn.textContent = tag;

        btn.onclick = () => {

            if(selectedTag === tag){

                selectedTag = "";

            }else{

                selectedTag = tag;

            }

            document
            .querySelectorAll(".tag")
            .forEach(t => t.classList.remove("active"));

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
    .filter(item => {

        const nameMatch =
            item.name
            .toLowerCase()
            .includes(keyword);

        const tagMatch =
            item.tags.some(tag =>
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
    .forEach(item => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.tags.join(" / ")}</p>
        `;

        const img =
            document.createElement("img");

        img.src =
            item.images[0];

        img.onclick = () => {

            openGallery(
                item.images
            );

        };

        card.appendChild(img);

        gallery.appendChild(card);

    });

}

function openGallery(images){

    popupContent.innerHTML = "";

    images.forEach(src => {

        const img =
            document.createElement("img");

        img.src = src;

        popupContent.appendChild(img);

    });

    popup.style.display = "block";

    document.body.style.overflow =
        "hidden";

}

function closeGallery(){

    popup.style.display = "none";

    popupContent.innerHTML = "";

    document.body.style.overflow =
        "";

}

search.addEventListener(
    "input",
    render
);

closeBtn.onclick =
    closeGallery;

document.addEventListener(
    "keydown",
    (e) => {

        if(
            popup.style.display !==
            "block"
        ) return;

        if(
            e.key === "Escape"
        ){

            closeGallery();

        }

    }
);
