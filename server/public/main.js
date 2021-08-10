const showOverlay = (text, userName, userImage, userPoints, image, link) => {
  document.getElementById("commentText").innerText = text;
  document.getElementById("profileName").innerText = userName;
  document.getElementById("profileImage").src = userImage;
  document.getElementById("profilePoints").innerText = userPoints + "🔍";
  document.getElementById("comment").src = image;
  document.getElementById("commentLink").href = link;
  document.getElementById("commentLink").innerText = link;
  document.getElementById("overlay").style.bottom = "0";
};

const hideOverlay = () => {
  document.getElementById("overlay").style.bottom = "-100%";
};

const createMainComment = (
  text,
  userName,
  userImage,
  userPoints,
  image,
  link
) => {
  let node = document.getElementsByClassName("mainComment")[0].cloneNode(true);
  node.src = image;
  node.addEventListener("click", () => {
    showOverlay(text, userName, userImage, userPoints, image, link);
  });

  document.getElementById("mainWrap").appendChild(node);
};

const Fetch = async (
  url,
  json,
  options = { method: "POST", headers: { "Content-Type": "application/json" } }
) => {
  options.body = JSON.stringify(json);
  const result = await fetch(url, options);
  const resultJson = await result.json();
  return resultJson;
};

let scroll;

const initScroll = () => {
  document.getElementById("mainWrap").innerHTML = "";
  scroll = new scrollview();
  scroll.initScrollview(
    document.getElementById("mainWrap"),
    async (start, count) => {
      return await Fetch("./api/main", {
        start,
        count,
        search: document.getElementById("searchInput").value
          ? document.getElementById("searchInput").value
          : false,
      });
    },
    (res) => {
      for (let i in res.comments) {
        createMainComment(
          res.comments[i].text,
          res.comments[i].userName,
          res.comments[i].userImage,
          res.comments[i].userPoints,
          res.comments[i].image,
          res.comments[i].link
        );
      }
    }
  );
};

initScroll();

document.getElementById("searchInput").addEventListener("change", initScroll);
