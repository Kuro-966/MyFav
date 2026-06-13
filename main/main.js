const gallery = document.getElementById("gallery");
const search = document.getElementById("search");
const tagArea = document.getElementById("tagArea");

const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const closeBtn = document.getElementById("close");

let data = [];
let selectedTag = "";

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

        btn.className="tag";
        btn.textContent=tag;

        btn.onclick=()=>{

            if(selectedTag===tag){
                selectedTag="";
            }else{
                selectedTag=tag;
            }

            document.querySelectorAll(".tag")
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

    gallery.innerHTML="";

    const keyword = search.value.toLowerCase();

    data
    .filter(item=>{

        const nameMatch =
            item.name.toLowerCase().includes(keyword);

        const tagMatch =
            item.tags.some(tag=>
                tag.toLowerCase().includes(keyword)
            );

        const searchMatch =
            keyword==="" || nameMatch || tagMatch;

        const selectedMatch =
            selectedTag==="" ||
            item.tags.includes(selectedTag);

        return searchMatch && selectedMatch;

    })
    .forEach(item=>{

        const card = document.createElement("div");
        card.className="card";

        card.innerHTML=
        `
        <h2>${item.name}</h2>
        <p>${item.tags.join(" / ")}</p>
        `;

        if(item.images.length===1){

            const box = document.createElement("div");
            box.className="single";

            const img = document.createElement("img");
            img.src=item.images[0];

            img.onclick=()=>{

                popup.style.display="flex";
                popupImg.src=img.src;

            };

            box.appendChild(img);
            card.appendChild(box);

        }else{

            const box = document.createElement("div");
            box.className="multi";

            item.images.forEach(src=>{

                const img=document.createElement("img");
                img.src=src;

                box.appendChild(img);

            });

            card.appendChild(box);

        }

        gallery.appendChild(card);

    });

}

search.addEventListener("input",render);

closeBtn.onclick=()=>{
    popup.style.display="none";
};

popup.onclick=(e)=>{

    if(e.target===popup){
        popup.style.display="none";
    }

};
