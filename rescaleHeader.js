const header = document.getElementById("header");
const img = document.getElementById("rescale-image");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    console.log(scrollY)
    const maxScale = 0.01; // maximum scale factor
    const scale = 1 + scrollY / window.innerHeight * (maxScale - 1); // calculate the scale factor based on scroll position
    img.style.transform = `scale(${scale}, 1)`;
    header.style.transform = `scale(1, ${scale})`;
});